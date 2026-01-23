"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const inMemoryStore_1 = require("../store/inMemoryStore");
const password_1 = require("../utils/password");
const sanitize_1 = require("../utils/sanitize");
const router = (0, express_1.Router)();
router.get('/', authenticate_1.authenticate, (req, res) => {
    const users = (0, inMemoryStore_1.getUsers)().map(sanitize_1.sanitizeUser);
    return res.json(users);
});
router.get('/:userId', authenticate_1.authenticate, (req, res) => {
    const user = (0, inMemoryStore_1.findUserById)(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json((0, sanitize_1.sanitizeUser)(user));
});
router.post('/', async (req, res) => {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, and password are required' });
    }
    if ((0, inMemoryStore_1.findUserByEmail)(email)) {
        return res.status(409).json({ error: 'Email is already registered' });
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = (0, inMemoryStore_1.createUser)({ username, email, passwordHash });
    return res.status(201).json((0, sanitize_1.sanitizeUser)(user));
});
router.put('/:userId', authenticate_1.authenticate, async (req, res) => {
    const { userId } = req.params;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { username, email, password } = req.body ?? {};
    if (!username && !email && !password) {
        return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    if (email) {
        const existing = (0, inMemoryStore_1.findUserByEmail)(email);
        if (existing && existing.id !== userId) {
            return res.status(409).json({ error: 'Email is already registered' });
        }
    }
    const passwordHash = password ? await (0, password_1.hashPassword)(password) : undefined;
    const user = (0, inMemoryStore_1.updateUser)(userId, { username, email, passwordHash });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json((0, sanitize_1.sanitizeUser)(user));
});
router.delete('/:userId', authenticate_1.authenticate, (req, res) => {
    const { userId } = req.params;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const deleted = (0, inMemoryStore_1.deleteUser)(userId);
    if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(204).send();
});
exports.default = router;
