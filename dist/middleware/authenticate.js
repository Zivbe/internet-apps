"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const tokens_1 = require("../utils/tokens");
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = header.slice('Bearer '.length).trim();
    try {
        const payload = (0, tokens_1.verifyAccessToken)(token);
        req.userId = payload.sub;
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired access token' });
    }
};
exports.authenticate = authenticate;
