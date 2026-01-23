import { Request, Response, Router } from 'express';
import { hashPassword, comparePassword } from '../utils/password';
import {
  addRefreshToken,
  createUser,
  findRefreshToken,
  findUserByEmail,
  findUserById,
  removeRefreshToken
} from '../store/inMemoryStore';
import {
  decodeToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/tokens';
import { sanitizeUser } from '../utils/sanitize';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body ?? {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ username, email, passwordHash });
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  const decoded = decodeToken(refreshToken);

  addRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : new Date().toISOString()
  });

  return res.status(201).json({
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  const decoded = decodeToken(refreshToken);

  addRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : new Date().toISOString()
  });

  return res.json({
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  });
});

router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  const stored = findRefreshToken(hashToken(refreshToken));
  if (!stored) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.sub as string;
    if (!findUserById(userId) || stored.userId !== userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const accessToken = signAccessToken(userId);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }
  removeRefreshToken(hashToken(refreshToken));
  return res.status(204).send();
});

export default router;
