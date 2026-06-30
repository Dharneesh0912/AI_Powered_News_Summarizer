/* eslint-env node */
import express from 'express';
import cors from 'cors';
import * as googleTTS from 'google-tts-api';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import process from 'process';
import { signup, login, getCurrentUser, verifyToken } from './controllers/authController.js';
import { signupValidation, loginValidation } from './middlewares/validation.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang = 'english', mode = 'narrative' } = req.body || {};
    if (!text) return res.status(400).send('Missing text');

    // Map incoming lang to google-tts friendly code
    const code = (lang || 'english').toLowerCase().startsWith('ta') || (lang === 'tamil') ? 'ta' : 'en';

    // google-tts-api supports a `slow` flag. We'll infer slow from mode.
    const slow = mode === 'calm';

    // Build the audio URLs from google-tts-api (supports long text)
    const results = googleTTS.getAllAudioUrls(text, {
      lang: code,
      slow: !!slow,
      host: 'https://translate.google.com'
    });

    const buffers = [];
    for (const result of results) {
      const upstream = await fetch(result.url);
      if (!upstream.ok) return res.status(502).send('TTS provider error');
      const arrayBuffer = await upstream.arrayBuffer();
      buffers.push(Buffer.from(arrayBuffer));
    }

    const finalBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', finalBuffer.length);
    return res.send(finalBuffer);
  } catch (err) {
    console.error('TTS error', err);
    res.status(500).send('TTS server error: ' + err.message);
  }
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-news-db';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// News API Routes
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

// Enhanced syllabus keywords with weights for better classification
const SYLLABUS_KEYWORDS = {
  'Indian Polity': {
    primary: ['constitution', 'parliament', 'judiciary', 'supreme court', 'lok sabha', 'rajya sabha'],
    secondary: ['governance', 'policy', 'legislative', 'executive', 'federal', 'amendment'],
    tertiary: ['political', 'bill', 'act', 'law'],
    exams: ['upsc', 'tnpsc', 'state_psc']
  },
  'Economy': {
    primary: ['budget', 'gdp', 'inflation', 'rbi', 'banking', 'fiscal'],
    secondary: ['economic', 'trade', 'commerce', 'industry', 'market', 'stock'],
    tertiary: ['business', 'finance', 'investment', 'export', 'import'],
    exams: ['upsc', 'tnpsc', 'ssc']
  },
  'Geography': {
    primary: ['geography', 'climate', 'weather', 'monsoon', 'terrain', 'region'],
    secondary: ['natural resources', 'disaster', 'earthquake', 'flood', 'landslide'],
    tertiary: ['environment', 'forest', 'water', 'mountain', 'plateau'],
    exams: ['upsc', 'tnpsc', 'railways']
  },
  'History & Culture': {
    primary: ['heritage', 'historical', 'monument', 'civilization', 'dynasty', 'emperor'],
    secondary: ['freedom struggle', 'independence', 'colonial', 'ancient', 'medieval', 'modern'],
    tertiary: ['culture', 'art', 'tradition', 'festival', 'museum'],
    exams: ['upsc', 'tnpsc', 'ssc']
  },
  'Science & Technology': {
    primary: ['space', 'isro', 'satellite', 'technology', 'innovation', 'research'],
    secondary: ['science', 'physics', 'chemistry', 'biology', 'defense', 'cyber'],
    tertiary: ['discovery', 'invention', 'artificial intelligence', 'robotics'],
    exams: ['upsc', 'railways', 'ssc']
  },
  'Environment': {
    primary: ['climate change', 'renewable', 'solar', 'wind', 'pollution', 'carbon'],
    secondary: ['green', 'ecology', 'biodiversity', 'conservation', 'wildlife', 'forest'],
    tertiary: ['sustainable', 'emission', 'energy', 'natural'],
    exams: ['upsc', 'tnpsc']
  },
  'International Relations': {
    primary: ['foreign policy', 'bilateral', 'international', 'diplomacy', 'trade agreement'],
    secondary: ['global', 'conflict', 'treaty', 'organization', 'un', 'nato'],
    tertiary: ['relations', 'agreement', 'summit', 'cooperation'],
    exams: ['upsc', 'ssc']
  },
  'Current Affairs': {
    primary: ['news', 'announced', 'launched', 'inaugurated', 'appointed', 'elected'],
    secondary: ['event', 'national', 'state', 'report', 'decision', 'initiative'],
    tertiary: ['recent', 'latest', 'new'],
    exams: ['upsc', 'tnpsc', 'ssc', 'railways', 'state_psc']
  }
};

