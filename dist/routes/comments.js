"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const inMemoryStore_1 = require("../store/inMemoryStore");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const postId = typeof req.query.postId === 'string' ? req.query.postId : undefined;
    const comments = (0, inMemoryStore_1.getComments)(postId);
    return res.json(comments);
});
router.get('/:commentId', (req, res) => {
    const comment = (0, inMemoryStore_1.findCommentById)(req.params.commentId);
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    return res.json(comment);
});
router.post('/', authenticate_1.authenticate, (req, res) => {
    const { content, postId } = req.body ?? {};
    if (!content || !postId) {
        return res.status(400).json({ error: 'content and postId are required' });
    }
    const post = (0, inMemoryStore_1.findPostById)(postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const comment = (0, inMemoryStore_1.createComment)({
        content,
        postId,
        authorId: req.userId
    });
    return res.status(201).json(comment);
});
router.put('/:commentId', authenticate_1.authenticate, (req, res) => {
    const { content } = req.body ?? {};
    if (!content) {
        return res.status(400).json({ error: 'content is required' });
    }
    const comment = (0, inMemoryStore_1.findCommentById)(req.params.commentId);
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.authorId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = (0, inMemoryStore_1.updateComment)(req.params.commentId, { content });
    return res.json(updated);
});
router.delete('/:commentId', authenticate_1.authenticate, (req, res) => {
    const comment = (0, inMemoryStore_1.findCommentById)(req.params.commentId);
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.authorId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    (0, inMemoryStore_1.deleteComment)(req.params.commentId);
    return res.status(204).send();
});
exports.default = router;
