"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = __importStar(require("./testUtils"));
const inMemoryStore_1 = require("../src/store/inMemoryStore");
beforeEach(() => {
    (0, inMemoryStore_1.resetStore)();
    (0, testUtils_1.resetTestCounter)();
});
describe('Auth endpoints', () => {
    test('POST /auth/register registers a user', async () => {
        const response = await (0, supertest_1.default)(testUtils_1.default).post('/auth/register').send({
            username: 'demo',
            email: 'demo@example.com',
            password: 'Password123!'
        });
        expect(response.status).toBe(201);
        expect(response.body.user.email).toBe('demo@example.com');
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
    test('POST /auth/login returns tokens', async () => {
        await (0, testUtils_1.createTestUser)();
        const response = await (0, supertest_1.default)(testUtils_1.default).post('/auth/login').send({
            email: 'user1@example.com',
            password: 'Password123!'
        });
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
    test('POST /auth/refresh returns a new access token', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const refreshResponse = await (0, supertest_1.default)(testUtils_1.default).post('/auth/refresh').send({
            refreshToken: response.body.refreshToken
        });
        expect(refreshResponse.status).toBe(200);
        expect(refreshResponse.body.accessToken).toBeDefined();
    });
    test('POST /auth/logout revokes refresh token', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const logoutResponse = await (0, supertest_1.default)(testUtils_1.default).post('/auth/logout').send({
            refreshToken: response.body.refreshToken
        });
        expect(logoutResponse.status).toBe(204);
    });
});
