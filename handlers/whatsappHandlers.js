import twilio from 'twilio'
import { Conversation } from "../model/models.js"
import { isGreeting, getGreetingResponse, getSubjectPrompt } from '../utils/greeting.js'
import { retriveContext } from '../utils/context.js'
import { callGeminiAPI } from '../services/gemineAI.js'

const { MessagingResponse } = twilio.twiml;

export const handleWhatsAppMessage = async (req, res, genAI) => {
    console.log('=== WEBHOOK HIT ===');
    console.log('Request body:', req.body);

    const incomingMessage = req.body.Body;
    const incomingNumber = req.body.From;
    const profileName = req.body.ProfileName;

    console.log(`Received message from ${incomingNumber} ${profileName}: ${incomingMessage}`);

    try {
        // Save incoming message
        await Conversation.create({
            phoneNumber: incomingNumber,
            message: incomingMessage,
            role: 'user'
        });

        // Handle greeting
        if (isGreeting(incomingMessage)) {
            const greetingResponse = getGreetingResponse(profileName);
            await Conversation.create({
                phoneNumber: incomingNumber,
                message: greetingResponse,
                role: 'assistant'
            });

            sendTwimlResponse(res, greetingResponse, incomingNumber);
            return;
        }

        // Handle "let's start"
        const normalizedMessage = incomingMessage.toLowerCase().trim().replace(/[''`]/g, "'").replace(/[^a-z'\s]/g, '');
        if (normalizedMessage.includes("let's start") || normalizedMessage.includes("lets start")) {
            const subjectPrompt = getSubjectPrompt();
            await Conversation.create({
                phoneNumber: incomingNumber,
                message: subjectPrompt,
                role: 'assistant'
            });

            sendTwimlResponse(res, subjectPrompt, incomingNumber);
            return;
        }

        // Get conversation history
        const history = await Conversation.find({ phoneNumber: incomingNumber })
            .sort({ Timestamp: -1 })
            .limit(10)
            .lean();

        const conversationHistory = history.reverse().map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.message }]
        }));

        // Get context and call API
        const context = await retriveContext(incomingMessage);
        console.log('Context retrieved:', context);
        const systemPrompt = `You are Salone WelBodi AI, a compassionate and knowledgeable health assistant for people in Sierra Leone.
            Your goal is to provide accurate, easy-to-understand health information based on the retrieved context.

            Guidelines:
            1.  **Context-First**: Base your answers primarily on the provided "Retrieved Context". If the answer is not in the context, provide general medical guidance but state clearly that it is general advice.
            2.  **Safety**: ALWAYS advise the user to visit a healthcare facility for serious symptoms or emergencies. Do not diagnose or prescribe medication.
            3.  **Tone**: Be empathetic, patient, and culturally respectful.
            4.  **Language**: detecting the language of the user's message. If the user speaks Krio, reply in Krio. If English, reply in English.
            5.  **Simplicity**: Avoid complex medical jargon. Explain things simply.

            Retrieved Context:
            ${context}
            
            6. **Citation**: ALWAYS include the source of the information at the very end of your response. Use the format: "Source: [Source Name]". If multiple sources are used, list them. If the information is general and not from a specific source in the context, state "Source: General Knowledge".`;

        const AIrespond = await callGeminiAPI(genAI, conversationHistory, systemPrompt, incomingMessage);

        await Conversation.create({
            phoneNumber: incomingNumber,
            message: AIrespond,
            role: 'assistant'
        });


        sendTwimlResponse(res, AIrespond, incomingNumber);
    } catch (error) {
        console.error(`Error: ${error}`);
        sendTwimlResponse(res, "Sorry, I encountered an error processing your request.", incomingNumber);
    }
};

const sendTwimlResponse = (res, message, phoneNumber) => {
    const twiml = new MessagingResponse();
    twiml.message(message);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    console.log(`Response sent to ${phoneNumber}`);
}