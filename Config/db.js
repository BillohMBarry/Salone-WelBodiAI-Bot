import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        const MongoDBIntialized = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log(`MongoDB connected: ${MongoDBIntialized.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}
