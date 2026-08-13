import { Router, Request, Response } from 'express';
import { dbStore } from '../db';
import { prisma } from '../prisma';
import {
  hashPassword,
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken
} from '../auth';
import { validateRegister, validateLogin } from '../validation';
import { User, Notification } from '../../types';

const router = Router();

// Helper to generate IDs
const generateId = (prefix: string = 'id') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new system user (with password hashing, referrals, notifications)
 */
router.post('/register', validateRegister, async (req: Request, res: Response) => {
  const { email, name, password, role, referredBy } = req.body;

  try {
    const defaultPoints = 100; // Registration bonus points
    const referralCode = `SPHERE-${name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const pwHash = await hashPassword(password);

    // If DATABASE_URL is present, we run absolute production Prisma queries!
    if (process.env.DATABASE_URL) {
      const existingUser = await prisma.user.findFirst({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User address already registered in catalog.' });
      }

      let refereeAward = defaultPoints;

      // Handle referrals rewards points securely
      if (referredBy) {
        const referrer = await prisma.user.findFirst({
          where: { referralCode: referredBy }
        });
        if (referrer) {
          await prisma.user.update({
            where: { id: referrer.id },
            data: { rewardPoints: referrer.rewardPoints + 200 }
          });
          refereeAward += 150; // extra reward for referees
        }
      }

      const pUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash: pwHash,
          role: role || 'CUSTOMER',
          rewardPoints: refereeAward,
          referralCode,
          referredBy,
          verified: true
        }
      });

      // Issue confirmation notification
      await prisma.notification.create({
        data: {
          userId: pUser.id,
          title: 'Welcome to ShopSphere!',
          message: `Hello ${name}! We have credited ${refereeAward} shopping Reward Points to your wallet.`,
          type: 'SECURITY',
          read: false
        }
      });

      const userPayload = { id: pUser.id, email: pUser.email, role: pUser.role as any };
      const token = generateAccessToken(userPayload);
      const refresh = generateRefreshToken(userPayload);

      return res.status(201).json({
        user: {
          id: pUser.id,
          email: pUser.email,
          name: pUser.name,
          role: pUser.role,
          rewardPoints: pUser.rewardPoints,
          referralCode: pUser.referralCode,
          verified: pUser.verified,
          createdAt: pUser.createdAt.toISOString()
        },
        token,
        refreshToken: refresh
      });
    }

    // --- FALLBACK METRICS ---
    const existingUsers = dbStore.getUsers();
    if (existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User address already registered in catalog.' });
    }

    const userId = generateId('user');
    let rewardPoints = defaultPoints;
    if (referredBy) {
      const referrer = existingUsers.find(u => u.referralCode === referredBy);
      if (referrer) {
        referrer.rewardPoints += 200;
        rewardPoints += 150;
      }
    }

    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      name,
      role: role || 'CUSTOMER',
      rewardPoints,
      referralCode,
      referredBy,
      verified: true,
      createdAt: new Date().toISOString()
    };

    dbStore.addUser(newUser, password); // Note: Simple JSON db stores raw or simple password for demo cycles

    const greetingNotif: Notification = {
      id: generateId('notif'),
      userId,
      title: 'Registration Successful!',
      message: `Welcome to ShopSphere, ${name}! We have credited ${rewardPoints} reward points to your account.`,
      type: 'SECURITY',
      read: false,
      createdAt: new Date().toISOString()
    };
    dbStore.addNotification(greetingNotif);

    const userPayloadFallback = { id: newUser.id, email: newUser.email, role: newUser.role };
    const token = generateAccessToken(userPayloadFallback);
    const refresh = generateRefreshToken(userPayloadFallback);

    res.status(201).json({
      user: newUser,
      token,
      refreshToken: refresh
    });

  } catch (err: any) {
    console.error('Registration API Error:', err);
    res.status(500).json({ error: 'Internal system fault occurred during registration.' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates customer/seller credentials and issues Access + Refresh Tokens
 */
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (process.env.DATABASE_URL) {
      const pUser = await prisma.user.findFirst({
        where: { email: email.toLowerCase() }
      });

      if (!pUser || !(await comparePasswords(password, pUser.passwordHash))) {
        return res.status(401).json({ error: 'Incorrect email or password combination.' });
      }

      const payload = { id: pUser.id, email: pUser.email, role: pUser.role as any };
      const token = generateAccessToken(payload);
      const refresh = generateRefreshToken(payload);

      return res.json({
        user: {
          id: pUser.id,
          email: pUser.email,
          name: pUser.name,
          role: pUser.role,
          rewardPoints: pUser.rewardPoints,
          referralCode: pUser.referralCode,
          verified: pUser.verified,
          createdAt: pUser.createdAt.toISOString()
        },
        token,
        refreshToken: refresh
      });
    }

    // --- FALLBACK ---
    const user = dbStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    const pws = dbStore.getPasswords();

    if (!user || pws[user.id] !== password) {
      return res.status(401).json({ error: 'Incorrect email or password combination.' });
    }

    const fallbackPayload = { id: user.id, email: user.email, role: user.role };
    const token = generateAccessToken(fallbackPayload);
    const refresh = generateRefreshToken(fallbackPayload);

    res.json({
      user,
      token,
      refreshToken: refresh
    });

  } catch (err: any) {
    console.error('Login Endpoint Error:', err);
    res.status(500).json({ error: 'Failed to complete login operations due to severe host logs errors.' });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Re-issues a short-fuse access token using a valid persistent refresh token
 */
router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token parameter is missing.' });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or revoked token payload. Re-login is required.' });
  }

  const token = generateAccessToken(payload);
  const nextRefresh = generateRefreshToken(payload);

  // Revoke old token to achieve rotation security
  revokeRefreshToken(refreshToken);

  res.json({
    token,
    refreshToken: nextRefresh
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Revokes a refresh token immediately to safely terminate session
 */
router.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }
  res.json({ success: true, message: 'Revocations successfully synced.' });
});

/**
 * @route   GET /api/auth/me/:userId
 * @desc    Fetch specific user verification profile
 */
router.get('/me/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (process.env.DATABASE_URL) {
      const pUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!pUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({
        id: pUser.id,
        email: pUser.email,
        name: pUser.name,
        role: pUser.role,
        rewardPoints: pUser.rewardPoints,
        referralCode: pUser.referralCode,
        verified: pUser.verified,
        createdAt: pUser.createdAt.toISOString()
      });
    }

    const user = dbStore.getUsers().find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found in demo index.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Database read failure.' });
  }
});

/**
 * @route   PATCH /api/auth/theme
 * @desc    Updates user theme preferences
 */
router.patch('/theme', async (req: Request, res: Response) => {
  const { userId, theme } = req.body;
  if (!userId || !theme) {
    return res.status(400).json({ error: 'Missing userId or theme parameters.' });
  }
  try {
    if (process.env.DATABASE_URL) {
      await prisma.user.update({
        where: { id: userId },
        data: { theme } as any
      });
    }
    dbStore.updateUserTheme(userId, theme);
    res.json({ success: true, theme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user theme preferences.' });
  }
});

export default router;
