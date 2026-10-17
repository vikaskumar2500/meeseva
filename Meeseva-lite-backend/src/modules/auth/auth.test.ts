import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import { connectTestDB, disconnectTestDB } from '../../test/db.js';

const app = createApp();
const request = supertest(app);

const User = mongoose.model('User');
const OTP = mongoose.model('OTP');

describe('Auth API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await OTP.deleteMany({});
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  // ==================== Old Flow Tests ====================
  it('should register a new user (old flow)', async () => {
    const response = await request.post('/api/v1/auth/register').send({
      desiredLoginId: '9999999999',
      mobileNumber: '8888888888',
      fullName: 'Test User',
      address: '123 Main Street',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru',
      pinCode: '560001',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.otpVerified).toBe(true);
  });

  it('should not register a user with an existing email (old flow)', async () => {
    await request.post('/api/v1/auth/register').send({
      desiredLoginId: '9999999999',
      mobileNumber: '8888888888',
      fullName: 'Test User',
      address: '123 Main Street',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru',
      pinCode: '560001',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    const response = await request.post('/api/v1/auth/register').send({
      desiredLoginId: '9999999998',
      mobileNumber: '8888888887',
      fullName: 'Test User 2',
      address: '456 Main Street',
      country: 'India',
      state: 'Karnataka',
      district: 'Mysuru',
      pinCode: '570001',
      email: 'test@example.com',
      password: 'password456',
      confirmPassword: 'password456',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already registered');
  });

  it('should login with email (old flow)', async () => {
    await request.post('/api/v1/auth/register').send({
      desiredLoginId: '9999999999',
      mobileNumber: '8888888888',
      fullName: 'Test User',
      address: '123 Main Street',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru',
      pinCode: '560001',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    const response = await request.post('/api/v1/auth/login').send({
      loginId: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request.post('/api/v1/auth/login').send({
      loginId: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
  });

  // ==================== New OTP-Based Flow Tests ====================

  describe('OTP-based Registration Flow', () => {
    it('should initiate registration and send OTP', async () => {
      const response = await request
        .post('/api/v1/auth/register/initiate')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OTP sent successfully');
      expect(response.body.phone).toBe('9876543210');
      expect(response.body.expiresIn).toBe(600);

      // Verify OTP was created in DB
      const otpRecord = await OTP.findOne({ email: 'john@example.com' });
      expect(otpRecord).toBeDefined();
      expect(otpRecord.purpose).toBe('registration');
    });

    it('should not initiate registration if email already exists', async () => {
      // Create a user first
      await request.post('/api/v1/auth/register').send({
        desiredLoginId: '9999999999',
        mobileNumber: '8888888888',
        fullName: 'Test User',
        address: '123 Main Street',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        pinCode: '560001',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      // Try to initiate registration with same email
      const response = await request
        .post('/api/v1/auth/register/initiate')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com',
          phone: '9876543210',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already registered');
    });

    it('should verify OTP and complete registration', async () => {
      // Initiate registration
      await request.post('/api/v1/auth/register/initiate').send({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
      });

      // Get the OTP from DB
      const otpRecord = await OTP.findOne({ email: 'john@example.com' });
      const otp = otpRecord.code;

      // Verify OTP and complete registration
      const response = await request
        .post('/api/v1/auth/register/verify-otp')
        .send({
          email: 'john@example.com',
          phone: '9876543210',
          otp: otp,
          fullName: 'John Doe',
          password: 'SecurePass123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.phone).toBe('9876543210');
      expect(response.body.user.otpVerified).toBe(true);
      expect(response.body.user.role).toBe('citizen');

      // Verify user was created
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeDefined();

      // Verify OTP was deleted
      const deletedOtp = await OTP.findOne({ email: 'john@example.com' });
      expect(deletedOtp).toBeNull();
    });

    it('should reject invalid OTP', async () => {
      // Initiate registration
      await request.post('/api/v1/auth/register/initiate').send({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
      });

      // Try to verify with wrong OTP
      const response = await request
        .post('/api/v1/auth/register/verify-otp')
        .send({
          email: 'john@example.com',
          phone: '9876543210',
          otp: '000000',
          fullName: 'John Doe',
          password: 'SecurePass123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired OTP');
    });
  });

  describe('OTP-based Forgot Password Flow', () => {
    beforeEach(async () => {
      // Create a user for forgot password tests
      await request.post('/api/v1/auth/register').send({
        desiredLoginId: '9999999999',
        mobileNumber: '8888888888',
        fullName: 'Test User',
        address: '123 Main Street',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        pinCode: '560001',
        email: 'test@example.com',
        password: 'oldpassword',
        confirmPassword: 'oldpassword',
      });
    });

    it('should initiate forgot password and send OTP', async () => {
      const response = await request
        .post('/api/v1/auth/forgot-password/initiate')
        .send({
          loginId: 'test@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OTP sent successfully');
      expect(response.body.expiresIn).toBe(600);

      // Verify OTP was created
      const otpRecord = await OTP.findOne({ email: 'test@example.com' });
      expect(otpRecord).toBeDefined();
      expect(otpRecord.purpose).toBe('password_reset');
    });

    it('should verify OTP and reset password', async () => {
      // Initiate forgot password
      await request.post('/api/v1/auth/forgot-password/initiate').send({
        loginId: 'test@example.com',
      });

      // Get the OTP
      const otpRecord = await OTP.findOne({ email: 'test@example.com' });
      const otp = otpRecord.code;

      // Reset password
      const response = await request
        .post('/api/v1/auth/forgot-password/verify-otp')
        .send({
          loginId: 'test@example.com',
          otp: otp,
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset successfully');

      // Verify new password works
      const loginResponse = await request.post('/api/v1/auth/login').send({
        loginId: 'test@example.com',
        password: 'newpassword123',
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });

    it('should allow login with phone after forgot password', async () => {
      // Initiate forgot password with phone
      const response = await request
        .post('/api/v1/auth/forgot-password/initiate')
        .send({
          loginId: '8888888888',
        });

      expect(response.status).toBe(200);

      // Get the OTP
      const otpRecord = await OTP.findOne({ phone: '8888888888' });
      const otp = otpRecord.code;

      // Reset password
      const resetResponse = await request
        .post('/api/v1/auth/forgot-password/verify-otp')
        .send({
          loginId: '8888888888',
          otp: otp,
          newPassword: 'newpassword123',
        });

      expect(resetResponse.status).toBe(200);

      // Login with phone
      const loginResponse = await request.post('/api/v1/auth/login').send({
        loginId: '8888888888',
        password: 'newpassword123',
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });
  });

  describe('Login with phone', () => {
    beforeEach(async () => {
      // Create a user
      await request.post('/api/v1/auth/register').send({
        desiredLoginId: '9999999999',
        mobileNumber: '8888888888',
        fullName: 'Test User',
        address: '123 Main Street',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        pinCode: '560001',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    it('should login with phone number', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        loginId: '8888888888',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });
  });
});
