import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the type for the global mongoose cache
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global interface
declare global {
  var mongoose: GlobalMongoose;
}

// Initialize the cached connection
let cached: GlobalMongoose = global.mongoose || { conn: null, promise: null };

// Store the cached connection on the global object
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (global.mongoose.conn) {
      console.log('Using existing MongoDB connection');
      return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
      const opts = {
        bufferCommands: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      console.log('Creating new MongoDB connection');
      global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    }

    try {
      const conn = await global.mongoose.promise;
      global.mongoose.conn = conn;
      console.log('Successfully connected to MongoDB');
      return conn;
    } catch (error) {
      global.mongoose.promise = null;
      throw error;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export default dbConnect; 