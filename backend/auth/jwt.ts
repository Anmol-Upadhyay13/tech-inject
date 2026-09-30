import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.ts';
import { SessionUser } from '../../packages/types/auth.ts';

const JWT_SECRET = process.env.AUTH_SECRET || 'tech_inject_super_secret_signing_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: SessionUser;
}

export function generateToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: 'customer' | 'admin';
    };

    // Query live user record from database to guarantee immediate revocation
    const userRow = db.prepare('SELECT id, email, name, role, is_premium FROM users WHERE id = ?').get(payload.id) as {
      id: string;
      email: string;
      name: string;
      role: 'customer' | 'admin';
      is_premium: number;
    } | undefined;

    if (!userRow) return null;

    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role,
      isPremium: Boolean(userRow.is_premium),
    };
  } catch {
    return null;
  }
}

export function extractToken(req: Request): string | null {
  // Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check query token parameter (useful for CLI installer & downloads)
  if (typeof req.query.token === 'string') {
    return req.query.token;
  }

  // Check cookies
  if (req.cookies && req.cookies.tech_inject_token) {
    return req.cookies.tech_inject_token;
  }

  return null;
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Administrator privileges required.' });
    }
    next();
  });
}
