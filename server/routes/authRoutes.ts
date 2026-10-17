import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

// Register new user
authRouter.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existingEmail = db.findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const generatedUsername = username?.trim().toLowerCase() || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const existingUsername = db.findUserByUsername(generatedUsername);
  const finalUsername = existingUsername ? `${generatedUsername}_${Math.floor(100 + Math.random() * 900)}` : generatedUsername;

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    username: finalUsername,
    email: email.toLowerCase().trim(),
    passwordHash: password,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    bio: 'Excited to be on ChatFlow! Connect and chat anytime.',
    status: 'online' as const,
    role: 'user' as const,
    lastSeen: new Date().toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light' as const,
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone' as const
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  const token = `${newUser.id}:${Date.now()}`;

  return res.status(201).json({
    success: true,
    message: 'Welcome to ChatFlow! Account created successfully.',
    token,
    user: db.sanitizeUser(newUser)
  });
});

// Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ success: false, message: 'This account has been suspended by administration.' });
  }

  user.status = 'online';
  user.lastSeen = new Date().toISOString();
  const token = `${user.id}:${Date.now()}`;

  return res.json({
    success: true,
    message: 'Welcome back!',
    token,
    user: db.sanitizeUser(user)
  });
});

// Get current profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  return res.json({
    success: true,
    user: db.sanitizeUser(req.user)
  });
});

// Update profile
authRouter.put('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const { name, bio, avatar, customStatus, settings } = req.body;

  if (name) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar) user.avatar = avatar;
  if (customStatus !== undefined) user.customStatus = customStatus;
  if (settings) user.settings = { ...user.settings, ...settings };

  return res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: db.sanitizeUser(user)
  });
});

// Update status
authRouter.put('/status', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { status, customStatus } = req.body;
  const user = req.user;

  if (status) user.status = status;
  if (customStatus !== undefined) user.customStatus = customStatus;
  user.lastSeen = new Date().toISOString();

  return res.json({
    success: true,
    user: db.sanitizeUser(user)
  });
});

// Forgot password
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  return res.json({
    success: true,
    message: `If an account with ${email} exists, a password reset link has been dispatched.`
  });
});
