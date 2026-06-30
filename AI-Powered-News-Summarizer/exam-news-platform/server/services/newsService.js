import axios from 'axios';
import process from 'process';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '76d8c0babc0449c8b7e8f6c7d3a8b9e2';

// Keyword mappings for different exam topics
const TOPIC_KEYWORDS = {
  'Indian Polity': [
    'constitution', 'parliament', 'lok sabha', 'rajya sabha', 'judiciary', 'supreme court',
    'governance', 'policy', 'rights', 'amendments', 'federal', 'state government', 'elections'
  ],
  'Economy': [
    'budget', 'banking', 'rbi', 'monetary', 'gdp', 'inflation', 'trade', 'agriculture',
    'industry', 'commerce', 'economic survey', 'fiscal', 'tax', 'rupee', 'stock market'
  ],
  'Geography': [
    'environment', 'climate', 'natural resources', 'disaster', 'biodiversity', 'forests',
    'water', 'soil', 'mountains', 'ocean', 'islands', 'national park', 'wildlife'
  ],
  'History & Culture': [
    'heritage', 'art', 'culture', 'history', 'monuments', 'dynasty', 'empire', 'historical',
    'museum', 'archaeology', 'tradition', 'festival', 'architecture'
  ],
  'Current Affairs': [
    'news', 'event', 'announcement', 'summit', 'conference', 'agreement', 'treaty',
    'international', 'bilateral', 'diplomatic', 'latest', 'recent'
  ],
  'Science & Technology': [
    'science', 'technology', 'space', 'isro', 'nasa', 'innovation', 'tech', 'ai',
    'research', 'development', 'invention', 'discovery', 'nuclear', 'satellite'
  ],
  'International Relations': [
    'international', 'foreign', 'bilateral', 'multilateral', 'un', 'nato', 'relations',
    'diplomatic', 'embassy', 'treaty', 'agreement', 'trade deal', 'geopolitics'
  ],
  'Internal Security': [
    'security', 'terrorism', 'cyber', 'defense', 'military', 'war', 'conflict',
    'border', 'terrorist', 'attack', 'naxal', 'insurgency', 'police'
  ]
};

// Exam-specific topic mappings
const EXAM_TOPICS = {
  tnpsc: ['Indian Polity', 'Economy', 'Geography', 'History & Culture', 'Current Affairs', 'Tamil Nadu Specific'],
  upsc: ['Indian Polity', 'Economy', 'Geography', 'History', 'International Relations', 'Science & Technology', 'Internal Security'],
  railways: ['General Awareness', 'Railway Specific', 'General Science'],
  ssc: ['General Awareness', 'General Knowledge', 'Indian Polity'],
  state_psc: ['State Affairs', 'General Studies', 'Current Affairs']
};

/**
 * Classify news article into topics based on content
 */
export const classifyNews = (article) => {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  const matchedTopics = [];

  // Find matching topics based on keywords
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (matchCount > 0) {
      matchedTopics.push({ topic, matches: matchCount });
    }
  }

  // Sort by relevance (number of matches)
  matchedTopics.sort((a, b) => b.matches - a.matches);
  return matchedTopics.slice(0, 3).map(t => t.topic);
};

/**
 * Calculate relevance score based on keyword density
 */
export const calculateRelevance = (article, topics) => {
  if (topics.length === 0) return 50;
  
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  let totalMatches = 0;

  for (const topic of topics) {
    const keywords = TOPIC_KEYWORDS[topic] || [];
    totalMatches += keywords.filter(keyword => text.includes(keyword)).length;
  }

  // Relevance score: 50-100
  return Math.min(100, 50 + (totalMatches * 5));
};

/**
 * Determine which exams are relevant for this article
 */
export const mapToExams = (topics) => {
  const exams = new Set();

  for (const exam in EXAM_TOPICS) {
    const examTopics = EXAM_TOPICS[exam];
    const isRelevant = topics.some(t => 
      examTopics.some(et => et.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(et.toLowerCase()))
    );
    if (isRelevant) exams.add(exam);
  }

  return Array.from(exams);
};

/**
 * Fetch news from NewsAPI and classify
 */
export const fetchAndClassifyNews = async () => {
  try {
    console.log('Fetching news from NewsAPI...');
    
    // Fetch from multiple queries to get diverse news
    const queries = [
      'india government policy',
      'indian economy business',
      'science technology innovation',
      'environment climate',
      'international relations',
      'indian history culture'
    ];

    let allArticles = [];

    for (const query of queries) {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: query,
            sortBy: 'publishedAt',
            language: 'en',
            pageSize: 10,
            apiKey: NEWSAPI_KEY
          },
          timeout: 10000
        });

        if (response.data.articles) {
          allArticles = allArticles.concat(response.data.articles);
        }
      } catch (error) {
        console.warn(`Error fetching for query "${query}":`, error.message);
      }
    }

    // Remove duplicates based on title
    const uniqueArticles = [];
    const seenTitles = new Set();

    for (const article of allArticles) {
      if (!seenTitles.has(article.title)) {
        seenTitles.add(article.title);
        uniqueArticles.push(article);
      }
    }

    // Classify and enrich articles
    const classifiedArticles = uniqueArticles.slice(0, 50).map((article, idx) => {
      const topics = classifyNews(article);
      const relevance = calculateRelevance(article, topics);
      const exams = mapToExams(topics);

      return {
        id: idx + 1,
        title: article.title,
        description: article.description || '',
        content: article.content || article.description || '',
        source: article.source?.name || 'Unknown',
        date: article.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        url: article.url,
        imageUrl: article.urlToImage,
        relevance: Math.round(relevance),
        topics: topics,
        exams: exams,
        syllabusMatch: topics,
        pyqRelevance: `This topic is relevant to ${exams.length > 0 ? exams.join(', ').toUpperCase() : 'multiple exams'}. Stay updated with recent developments.`,
        summary: null
      };
    });

    console.log(`Successfully fetched and classified ${classifiedArticles.length} articles`);
    return classifiedArticles;
  } catch (error) {
    console.error('Error in fetchAndClassifyNews:', error.message);
    // Return empty array on failure (frontend will handle gracefully)
    return [];
  }
};

/**
 * Get news filtered by exam and optionally by topic
 */
export const getNewsByExamAndTopic = (allNews, exam, topic = null) => {
  return allNews.filter(article => {
    const hasExam = article.exams.includes(exam);
    const hasTopic = !topic || article.topics.includes(topic);
    return hasExam && hasTopic;
  });
};

export default {
  fetchAndClassifyNews,
  classifyNews,
  calculateRelevance,
  mapToExams,
  getNewsByExamAndTopic
};
