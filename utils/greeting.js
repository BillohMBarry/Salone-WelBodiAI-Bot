export function isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'hola', 'greetings'];
    return greetings.includes(message.toLowerCase().trim());
}

export function getGreetingResponse(profileName) {
    return `Hello, ${profileName} 👋\nWelcome to Salone WelBodi AI! 🏥\nI am your personal health assistant, here to provide you with reliable health information relevant to Sierra Leone. You can ask me about symptoms, diseases, nutrition, or general well-being.\n\nI can also communicate in Krio! \n\nJust say "let's start" to verify your symptoms or ask a health question.`;
}

export function getSubjectPrompt() {
    return `I'm ready to help! 🩺\n\nPlease describe your health concern, symptoms, or ask a question about a specific health topic.`;
}