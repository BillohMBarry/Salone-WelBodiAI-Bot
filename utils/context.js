import { searchHealthcareVectors } from '../rag/vectorStore.js';
export const retriveContext = async (query) => {
    const result = await searchHealthcareVectors(query, 3)
    if (result.length === 0)
        return "No relevant context found.";

    return result.map(r =>
        `[Topic: ${r.topic || 'General'} - Section: ${r.section || 'N/A'} (Source: ${r.source || 'Unknown'})]\n${r.text}`
    ).join('\n\n');
}