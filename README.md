# SpeakWise AI Mentor 🎙️

**Your AI-powered companion for improving communication, English fluency, and interview skills.**

SpeakWise AI Mentor is an AI-powered communication practice platform that helps students and individuals improve their speaking confidence, English communication, and interview preparation through interactive conversations with an AI mentor.

The project aims to make communication practice more accessible by providing an environment where users can practice, learn, and improve at their own pace.

> 🚧 **Project Status:** Currently under active development.

## 🎯 Problem Statement

Many students have strong technical knowledge but struggle to communicate their ideas effectively, especially during interviews, presentations, and professional conversations.

Traditional learning methods often lack personalized, interactive practice.

SpeakWise aims to bridge this gap by providing an AI-powered platform for continuous communication practice.

## ✨ Key Features

- **AI-Powered Conversations:** Interact with an AI mentor using Google's Gemini API.
- **Interview Preparation:** Practice interview-style conversations.
- **English Learning:** Improve English communication through interactive practice.
- **Conversation History:** Store and retrieve previous conversations.
- **Persistent Chat Storage:** Save user and AI messages in PostgreSQL.
- **Streaming Responses:** Working towards a more responsive conversational experience.

*Features are being implemented incrementally.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend |
| Node.js | Backend runtime |
| Express.js | REST API |
| PostgreSQL | Database |
| Google Gemini API | AI-powered responses |
| JavaScript | Application development |

## 🏗️ Architecture

```text
              User
               |
               v
        React + Vite
          Frontend
               |
               v
        Express.js API
               |
         +-----+------+
         |            |
         v            v
      Gemini API   PostgreSQL
         |            |
         v            v
     AI Response  Chat History
         |            |
         +-----+------+
               |
               v
        Frontend Display
```

## 📁 Project Structure

```text
SpeakWise/
│
├── client/              # React frontend
│   ├── src/
│   └── package.json
│
├── server/              # Express backend
│   ├── controller/
│   ├── routes/
│   ├── models/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

*Adjust the structure above to match the actual folders in your repository.*

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lakhan1212/speakwise.git
cd speakwise
```

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory.

```env
PORT=5000
DATABASE_URL
