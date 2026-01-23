import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  getUsers,
  updateUser
} from '../store/inMemoryStore';
import { hashPassword } from '../utils/password';
import { sanitizeUser } from '../utils/sanitize';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const users = getUsers().map(sanitizeUser);
  return res.json(users);
});

router.get('/:userId', authenticate, (req, res) => {
  const user = findUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(sanitizeUser(user));
});

router.post('/', async (req, res) => {
  const { username, email, password } = req.body ?? {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ username, email, passwordHash });
  return res.status(201).json(sanitizeUser(user));
});

router.put('/:userId', authenticate, async (req: AuthenticatedRequest, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { username, email, password } = req.body ?? {};
  if (!username && !email && !password) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }

  if (email) {
    const existing = findUserByEmail(email);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
  }

  const passwordHash = password ? await hashPassword(password) : undefined;
  const user = updateUser(userId, { username, email, passwordHash });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(sanitizeUser(user));
});

router.delete('/:userId', authenticate, (req: AuthenticatedRequest, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const deleted = deleteUser(userId);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.status(204).send();
});

export default router;
