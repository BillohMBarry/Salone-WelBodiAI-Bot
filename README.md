# Salone-WelBodiAI-Bot

# LOGO
![Logo](BotLogo/logo1.png)

A WhatsApp-based AI chatbot focusing on healthcare and wellbeing, powered by Google's Gemini AI, Pinecone for RAG (Retrieval Augmented Generation), and Twilio.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Local Setup](#installation--local-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **AI-Powered Conversations**: Utilizes Google's Gemini AI for natural language understanding and responses.
- **RAG Implementation**: Uses Pinecone vector database to provide context-aware responses based on specific documents.
- **WhatsApp Integration**: Communicates with users directly through WhatsApp using Twilio.
- **Persistent Storage**: Stores user data and interaction history in MongoDB.
- **Automated Tunneling**: Built-in Ngrok integration for easy local development and webhook testing.

## 🛠 Prerequisites

Before you begin, ensure you have the following installed and set up:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- **API Keys & Credentials**:
  - [Google Gemini API Key](https://ai.google.dev/)
  - [Pinecone API Key](https://www.pinecone.io/)
  - [Twilio Account SID & Auth Token](https://www.twilio.com/)
  - [Ngrok Auth Token](https://ngrok.com/)

## 🚀 Installation & Local Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/BillohMBarry/Salone-WelBodiAI-Bot.git
    cd saloneWelBodi-Bot
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and populate it with your credentials:

    ```env
    PORT=8080
    MONGODB_CONNECTION_STRING=your_mongodb_connection_string
    TWILIO_ACCOUNT_SID=your_twilio_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    PINECONE_API_KEY=your_pinecone_api_key
    GEMINI_API_KEY=your_gemini_api_key
    NGROK_AUTH_TOKEN=your_ngrok_auth_token
    ```

4.  **Run the Application**

    For development (with auto-reload):
    ```bash
    npm run dev
    ```

    For production:
    ```bash
    npm start
    ```

    The application will start, and the console will display the Ngrok URL (e.g., `https://xxxx-xx-xx-xx-xx.ngrok-free.app`).

5.  **Configure Twilio Webhook**
    -   Copy the Ngrok URL generated in the console.
    -   Go to your Twilio Console > WhatsApp Sandbox Settings.
    -   Paste the URL into the "When a message comes in" field, appending `/whatsapp`.
        -   Example: `https://your-ngrok-url.app/whatsapp`

## 📂 Project Structure

Here's an overview of the project's file organization:

```
saloneWelBodi-Bot/
├── BotLogo/             # Contains assets like bot logos
├── Config/
│   └── db.js            # MongoDB connection configuration
├── content/             # Raw content files for RAG (documents, text)
├── handlers/
│   └── whatsappHandlers.js # Logic for processing incoming WhatsApp messages
├── model/
│   └── models.js        # Mongoose data models
├── rag/
│   └── vectorStore.js   # Pinecone initialization and vector store logic
├── services/
│   └── gemineAI.js      # Google Gemini AI service configuration
├── utils/
│   ├── context.js       # Utilities for managing conversation context
│   └── greeting.js      # Helper functions for greetings and standard responses
├── .env                 # Environment variables (not committed to git)
├── .gitignore           # Files and folders to ignore in git
├── package.json         # Project dependencies and scripts
└── server.js            # Main entry point of the application
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the bot or add new features, follow these steps:

1.  **Fork the Repository**: Click the "Fork" button at the top right of this page.
2.  **Create a New Branch**:
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3.  **Make Your Changes**: Implement your feature or fix.
4.  **Commit Your Changes**:
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
5.  **Push to the Branch**:
    ```bash
    git push origin feature/AmazingFeature
    ```
6.  **Open a Pull Request**: Go to the original repository and submit a pull request.


