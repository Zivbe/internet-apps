import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

const getAccessTokenSecret = () => process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const getRefreshTokenSecret = () => process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const getAccessTokenTtl = () => process.env.ACCESS_TOKEN_TTL || '15m';
const getRefreshTokenTtl = () => process.env.REFRESH_TOKEN_TTL || '7d';

export const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId }, getAccessTokenSecret(), { expiresIn: getAccessTokenTtl() });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ sub: userId }, getRefreshTokenSecret(), { expiresIn: getRefreshTokenTtl() });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, getAccessTokenSecret()) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, getRefreshTokenSecret()) as JwtPayload;

export const decodeToken = (token: string) => jwt.decode(token) as JwtPayload | null;

export const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
