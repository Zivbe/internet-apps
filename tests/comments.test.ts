import request from 'supertest';
import app, { createTestUser, resetTestCounter } from './testUtils';
import { resetStore } from '../src/store/inMemoryStore';

beforeEach(() => {
  resetStore();
  resetTestCounter();
});

describe('Comment endpoints', () => {
  test('POST /comment creates a comment', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentResponse = await request(app)
      .post('/comment')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ postId: postResponse.body.id, content: 'Nice' });

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body.content).toBe('Nice');
  });

  test('GET /comment returns list', async () => {
    const listResponse = await request(app).get('/comment');
    expect(listResponse.status).toBe(200);
  });

  test('GET /comment/:id returns comment', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentResponse = await request(app)
      .post('/comment')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ postId: postResponse.body.id, content: 'Nice' });

    const getResponse = await request(app).get(`/comment/${commentResponse.body.id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(commentResponse.body.id);
  });

  test('PUT /comment/:id updates comment', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentResponse = await request(app)
      .post('/comment')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ postId: postResponse.body.id, content: 'Nice' });

    const updateResponse = await request(app)
      .put(`/comment/${commentResponse.body.id}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ content: 'Updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.content).toBe('Updated');
  });

  test('DELETE /comment/:id deletes comment', async () => {
    const { response } = await createTestUser();
    const postResponse = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentResponse = await request(app)
      .post('/comment')
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .send({ postId: postResponse.body.id, content: 'Nice' });

    const deleteResponse = await request(app)
      .delete(`/comment/${commentResponse.body.id}`)
      .set('Authorization', `Bearer ${response.body.accessToken}`);

    expect(deleteResponse.status).toBe(204);
  });
});
