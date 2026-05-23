import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
  const { host, name } = mongoose.connection;
  console.log(`Connected to MongoDB database "${name}" on ${host}`);
};
