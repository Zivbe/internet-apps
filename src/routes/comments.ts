import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';
import {
  createComment,
  deleteComment,
  findCommentById,
  findPostById,
  getComments,
  updateComment
} from '../store/inMemoryStore';

const router = Router();

router.get('/', (req, res) => {
  const postId = typeof req.query.postId === 'string' ? req.query.postId : undefined;
  const comments = getComments(postId);
  return res.json(comments);
});

router.get('/:commentId', (req, res) => {
  const comment = findCommentById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  return res.json(comment);
});

router.post('/', authenticate, (req: AuthenticatedRequest, res) => {
  const { content, postId } = req.body ?? {};
  if (!content || !postId) {
    return res.status(400).json({ error: 'content and postId are required' });
  }

  const post = findPostById(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const comment = createComment({
    content,
    postId,
    authorId: req.userId as string
  });
  return res.status(201).json(comment);
});

router.put('/:commentId', authenticate, (req: AuthenticatedRequest, res) => {
  const { content } = req.body ?? {};
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  const comment = findCommentById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  if (comment.authorId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = updateComment(req.params.commentId, { content });
  return res.json(updated);
});

router.delete('/:commentId', authenticate, (req: AuthenticatedRequest, res) => {
  const comment = findCommentById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  if (comment.authorId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  deleteComment(req.params.commentId);
  return res.status(204).send();
});

export default router;
