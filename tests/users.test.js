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
describe('User endpoints', () => {
    test('POST /users creates a user', async () => {
        const response = await (0, supertest_1.default)(testUtils_1.default).post('/users').send({
            username: 'new-user',
            email: 'new-user@example.com',
            password: 'Password123!'
        });
        expect(response.status).toBe(201);
        expect(response.body.email).toBe('new-user@example.com');
    });
    test('GET /users returns list', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const listResponse = await (0, supertest_1.default)(testUtils_1.default)
            .get('/users')
            .set('Authorization', `Bearer ${response.body.accessToken}`);
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);
    });
    test('GET /users/:id returns user', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const userId = response.body.user.id;
        const getResponse = await (0, supertest_1.default)(testUtils_1.default)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${response.body.accessToken}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(userId);
    });
    test('PUT /users/:id updates user', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const userId = response.body.user.id;
        const updateResponse = await (0, supertest_1.default)(testUtils_1.default)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ username: 'updated' });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.username).toBe('updated');
    });
    test('DELETE /users/:id deletes user', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const userId = response.body.user.id;
        const deleteResponse = await (0, supertest_1.default)(testUtils_1.default)
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${response.body.accessToken}`);
        expect(deleteResponse.status).toBe(204);
    });
});
