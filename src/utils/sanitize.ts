import { User } from '../store/inMemoryStore';

export const sanitizeUser = (user: User) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
