"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const inMemoryStore_1 = require("../store/inMemoryStore");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const authorId = typeof req.query.authorId === 'string' ? req.query.authorId : undefined;
    const posts = (0, inMemoryStore_1.getPosts)(authorId);
    return res.json(posts);
});
router.get('/:postId', (req, res) => {
    const post = (0, inMemoryStore_1.findPostById)(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(post);
});
router.post('/', authenticate_1.authenticate, (req, res) => {
    const { title, content } = req.body ?? {};
    if (!title || !content) {
        return res.status(400).json({ error: 'title and content are required' });
    }
    const post = (0, inMemoryStore_1.createPost)({
        title,
        content,
        authorId: req.userId
    });
    return res.status(201).json(post);
});
router.put('/:postId', authenticate_1.authenticate, (req, res) => {
    const { title, content } = req.body ?? {};
    if (!title && !content) {
        return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    const post = (0, inMemoryStore_1.findPostById)(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (post.authorId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = (0, inMemoryStore_1.updatePost)(req.params.postId, { title, content });
    return res.json(updated);
});
router.delete('/:postId', authenticate_1.authenticate, (req, res) => {
    const post = (0, inMemoryStore_1.findPostById)(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (post.authorId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    (0, inMemoryStore_1.deletePost)(req.params.postId);
    return res.status(204).send();
});
exports.default = router;
