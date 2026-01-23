import request from 'supertest';
import app, { createTestUser, resetTestCounter } from './testUtils';
import { resetStore } from '../src/store/inMemoryStore';

beforeEach(() => {
  resetStore();
  resetTestCounter();
});

describe('Auth endpoints', () => {
  test('POST /auth/register registers a user', async () => {
    const response = await request(app).post('/auth/register').send({
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
    await createTestUser();
    const response = await request(app).post('/auth/login').send({
      email: 'user1@example.com',
      password: 'Password123!'
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  test('POST /auth/refresh returns a new access token', async () => {
    const { response } = await createTestUser();
    const refreshResponse = await request(app).post('/auth/refresh').send({
      refreshToken: response.body.refreshToken
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.accessToken).toBeDefined();
  });

  test('POST /auth/logout revokes refresh token', async () => {
    const { response } = await createTestUser();
    const logoutResponse = await request(app).post('/auth/logout').send({
      refreshToken: response.body.refreshToken
    });

    expect(logoutResponse.status).toBe(204);
  });
});
