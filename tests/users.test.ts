import request from 'supertest';
import app, { createTestUser, resetTestCounter } from './testUtils';
import { resetStore } from '../src/store/inMemoryStore';

beforeEach(() => {
  resetStore();
  resetTestCounter();
});

describe('User endpoints', () => {
  test('POST /users creates a user', async () => {
    const response = await request(app).post('/users').send({
      username: 'new-user',
      email: 'new-user@example.com',
      password: 'Password123!'
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('new-user@example.com');
  });

  test('GET /users returns list', async () => {
    const { response } = await createTestUser();
    const listResponse = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${response.body.accessToken}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
  });

  test('GET /users/:id returns user', async () => {
    const { response } = await createTestUser();
    const userId = response.body.user.id;
    const getResponse = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(userId);
  });

  test('PUT /users/:id updates user', async () => {
    const { response } = await createTestUser();
    const userId = response.body.user.id;
    const updateResponse = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ username: 'updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.username).toBe('updated');
  });

  test('DELETE /users/:id deletes user', async () => {
    const { response } = await createTestUser();
    const userId = response.body.user.id;
    const deleteResponse = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`);

    expect(deleteResponse.status).toBe(204);
  });
});
