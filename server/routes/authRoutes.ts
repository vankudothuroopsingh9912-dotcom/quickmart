import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Address } from '../../src/types';

export const authRouter = Router();

// Register new customer
authRouter.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role: 'customer' as const,
    phone: phone || '',
    passwordHash: password,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    addresses: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  const token = `${newUser.id}:${Date.now()}`;
  const { passwordHash, ...userClean } = newUser;

  return res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: userClean
  });
});

// Login customer or admin
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = `${user.id}:${Date.now()}`;
  const { passwordHash, ...userClean } = user;

  return res.json({
    success: true,
    message: 'Welcome back to QuickMart!',
    token,
    user: userClean
  });
});

// Get current profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { passwordHash, ...userClean } = req.user;
  return res.json({ success: true, user: userClean });
});

// Update profile details
authRouter.put('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { name, phone } = req.body;
  const user = req.user;

  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();

  const { passwordHash, ...userClean } = user;
  return res.json({ success: true, message: 'Profile updated successfully!', user: userClean });
});

// Add address
authRouter.post('/address', authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const { fullName, street, city, state, postalCode, country, phone, isDefault } = req.body;

  if (!fullName || !street || !city || !postalCode) {
    return res.status(400).json({ success: false, message: 'Please fill all required address fields.' });
  }

  if (!user.addresses) user.addresses = [];

  if (isDefault) {
    user.addresses.forEach((a: Address) => (a.isDefault = false));
  }

  const newAddress: Address = {
    id: `addr-${Date.now()}`,
    fullName,
    street,
    city,
    state,
    postalCode,
    country: country || 'United States',
    phone: phone || user.phone || '',
    isDefault: isDefault || user.addresses.length === 0
  };

  user.addresses.push(newAddress);

  return res.json({ success: true, message: 'Address saved successfully!', addresses: user.addresses });
});

// Delete address
authRouter.delete('/address/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user.addresses) user.addresses = [];
  user.addresses = user.addresses.filter((a: Address) => a.id !== id);

  return res.json({ success: true, message: 'Address deleted.', addresses: user.addresses });
});

// Forgot password
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  // Always return friendly message for security
  return res.json({
    success: true,
    message: user
      ? `A password reset link and verification code have been dispatched to ${email}.`
      : 'If an account matches that email address, password reset instructions have been dispatched.'
  });
});
