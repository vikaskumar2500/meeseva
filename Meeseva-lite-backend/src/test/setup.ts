import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../modules/users/user.model.js';
import { ApplicationModel } from '../modules/applications/application.model.js';
import { TrackingModel } from '../modules/tracking/tracking.model.js';
import { OTPModel } from '../modules/auth/otp.model.js';
import { DocumentModel } from '../modules/documents/document.model.js';

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ instance: { ip: '127.0.0.1' } });
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

afterEach(async () => {
  await UserModel.deleteMany({});
  await ApplicationModel.deleteMany({});
  await TrackingModel.deleteMany({});
  await OTPModel.deleteMany({});
  await DocumentModel.deleteMany({});
});
