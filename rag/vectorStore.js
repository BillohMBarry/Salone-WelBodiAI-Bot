import { Pinecone } from "@pinecone-database/pinecone";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: "us-west1-gcp"
});

const INDEX_NAME = "salone-welbodiai-bot";
const EMBEDDING_MODEL = "llama-text-embed-v2"

export const initializeHealthcareVectorStore = async () => {
    const dataPath = path.join(dirname, "..", "content")

    const jsonFiles = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'));
    const rawData = jsonFiles.flatMap(file => JSON.parse(fs.readFileSync(path.join(dataPath, file), 'utf-8')));

    console.log(`Loaded ${rawData.length} documents from content directory.`);

    const index = pinecone.Index(INDEX_NAME);
    const vectors = []

    for (const item of rawData) {
        if (!item.text && item.question_en && item.answer_en) {
            item.text = `Question: ${item.question_en}\nAnswer: ${item.answer_en}\nAnswer (Krio): ${item.answer_kr || ''}`;
        }

        if (!item.text || typeof item.text !== 'string') {
            console.error("Invalid item text:", item.id);
            continue;
        }

        const embedding = await pinecone.inference.embed(
            EMBEDDING_MODEL,
            [item.text],
            { input_type: "passage" }
        );
        const values = embedding?.data?.[0]?.values;
        if (!values) {
            console.error("Failed to get embedding for item:", item.id);
            continue;
        }

        vectors.push({
            id: `${item.id}`,
            values: values,
            metadata: {
                source: item.source,
                section: item.section || "",
                topic: item.topic || "",
                language: item.language || "en",
                tags: item.tags || [],
                data: item.data || "",
                snippet: item.text.substring(0, 500)
            }
        })
    }

    if (vectors.length > 0) {
        await index.upsert(vectors);
        console.log(`Successfully Upserted ${vectors.length} healthcare vectors into Pinecone index "${INDEX_NAME}".`);
    } else {
        console.log("No vectors to upsert.");
    }
}

export const searchHealthcareVectors = async (query, topK = 5) => {
    const index = pinecone.Index(INDEX_NAME);

    const queryEmbedding = await pinecone.inference.embed(
        EMBEDDING_MODEL,
        [query],
        { input_type: "query" }
    )
    const results = await index.query({
        vector: queryEmbedding?.data?.[0].values,
        topK: topK,
        includeMetadata: true
    })
    return results.matches.map(match => ({
        score: match.score,
        id: match.id,
        text: match.metadata.snippet,
        source: match.metadata.source,
        topic: match.metadata.topic,
        section: match.metadata.section,
        language: match.metadata.language,
        tags: match.metadata.tags,
        data: match.metadata.data
    }));
}