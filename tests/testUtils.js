"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = exports.resetTestCounter = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
let counter = 0;
const resetTestCounter = () => {
    counter = 0;
};
exports.resetTestCounter = resetTestCounter;
const createTestUser = async () => {
    counter += 1;
    const payload = {
        username: `user${counter}`,
        email: `user${counter}@example.com`,
        password: 'Password123!'
    };
    const response = await (0, supertest_1.default)(app_1.default).post('/auth/register').send(payload);
    return {
        response
    };
};
exports.createTestUser = createTestUser;
exports.default = app_1.default;
