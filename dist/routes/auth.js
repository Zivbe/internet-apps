"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_1 = require("../utils/password");
const inMemoryStore_1 = require("../store/inMemoryStore");
const tokens_1 = require("../utils/tokens");
const sanitize_1 = require("../utils/sanitize");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, and password are required' });
    }
    const existing = (0, inMemoryStore_1.findUserByEmail)(email);
    if (existing) {
        return res.status(409).json({ error: 'Email is already registered' });
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = (0, inMemoryStore_1.createUser)({ username, email, passwordHash });
    const accessToken = (0, tokens_1.signAccessToken)(user.id);
    const refreshToken = (0, tokens_1.signRefreshToken)(user.id);
    const decoded = (0, tokens_1.decodeToken)(refreshToken);
    (0, inMemoryStore_1.addRefreshToken)({
        tokenHash: (0, tokens_1.hashToken)(refreshToken),
        userId: user.id,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : new Date().toISOString()
    });
    return res.status(201).json({
        user: (0, sanitize_1.sanitizeUser)(user),
        accessToken,
        refreshToken
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }
    const user = (0, inMemoryStore_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = (0, tokens_1.signAccessToken)(user.id);
    const refreshToken = (0, tokens_1.signRefreshToken)(user.id);
    const decoded = (0, tokens_1.decodeToken)(refreshToken);
    (0, inMemoryStore_1.addRefreshToken)({
        tokenHash: (0, tokens_1.hashToken)(refreshToken),
        userId: user.id,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : new Date().toISOString()
    });
    return res.json({
        user: (0, sanitize_1.sanitizeUser)(user),
        accessToken,
        refreshToken
    });
});
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken is required' });
    }
    const stored = (0, inMemoryStore_1.findRefreshToken)((0, tokens_1.hashToken)(refreshToken));
    if (!stored) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
    try {
        const payload = (0, tokens_1.verifyRefreshToken)(refreshToken);
        const userId = payload.sub;
        if (!(0, inMemoryStore_1.findUserById)(userId) || stored.userId !== userId) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        const accessToken = (0, tokens_1.signAccessToken)(userId);
        return res.json({ accessToken });
    }
    catch {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});
router.post('/logout', (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken is required' });
    }
    (0, inMemoryStore_1.removeRefreshToken)((0, tokens_1.hashToken)(refreshToken));
    return res.status(204).send();
});
exports.default = router;
