import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/Users';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = User.create({
      name: 'Wagner dos Santos Lima',
      email: 'wslmacieira@gmail.com',
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Wagner dos Santos Lima',
        email: 'wslmacieira@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Wagner dos Santos Lima',
        email: 'wslmacieira@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Wagner dos Santos Lima',
        email: 'wslmacieira@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });
});
