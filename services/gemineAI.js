import dotenv from  "dotenv"
import { GoogleGenAI } from "@google/genai"

dotenv.config()

export const initializeGenAI = () => {
    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })
}

export const callGeminiAPI = async (genAI, conversationHistory, systemPrompt, incomingMessage) => {
    const respond = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            ...conversationHistory,
            {
                role: "user",
                parts: [
                    {
                        text: `${systemPrompt}\n\nQuestion: ${incomingMessage}`
                    }
                ]
            }
        ],
        systemInstructions: systemPrompt,
        config: {
            temperature: 0.5,
            maxOutputTokens: 300,
            thinkingConfig: {
                thinkingBudget: 0
            }
        }
    })
    return respond.text
}