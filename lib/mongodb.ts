import mongoose from 'mongoose';

// Types for storing mongoose connection and promise
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Add mongoose cache to global object (helps prevent multiple connections in development)
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Create or reuse cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Main function to connect to MongoDB
async function connectDB(): Promise<typeof mongoose> {
  // If already connected, reuse the connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in .env');
    }

    const options = {
      bufferCommands: false,
    };

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
  }

  try {
    // Wait for the connection to finish
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset if connection fails
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
