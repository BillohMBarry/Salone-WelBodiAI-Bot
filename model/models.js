import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
})

export const Conversation = mongoose.model("Conversation", conversationSchema)