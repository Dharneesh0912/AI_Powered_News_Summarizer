# 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Ports Reference](#-ports-reference)
- [API Endpoints](#-api-endpoints)
- [Supported Exams & Topics](#-supported-exams--topics)
- [Assumptions Made](#-assumptions-made)

---

## ✨ Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Real-time News from **NewsAPI.org** — fetched and served via backend
- ✅ **AI-powered syllabus classification** — articles auto-tagged to exam topics using weighted keyword scoring
- ✅ **Relevance Score (0–100)** for every article based on syllabus keyword density
- ✅ Filter news by **Exam** (UPSC, TNPSC, SSC, Railways, State PSC)
- ✅ Filter news by **Syllabus Topic** (Polity, Economy, Geography, History, etc.)
- ✅ **AI Text Summarization** — PERT-style sentence scoring to extract key exam-relevant points
- ✅ **Audio Podcast Mode** — listen to news summaries via Google TTS API (English & Tamil)
- ✅ Multiple audio modes: Narrative, Calm, Conversational, Motivational, Professional, Dramatic, Podcast
- ✅ **Download audio** as `.mp3` for offline listening
- ✅ **PDF Download** of articles using jsPDF
- ✅ Search & filter news by keyword and minimum relevance score
- ✅ Auto-refresh news every 30 minutes
- ✅ Fallback to sample news if API is unavailable

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 19 | UI framework |
| **Vite** | 7.x | Build tool & dev server |
| **TailwindCSS** | 3.x | Utility-first styling |
| **Lucide React** | ^0.548 | Icon library |
| **jsPDF** | ^3.0 | Client-side PDF generation |
| **idb** | ^8.0 | IndexedDB wrapper for offline caching |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | ^4.18 | REST API framework |
| **MongoDB** | Local | NoSQL database |
| **Mongoose** | ^7.4 | MongoDB ODM |
| **JSON Web Token (JWT)** | ^9.0 | Authentication |
| **bcryptjs** | ^2.4 | Password hashing |
| **google-tts-api** | ^2.0 | Google Text-to-Speech integration |
| **node-fetch** | ^3.3 | HTTP requests to NewsAPI |
| **express-validator** | ^7.0 | Input validation |
| **cors** | ^2.8 | Cross-origin resource sharing |
| **dotenv** | ^16.3 | Environment variable management |

### External APIs
| API | Purpose |
|---|---|
| **NewsAPI.org** | Real-time news articles |
| **Google TTS API** | Text-to-speech audio generation |

### Database
| Detail | Value |
|---|---|
| **Database** | MongoDB (local) |
| **Connection** | `mongodb://localhost:27017/exam-news-db` |
| **Collections** | `users`, `news` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│              React.js + Vite (Port 5173)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Login/  │ │  Exam    │ │  News    │ │  Audio   │  │
│  │  Signup  │ │  Select  │ │  Feed    │ │ Podcast  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST (fetch API)
                         │ → localhost:3001
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS.JS SERVER                       │
│                    (Port 3001)                           │
│                                                         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ /api/auth  │  │  /api/news   │  │   /api/tts     │  │
│  │  Signup    │  │  Fetch from  │  │  Google TTS    │  │
│  │  Login     │  │  NewsAPI     │  │  Audio Stream  │  │
│  │  Me        │  │  Classify    │  └────────────────┘  │
│  └────────────┘  │  Score &     │                       │
│                  │  Return      │                        │
│                  └──────────────┘                        │
│                                                         │
│  Middleware: JWT Auth │ express-validator │ CORS         │
└───────┬────────────────────────────┬────────────────────┘
        │ Mongoose ODM               │ node-fetch
        ▼                            ▼
┌──────────────────┐    ┌───────────────────────────┐
│     MONGODB      │    │      External APIs         │
│  localhost:27017 │    │  NewsAPI.org (news feed)   │
│  exam-news-db    │    │  Google TTS (audio)        │
│  - users         │    └───────────────────────────┘
│  - news          │
└──────────────────┘
```

---

## 📁 Project Structure

```
exam-news-platform/
├── server/                         # Express.js Backend
│   ├── controllers/
│   │   └── authController.js       # Signup, Login, GetCurrentUser
│   ├── middlewares/
│   │   └── validation.js           # express-validator rules
│   ├── models/
│   │   ├── User.js                 # Mongoose User schema
│   │   └── News.js                 # Mongoose News schema
│   ├── services/
│   │   └── newsService.js          # NewsAPI fetch & caching logic
│   └── index.js                    # Express app entry point
│
├── src/                            # React Frontend (single-file SPA)
│   ├── App.jsx                     # All pages & components
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── assets/
│
├── public/                         # Static assets
├── .env                            # Environment variables (do not commit)
├── .env.example                    # Environment variable template
├── .gitignore
├── index.html                      # Vite HTML entry
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.cjs
├── package.json                    # Unified dependencies (frontend + backend)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Download |
|---|---|---|
| **Node.js** | v18 or above | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | Community Edition | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **NewsAPI Key** | Free tier | [newsapi.org](https://newsapi.org/) |

> ⚠️ **MongoDB must be running** before starting the server. Start it via `mongod` or MongoDB Compass.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Arul-2004/AI-Powered-News-Summarizer.git
cd AI-Powered-News-Summarizer/exam-news-platform
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

> This installs both frontend and backend dependencies from the single `package.json`.

---

### Step 3 — Configure Environment Variables

```bash
# Windows
copy .env.example .env

# Linux / Mac
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/exam-news-db
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
PORT=3001
NEWSAPI_KEY=your_newsapi_key_here
```

---

### Step 4 — Start the Backend Server

```bash
npm run start:server
```

✅ Backend API starts at: **`http://localhost:3001`**

---

### Step 5 — Start the Frontend Dev Server

Open a **new terminal window** and run:

```bash
npm run dev
```

✅ Frontend starts at: **`http://localhost:5173`**

---

### Step 6 — Open in Browser

Visit **`http://localhost:5173`** in your browser.

Register a new account, select your exam, and start reading exam-relevant news! 📚

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite frontend dev server (Port 5173) |
| `npm run start:server` | Start Express backend server (Port 3001) |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🌐 Ports Reference

| Service | Port | URL | Notes |
|---|---|---|---|
| **Frontend** (Vite dev) | `5173` | `http://localhost:5173` | React SPA |
| **Backend** (Express) | `3001` | `http://localhost:3001` | REST API + TTS |
| **MongoDB** | `27017` | `mongodb://localhost:27017` | Local database |

---

## 🔐 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the backend server runs on | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/exam-news-db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | *(required)* |
| `JWT_EXPIRE` | JWT token expiry duration | `7d` |
| `NEWSAPI_KEY` | Your NewsAPI.org API key | *(required)* |

> 🔒 **Never commit your `.env` file.** It is already listed in `.gitignore`.

> 🔑 Get a free NewsAPI key at [https://newsapi.org/register](https://newsapi.org/register)

---

## 📡 API Endpoints

Base URL: `http://localhost:3001`

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and get JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current logged-in user |

### News

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/news` | ❌ | Fetch and classify latest news articles |

Query Parameters for `/api/news`:

| Parameter | Default | Description |
|---|---|---|
| `q` | `india` | Search keyword |
| `sortBy` | `publishedAt` | Sort order (`publishedAt`, `relevancy`, `popularity`) |
| `language` | `en` | Language code |
| `pageSize` | `20` | Number of articles to fetch |

### Text-to-Speech

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/tts` | ❌ | Convert text to audio (MP3 stream) |

Request body for `/api/tts`:

```json
{
  "text": "Article content here...",
  "lang": "english",
  "mode": "narrative"
}
```

| Field | Options | Description |
|---|---|---|
| `lang` | `english`, `tamil` | Language for TTS |
| `mode` | `narrative`, `calm`, `conversational`, `motivational`, `professional`, `dramatic`, `podcast` | Speech style/speed |

---

## 📚 Supported Exams & Topics

### UPSC
| Topic | Subtopics |
|---|---|
| Indian Polity | Constitution, Parliament, Judiciary, Federalism, Public Policy |
| Economy | Budget, Banking, Trade, Agriculture, Industry, Economic Survey |
| Geography | Environment, Climate Change, Natural Resources, Disasters, Biodiversity |
| History | Ancient, Medieval, Modern, Freedom Struggle |
| International Relations | Foreign Policy, Global Organizations, Bilateral Relations, Conflicts |
| Science & Technology | Space, Defense, IT, Biotechnology, Innovation |
| Internal Security | Defense, Terrorism, Cybersecurity, Border Management |

### TNPSC
| Topic | Subtopics |
|---|---|
| Indian Polity | Constitution, Governance, Public Policy, Rights Issues |
| Economy | Budget, Banking, Trade, Agriculture, Industry |
| Geography | Environment, Climate Change, Natural Resources, Disasters |
| History & Culture | Heritage, Art Forms, Historical Events, Monuments |
| Current Affairs | National Events, International Relations, Science & Tech, Sports |
| Tamil Nadu Specific | State Politics, State Economy, Regional Issues, Local Governance |

### Railways, SSC, State PSC
Covered via General Awareness, General Knowledge, and subject-specific topics.

---

## 🤖 AI Classification Logic

The backend uses a **weighted keyword scoring system** to classify each article:

```
Primary keywords   → 3 points each
Secondary keywords → 2 points each  
Tertiary keywords  → 1 point each
```

Top 3 matching topics are assigned to each article. Relevance score (50–100) is calculated based on total keyword match density + position bias.

---

## 💡 Assumptions Made

1. **NewsAPI Free Tier**: The free tier of NewsAPI returns up to 100 articles per request and only allows queries from `localhost` (not deployed servers). A paid plan is needed for production deployment.

2. **Local MongoDB**: The application assumes MongoDB is running locally. No cloud database (Atlas) is configured by default.

3. **Google TTS via Proxy**: Google TTS API is called through the backend `/api/tts` endpoint to avoid CORS issues and to support long text by splitting into chunks.

4. **Single-File Frontend**: The entire React frontend is implemented in `src/App.jsx` as a single component file with inline page routing using state.

5. **No Email Verification**: User registration does not require email verification for simplicity.

6. **Fallback Sample Data**: If NewsAPI is unavailable or returns an error, the app falls back to a set of pre-defined sample news articles so the UI remains functional.

7. **Tamil Language TTS**: Tamil TTS is supported by passing `lang: 'ta'` to the Google TTS API. English is the default.

8. **Auto-refresh**: News is automatically refreshed every 30 minutes in the background without user interaction.

---

## 🖼️ Screenshots

### 1. Home Page

![image alt](https://github.com/Arul-2004/AI-Powered-News-Summarizer/blob/main/Screenshot%202026-06-30%20154932.png?raw=true)

> Exam selector with category cards for UPSC, TNPSC, SSC, Railways, State PSC

### 2. User Authentication

![image alt](https://github.com/Arul-2004/AI-Powered-News-Summarizer/blob/main/Screenshot%202026-06-30%20155729.png?raw=true)

> Login and Signup with JWT-based session management

### 3. News Feed

![image alt](https://github.com/Arul-2004/AI-Powered-News-Summarizer/blob/main/Screenshot%202026-06-30%20155140.png?raw=true)

> Filtered news with relevance scores, topic tags, audio controls, and download options

