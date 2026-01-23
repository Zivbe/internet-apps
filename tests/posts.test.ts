import request from 'supertest';
import app, { createTestUser, resetTestCounter } from './testUtils';
import { resetStore } from '../src/store/inMemoryStore';

beforeEach(() => {
  resetStore();
  resetTestCounter();
});

describe('Post endpoints', () => {
  test('POST /post creates a post', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Hello', content: 'World' });

    expect(postResponse.status).toBe(201);
    expect(postResponse.body.title).toBe('Hello');
  });

  test('GET /post returns list', async () => {
    const listResponse = await request(app).get('/post');
    expect(listResponse.status).toBe(200);
  });

  test('GET /post/:id returns post', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'One', content: 'Two' });

    const getResponse = await request(app).get(`/post/${postResponse.body.id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(postResponse.body.id);
  });

  test('PUT /post/:id updates post', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Old', content: 'Content' });

    const updateResponse = await request(app)
      .put(`/post/${postResponse.body.id}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'New' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('New');
  });

  test('DELETE /post/:id deletes post', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Delete', content: 'Me' });

    const deleteResponse = await request(app)
      .delete(`/post/${postResponse.body.id}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`);

    expect(deleteResponse.status).toBe(204);
  });
});
