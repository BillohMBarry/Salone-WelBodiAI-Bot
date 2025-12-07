import express from 'express';
import ngrok from "@ngrok/ngrok"
import twilio from 'twilio';
import { connectDB } from './Config/db.js';
import { initializeHealthcareVectorStore } from './rag/vectorStore.js';
import { initializeGenAI } from './services/gemineAI.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { handleWhatsAppMessage } from './handlers/whatsappHandlers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));

// Initialize services
const genAI = initializeGenAI();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const pineconeIntialized = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: "us-west1-gcp"
});
const indexName = "salone-welbodiai-bot";
const initializePinecone = async () => {
    try {
        const existingIndexes = await pineconeIntialized.listIndexes();
        const existingIndex = existingIndexes.indexes?.find(index => index.name === indexName);

        if (existingIndex) {
            if (existingIndex.dimension !== 1024) {
                console.log(`Index dimension mismatch (Found: ${existingIndex.dimension}, Expected: 1024). Deleting index...`);
                await pineconeIntialized.deleteIndex(indexName);

                // Wait for deletion to complete (Pinecone operations are async)
                console.log("Waiting for index deletion...");
                await new Promise(resolve => setTimeout(resolve, 10000));
            } else {
                console.log("Pinecone index ready and verified.");
                return;
            }
        }

        console.log("Creating new Pinecone index...");
        await pineconeIntialized.createIndex({
            name: indexName,
            dimension: 1024,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1"
                }
            }
        });
        console.log("Pinecone index created successfully.");
    } catch (error) {
        console.error("Error initializing Pinecone:", error);
        throw error;
    }
}
const PORT = process.env.PORT || 8080;
const startServer = async () => {
    try {
        await connectDB();
        await initializePinecone();
        await initializeHealthcareVectorStore();

        // Define root route to verify server is running
        app.get('/', (req, res) => {
            res.send('Salone WelBodi AI Server is up and running!');
        });

        
        app.listen(PORT, async () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
            try {
                const listener = await ngrok.connect({ addr: PORT, authtoken: process.env.NGROK_AUTH_TOKEN });
                console.log(`ngrok tunnel established at: ${listener.url()}`);
            } catch (error) {
                console.error("Error connecting ngrok:", error);
            }
        });
    } catch (error) {
        console.log(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}
startServer();

app.post('/whatsapp', async (req, res) => handleWhatsAppMessage(req, res, genAI))