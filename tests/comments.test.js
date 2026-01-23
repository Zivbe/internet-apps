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
describe('Comment endpoints', () => {
    test('POST /comment creates a comment', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const postResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/post')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ title: 'Post', content: 'Content' });
        const commentResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/comment')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ postId: postResponse.body.id, content: 'Nice' });
        expect(commentResponse.status).toBe(201);
        expect(commentResponse.body.content).toBe('Nice');
    });
    test('GET /comment returns list', async () => {
        const listResponse = await (0, supertest_1.default)(testUtils_1.default).get('/comment');
        expect(listResponse.status).toBe(200);
    });
    test('GET /comment/:id returns comment', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const postResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/post')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ title: 'Post', content: 'Content' });
        const commentResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/comment')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ postId: postResponse.body.id, content: 'Nice' });
        const getResponse = await (0, supertest_1.default)(testUtils_1.default).get(`/comment/${commentResponse.body.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(commentResponse.body.id);
    });
    test('PUT /comment/:id updates comment', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const postResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/post')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ title: 'Post', content: 'Content' });
        const commentResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/comment')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ postId: postResponse.body.id, content: 'Nice' });
        const updateResponse = await (0, supertest_1.default)(testUtils_1.default)
            .put(`/comment/${commentResponse.body.id}`)
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ content: 'Updated' });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.content).toBe('Updated');
    });
    test('DELETE /comment/:id deletes comment', async () => {
        const { response } = await (0, testUtils_1.createTestUser)();
        const postResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/post')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ title: 'Post', content: 'Content' });
        const commentResponse = await (0, supertest_1.default)(testUtils_1.default)
            .post('/comment')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({ postId: postResponse.body.id, content: 'Nice' });
        const deleteResponse = await (0, supertest_1.default)(testUtils_1.default)
            .delete(`/comment/${commentResponse.body.id}`)
            .set('Authorization', `Bearer ${response.body.accessToken}`);
        expect(deleteResponse.status).toBe(204);
    });
});
