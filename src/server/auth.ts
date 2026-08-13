import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'shopsphere-default-sign-jwt-2026-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'shopsphere-default-refresh-jwt-2026-secret';

// Types and request interface extensions
export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

// Memory database for blacklisted or active refresh tokens
const activeRefreshTokens = new Set<string>();

/**
 * Hashing helper functions
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * JWT issue helpers
 */
export const generateAccessToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // 15 Minute short-fuse access token
};

export const generateRefreshToken = (payload: AuthUserPayload): string => {
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // 7-day persistent Refresh Token
  activeRefreshTokens.add(token);
  return token;
};

export const revokeRefreshToken = (token: string): boolean => {
  return activeRefreshTokens.delete(token);
};

export const verifyRefreshToken = (token: string): AuthUserPayload | null => {
  if (!activeRefreshTokens.has(token)) {
    return null;
  }
  try {
    const verified = jwt.verify(token, JWT_REFRESH_SECRET) as AuthUserPayload;
    return {
      id: verified.id,
      email: verified.email,
      role: verified.role
    };
  } catch (err) {
    activeRefreshTokens.delete(token); // Scrub invalid/expired token
    return null;
  }
};

/**
 * Authentication Middleware
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authorization Bearer token is missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

/**
 * Role-Based Authorization Middleware
 */
export const requireRole = (allowedRoles: ('CUSTOMER' | 'SELLER' | 'ADMIN')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized user access' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden access. This action requires one of the following roles: [${allowedRoles.join(', ')}]. Your current role is: ${req.user.role}` 
      });
    }

    next();
  };
};
