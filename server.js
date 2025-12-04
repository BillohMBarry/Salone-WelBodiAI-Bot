import express from 'express';
import { connectDB } from './Config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}
startServer();