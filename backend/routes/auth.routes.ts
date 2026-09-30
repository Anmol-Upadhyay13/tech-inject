import { Router, Response } from 'express';
import { db, verifyPassword } from '../db/database.ts';
import { generateToken, requireAuth, AuthenticatedRequest } from '../auth/jwt.ts';
import { loginSchema } from '../../packages/validation/auth.schema.ts';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Invalid credentials' });
  }

  const { email, password } = parseResult.data;

  const user = db.prepare('SELECT id, email, password_hash, name, role, is_premium FROM users WHERE email = ?').get(email) as {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    role: 'customer' | 'admin';
    is_premium: number;
  } | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password. Please verify credentials.' });
  }

  // Update last login
  const now = new Date().toISOString();
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(now, user.id);

  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isPremium: Boolean(user.is_premium),
  };

  const token = generateToken(sessionUser);

  // Set cookie for browser session
  res.cookie('tech_inject_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    user: sessionUser,
    token,
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    user: req.user,
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req, res: Response) => {
  res.clearCookie('tech_inject_token');
  return res.json({ success: true, message: 'Logged out successfully' });
});
