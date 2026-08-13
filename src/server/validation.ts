import { Request, Response, NextFunction } from 'express';

/**
 * Validates email structures with standard RFC regex comparison
 */
const isValidEmailByRegex = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password, role } = req.body;

  if (!email || typeof email !== 'string' || !isValidEmailByRegex(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be a valid string of at least 2 characters.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password is required and must exceed 6 characters for security.' });
  }

  if (role && !['CUSTOMER', 'SELLER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid privilege registration role. Must be CUSTOMER, SELLER or ADMIN.' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required fields.' });
  }

  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, price, category, stock } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Product title is required and cannot be empty.' });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'Product price must be a valid number greater than zero.' });
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'Product category is required.' });
  }

  if (stock !== undefined) {
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: 'Product inventory stock cannot be negative.' });
    }
  }

  next();
};

export const validateAddress = (req: Request, res: Response, next: NextFunction) => {
  const { fullName, phone, street, city, state, zipCode } = req.body;

  if (!fullName || !phone || !street || !city || !state || !zipCode) {
    return res.status(400).json({ error: 'Full address details are required: fullName, phone, street, city, state, zipCode.' });
  }

  next();
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { items, subtotal, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one catalog item.' });
  }

  if (isNaN(parseFloat(subtotal)) || subtotal < 0) {
    return res.status(400).json({ error: 'A valid commercial order subtotal is required.' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping details and addresses are required to complete delivery.' });
  }

  if (paymentMethod && !['STRIPE', 'RAZORPAY', 'UPI', 'COD'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid or unsupported checkout payment carrier.' });
  }

  next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;

  const score = parseInt(rating);
  if (isNaN(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Product feedback reviews require a numeric rating between 1 and 5 stars.' });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    return res.status(400).json({ error: 'Please supply a meaningful verification comment (5+ characters).' });
  }

  next();
};
