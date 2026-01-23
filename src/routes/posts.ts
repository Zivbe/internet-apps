import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';
import {
  createPost,
  deletePost,
  findPostById,
  getPosts,
  updatePost
} from '../store/inMemoryStore';

const router = Router();

router.get('/', (req, res) => {
  const authorId = typeof req.query.authorId === 'string' ? req.query.authorId : undefined;
  const posts = getPosts(authorId);
  return res.json(posts);
});

router.get('/:postId', (req, res) => {
  const post = findPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  return res.json(post);
});

router.post('/', authenticate, (req: AuthenticatedRequest, res) => {
  const { title, content } = req.body ?? {};
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const post = createPost({
    title,
    content,
    authorId: req.userId as string
  });
  return res.status(201).json(post);
});

router.put('/:postId', authenticate, (req: AuthenticatedRequest, res) => {
  const { title, content } = req.body ?? {};
  if (!title && !content) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }

  const post = findPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = updatePost(req.params.postId, { title, content });
  return res.json(updated);
});

router.delete('/:postId', authenticate, (req: AuthenticatedRequest, res) => {
  const post = findPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (post.authorId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  deletePost(req.params.postId);
  return res.status(204).send();
});

export default router;
