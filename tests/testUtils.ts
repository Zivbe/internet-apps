import request from 'supertest';
import app from '../src/app';

let counter = 0;

export const resetTestCounter = () => {
  counter = 0;
};

export const createTestUser = async () => {
  counter += 1;
  const payload = {
    username: `user${counter}`,
    email: `user${counter}@example.com`,
    password: 'Password123!'
  };

  const response = await request(app).post('/auth/register').send(payload);
  return {
    response
  };
};

export default app;