const classifyArticle = (article) => {
  const text = `${article.title} ${article.description}`.toLowerCase();
  const scores = {};
  
  Object.entries(SYLLABUS_KEYWORDS).forEach(([topic, data]) => {
    let score = 0;
    // Primary keywords: 3 points each
    data.primary.forEach(kw => { if (text.includes(kw)) score += 3; });
    // Secondary keywords: 2 points each
    data.secondary.forEach(kw => { if (text.includes(kw)) score += 2; });
    // Tertiary keywords: 1 point each
    data.tertiary.forEach(kw => { if (text.includes(kw)) score += 1; });
    
    if (score > 0) scores[topic] = score;
  });
  
  return Object.keys(scores).length > 0 
    ? Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic) 
    : ['Current Affairs'];
};

const getExamsForTopics = (topics) => {
  const examSet = new Set();
  topics.forEach(topic => {
    if (SYLLABUS_KEYWORDS[topic]) {
      SYLLABUS_KEYWORDS[topic].exams.forEach(exam => examSet.add(exam));
    }
  });
  return examSet.size > 0 ? Array.from(examSet) : ['upsc', 'tnpsc', 'ssc'];
};

const calculateRelevance = (article, topics) => {
  const text = `${article.title} ${article.description}`.toLowerCase();
  let relevance = 50; // base relevance
  
  // Add points for keyword matches
  let totalKeywordMatches = 0;
  topics.forEach(topic => {
    const data = SYLLABUS_KEYWORDS[topic];
    if (data) {
      totalKeywordMatches += data.primary.filter(kw => text.includes(kw)).length * 3;
      totalKeywordMatches += data.secondary.filter(kw => text.includes(kw)).length * 2;
      totalKeywordMatches += data.tertiary.filter(kw => text.includes(kw)).length;
    }
  });
  
  relevance += Math.min(totalKeywordMatches * 2, 40); // max +40 from keywords
  // Add small random variance for natural distribution
  relevance += (Math.random() - 0.5) * 5;
  
  return Math.min(Math.max(Math.round(relevance * 100) / 100, 50), 100);
};

app.get('/api/news', async (req, res) => {
  try {
    const { q = 'india', sortBy = 'publishedAt', language = 'en', pageSize = 20 } = req.query;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=${sortBy}&language=${language}&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('NewsAPI error');
    const data = await response.json();
    
    const articles = (data.articles || [])
      .filter(article => article.title && article.description) // Filter out incomplete articles
      .map((article, idx) => {
        const topics = classifyArticle(article);
        const exams = getExamsForTopics(topics);
        const relevance = calculateRelevance(article, topics);
        
        return {
          id: idx + 1,
          title: article.title,
          source: article.source.name,
          date: article.publishedAt.split('T')[0],
          relevance: relevance,
          topics: topics,
          exams: exams,
          summary: null,
          content: article.description || article.title,
          description: article.description,
          syllabusMatch: topics,
          pyqRelevance: `Matches ${topics.join(', ')} topics - relevant for exams: ${exams.join(', ')}`
        };
      });
    
    res.json({ success: true, articles, total: articles.length });
  } catch (err) {
    console.error('News fetch error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth Routes
app.post('/api/auth/signup', signupValidation, signup);
app.post('/api/auth/login', loginValidation, login);
app.get('/api/auth/me', verifyToken, getCurrentUser);

const PORT = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.PORT) ? globalThis.process.env.PORT : 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`TTS Server started successfully at http://localhost:${PORT}/api/tts`);
});
