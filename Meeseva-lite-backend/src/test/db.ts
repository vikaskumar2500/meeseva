import { existsSync } from 'node:fs';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer | undefined;

const getMongoBinaryOptions = () => {
  const configuredBinary = process.env.MONGOD_BINARY;
  if (configuredBinary) {
    return { systemBinary: configuredBinary };
  }

  const homebrewBinary = '/opt/homebrew/bin/mongod';
  if (existsSync(homebrewBinary)) {
    return { systemBinary: homebrewBinary };
  }

  return undefined;
};

export const connectTestDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  mongo ??= await MongoMemoryServer.create({
    binary: getMongoBinaryOptions(),
    instance: { ip: '127.0.0.1' },
  });
  await mongoose.connect(mongo.getUri());
};

export const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }

  await mongo?.stop();
  mongo = undefined;
};
