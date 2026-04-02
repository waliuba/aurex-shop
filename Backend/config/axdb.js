import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
