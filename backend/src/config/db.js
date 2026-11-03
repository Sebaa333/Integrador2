import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Set it in .env or in the Railway variables.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
