# PrepWise — AI Mock Interview Platform (MERN Stack)

An AI-powered mock interview platform built with **MongoDB, Express, React, and Node.js**.  
Practice interviews with real-time AI evaluation, webcam-based behavior analysis, and detailed feedback.

---

## 🗂️ Project Structure

```
mern-prepwise/
├── backend/                  # Express + Node.js API Server
│   ├── controllers/
│   │   └── aiController.js   # AI question generation & answer evaluation
│   ├── routes/
│   │   └── aiRoutes.js       # API route definitions
│   ├── .env                  # Environment variables (API keys, DB URI)
│   ├── package.json
│   └── server.js             # Express server entry point
│
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx      # Reusable login/signup form
│   │   │   └── FeedbackCard.jsx  # AI feedback display card
│   │   ├── firebase/
│   │   │   └── config.js         # Firebase authentication config
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Home page (after login)
│   │   │   ├── Login.jsx             # Sign-in page
│   │   │   ├── Signup.jsx            # Sign-up page
│   │   │   └── PracticeInterview.jsx # Main interview page (setup → interview → results)
│   │   ├── App.jsx           # React Router + auth state management
│   │   ├── main.jsx          # App entry point with BrowserRouter
│   │   └── index.css         # Global Tailwind CSS styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                 # This file
```

---

## 🚀 How to Run

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://localhost:27017`
- **Gemini API Key** (already set in `backend/.env`)

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

Server runs at: `http://localhost:5000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Firebase Auth** | Email/password signup & login with protected routes |
| 🎙️ **AI Interview Practice** | 10 job roles × 3 levels with tailored question banks |
| 📷 **Webcam Analysis** | Live camera feed with behavioral body language tips |
| 🧠 **Gemini AI Evaluation** | Multimodal answer evaluation (text + image) |
| 📊 **Detailed Feedback** | Score, rating, strengths, corrections, model answers |
| 🗣️ **Filler Word Detection** | Tracks "um", "uh", "like", "basically", etc. |
| 🎯 **Behavior Tips** | AI-generated communication & delivery coaching |
| 💡 **Local Fallback** | Works even when AI API rate limit is exceeded |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v7, Firebase Auth
- **Backend**: Node.js, Express 5, Mongoose (MongoDB), Google Gemini AI
- **Database**: MongoDB
- **Authentication**: Firebase (client-side)
- **AI**: Google Gemini 2.0 Flash (multimodal)

---

## 📋 Routes

| Route | Page | Auth Required |
|-------|------|:------------:|
| `/sign-in` | Login | ❌ |
| `/sign-up` | Signup | ❌ |
| `/` | Dashboard | ✅ |
| `/practice` | AI Interview Practice | ✅ |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/generate-questions` | Generate role-specific interview questions |
| `POST` | `/api/ai/evaluate` | Evaluate answer with AI (supports image) |
| `GET`  | `/` | Health check |
