import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import supertest from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createApp } from '../../app.js';
import { connectTestDB, disconnectTestDB } from '../../test/db.js';
import { ApplicationModel } from './application.model.js';

const app = createApp();
const request = supertest(app);

const User = mongoose.model('User');

describe('Application API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectTestDB();
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await new User({
      desiredLoginId: 'apptestuser',
      mobileNumber: '1111111111',
      phone: '1111111111',
      fullName: 'App Test User',
      address: '123 Test Street',
      country: 'India',
      state: 'Test State',
      district: 'Test District',
      pinCode: '123456',
      email: 'apptest@example.com',
      passwordHash,
    }).save();
    userId = user._id;
    token = jwt.sign(
      { sub: user._id, email: user.email, role: 'citizen' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });

  afterEach(async () => {
    await ApplicationModel.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await disconnectTestDB();
  });

  it('should create a new application for the logged-in user', async () => {
    const response = await request
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        applicationType: 'test_type',
        title: 'My First Application',
        payload: { key: 'value' },
      });

    expect(response.status).toBe(201);
    expect(response.body.application).toHaveProperty('title', 'My First Application');
    expect(response.body.application).toHaveProperty('userId', userId.toString());
  });

  it('should get all applications for the logged-in user', async () => {
    await new ApplicationModel({
      applicationType: 'test_type',
      title: 'App 1',
      userId: userId,
    }).save();
    await new ApplicationModel({
      applicationType: 'test_type',
      title: 'App 2',
      userId: userId,
    }).save();

    const response = await request
      .get('/api/v1/applications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.applications).toBeInstanceOf(Array);
    expect(response.body.applications.length).toBe(2);
  });

  it('should get a single application by ID', async () => {
    const application = await new ApplicationModel({
      applicationType: 'test_type',
      title: 'Single App',
      userId: userId,
    }).save();

    const response = await request
      .get(`/api/v1/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.application).toHaveProperty('title', 'Single App');
  });

  it('should update an application by ID', async () => {
    const application = await new ApplicationModel({
      applicationType: 'test_type',
      title: 'Old Name',
      userId: userId,
    }).save();

    const response = await request
      .patch(`/api/v1/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Name' });

    expect(response.status).toBe(200);
    expect(response.body.application).toHaveProperty('title', 'New Name');
  });

  it('should delete an application by ID', async () => {
    const application = await new ApplicationModel({
      applicationType: 'test_type',
      title: 'To Be Deleted',
      userId: userId,
    }).save();

    const response = await request
      .delete(`/api/v1/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const findResponse = await request
      .get(`/api/v1/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(findResponse.status).toBe(404);
  });
});
