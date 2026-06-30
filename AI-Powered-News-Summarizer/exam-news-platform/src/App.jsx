import React, { useState, useEffect, useCallback } from 'react';
import { Menu, User, BookOpen, Headphones, FileText, ChevronRight, Search, Filter, Download, Flag, Volume2, Eye, Clock, TrendingUp, CheckCircle, Newspaper, Tag, BarChart3, AlertCircle, Play, Pause } from 'lucide-react';

// Mock data for demonstration
const EXAMS = [
  { id: 'tnpsc', name: 'TNPSC', fullName: 'Tamil Nadu Public Service Commission', icon: '🏛️' },
  { id: 'upsc', name: 'UPSC', fullName: 'Union Public Service Commission', icon: '🇮🇳' },
  { id: 'railways', name: 'Railways', fullName: 'Railway Recruitment Board', icon: '🚂' },
  { id: 'ssc', name: 'SSC', fullName: 'Staff Selection Commission', icon: '📋' },
  { id: 'state_psc', name: 'State PSC', fullName: 'State Public Service Commissions', icon: '🏢' }
];

const SYLLABUS_TOPICS = {
  tnpsc: {
    'Indian Polity': ['Constitution', 'Governance', 'Public Policy', 'Rights Issues'],
    'Economy': ['Budget', 'Banking', 'Trade', 'Agriculture', 'Industry'],
    'Geography': ['Environment', 'Climate Change', 'Natural Resources', 'Disasters'],
    'History & Culture': ['Heritage', 'Art Forms', 'Historical Events', 'Monuments'],
    'Current Affairs': ['National Events', 'International Relations', 'Science & Tech', 'Sports'],
    'Tamil Nadu Specific': ['State Politics', 'State Economy', 'Regional Issues', 'Local Governance']
  },
  upsc: {
    'Indian Polity': ['Constitution', 'Parliament', 'Judiciary', 'Federalism', 'Public Policy'],
    'Economy': ['Budget', 'Banking', 'Trade', 'Agriculture', 'Industry', 'Economic Survey'],
    'Geography': ['Environment', 'Climate Change', 'Natural Resources', 'Disasters', 'Biodiversity'],
    'History': ['Ancient', 'Medieval', 'Modern', 'Freedom Struggle'],
    'International Relations': ['Foreign Policy', 'Global Organizations', 'Bilateral Relations', 'Conflicts'],
    'Science & Technology': ['Space', 'Defense', 'IT', 'Biotechnology', 'Innovation'],
    'Internal Security': ['Defense', 'Terrorism', 'Cybersecurity', 'Border Management']
  },
  railways: {
    'General Awareness': ['Current Affairs', 'Indian Economy', 'Geography', 'Science'],
    'Railway Specific': ['Railway Budget', 'New Projects', 'Technology', 'Safety'],
    'General Science': ['Physics', 'Chemistry', 'Biology', 'Technology']
  },
  ssc: {
    'General Awareness': ['Current Affairs', 'Indian Economy', 'Geography', 'Science'],
    'General Knowledge': ['History', 'Culture', 'Sports', 'Awards'],
    'Indian Polity': ['Constitution', 'Governance', 'Public Policy']
  },
  state_psc: {
    'State Affairs': ['State Politics', 'State Economy', 'Regional Issues'],
    'General Studies': ['History', 'Geography', 'Polity', 'Economy'],
    'Current Affairs': ['National Events', 'International Relations']
  }
};

const SAMPLE_NEWS = [
  {
    id: 1,
    title: 'Government Announces New Agricultural Policy Reform',
    source: 'The Hindu',
    date: '2025-10-27',
    relevance: 95,
    topics: ['Economy', 'Agriculture', 'Public Policy'],
    exams: ['upsc', 'tnpsc', 'ssc'],
    summary: null,
    content: 'The government has unveiled a comprehensive agricultural policy reform aimed at doubling farmers income by 2027. The policy includes provisions for minimum support price guarantees, crop insurance expansion, and direct benefit transfers to farmers. Key highlights include a 15% increase in MSP for major crops, expansion of PM-KISAN scheme, and establishment of 10,000 new farmer producer organizations. The reform also introduces climate-resilient farming practices and promotes organic agriculture through subsidies.',
    syllabusMatch: ['Agriculture', 'Public Policy', 'Rural Development'],
    pyqRelevance: 'Similar topics appeared in UPSC Prelims 2023 Q45, TNPSC Group 1 2022 Q78'
  },
  {
    id: 2,
    title: 'Supreme Court Ruling on Right to Privacy in Digital Age',
    source: 'Indian Express',
    date: '2025-10-26',
    relevance: 98,
    topics: ['Indian Polity', 'Rights Issues', 'Technology'],
    exams: ['upsc', 'tnpsc', 'ssc', 'state_psc'],
    summary: null,
    content: 'The Supreme Court delivered a landmark judgment strengthening the right to privacy in the digital domain. The court ruled that citizens have a fundamental right to control their personal data and mandated explicit consent for data collection. The judgment establishes clear guidelines for data protection, imposing strict penalties on organizations violating privacy norms. This ruling is expected to influence the pending Data Protection Bill.',
    syllabusMatch: ['Constitution', 'Fundamental Rights', 'Judiciary', 'Technology'],
    pyqRelevance: 'Privacy rights covered in UPSC Mains 2022 GS2, TNPSC Group 2 2023 Q34'
  },
  {
    id: 3,
    title: 'India Launches New Renewable Energy Mission Targeting 500 GW by 2030',
    source: 'Times of India',
    date: '2025-10-25',
    relevance: 92,
    topics: ['Environment', 'Energy', 'Climate Change'],
    exams: ['upsc', 'tnpsc', 'railways'],
    summary: null,
    content: 'India has launched an ambitious renewable energy mission with a target of 500 GW capacity by 2030. The mission focuses on solar, wind, and green hydrogen production. Investment of ₹30 lakh crore is expected in the renewable energy sector. The government announced production-linked incentives for solar panel manufacturing and plans to set up 50 solar parks across the country. The mission aligns with Indias net-zero commitments by 2070.',
    syllabusMatch: ['Environment', 'Energy Policy', 'Climate Change', 'International Commitments'],
    pyqRelevance: 'Renewable energy questions in UPSC Prelims 2023 Q67, Railway NTPC 2023'
  },
  {
    id: 4,
    title: 'Tamil Nadu Announces New Industrial Policy with Focus on Electronics Manufacturing',
    source: 'The Hindu Tamil',
    date: '2025-10-24',
    relevance: 96,
    topics: ['Economy', 'Tamil Nadu Specific', 'Industry'],
    exams: ['tnpsc'],
    summary: null,
    content: 'The Tamil Nadu government unveiled a new industrial policy focusing on electronics manufacturing and semiconductor production. The policy offers special incentives for companies setting up manufacturing units in the state. An allocation of ₹5,000 crore has been made for infrastructure development in industrial corridors. The policy aims to create 5 lakh jobs over the next five years and position Tamil Nadu as a global electronics manufacturing hub.',
    syllabusMatch: ['State Economy', 'Industrial Policy', 'Employment Generation'],
    pyqRelevance: 'State economy questions featured in TNPSC Group 1 2023, Group 2 2024'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelevance, setFilterRelevance] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  
  // Audio control states
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState('narrative');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  // Playlist states
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);
  const [_playlistMode, setPlaylistMode] = useState('narrative');
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [showModeSelector, setShowModeSelector] = useState(false);
  
  // News refresh states
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasStoredNews, setHasStoredNews] = useState(false);

  // Fetch news from backend API on mount with auto-refresh
  useEffect(() => {
    const fetchNews = async (showLoading = false, forceRefresh = false) => {
      if (showLoading) setIsRefreshing(true);

      try {
        const refreshParam = forceRefresh ? '&refresh=true' : '';
        const res = await fetch(`http://localhost:3001/api/news?q=india%20news%20economy%20politics%20environment${refreshParam}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setNews(data.articles);
          setLastUpdated(new Date());
          setHasStoredNews(data.hasStoredNews || false);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
        // Show sample news on both initial load and refresh failure
        setNews(SAMPLE_NEWS);
      } finally {
        if (showLoading) setIsRefreshing(false);
      }
    };

    // Initial fetch
    fetchNews();

    // Auto-refresh every 30 minutes (30 * 60 * 1000 = 1,800,000 ms)
    const interval = setInterval(() => {
      fetchNews(true);
    }, 30 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      const refreshParam = forceRefresh ? '&refresh=true' : '';
      const res = await fetch(`http://localhost:3001/api/news?q=india%20news%20economy%20politics%20environment${refreshParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setNews(data.articles);
        setLastUpdated(new Date());
        setHasStoredNews(data.hasStoredNews || false);
      }
    } catch (err) {
      console.error('Failed to refresh news', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check if user is already logged in
  const verifyUserToken = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setCurrentPage('home');
      } else {
        localStorage.removeItem('authToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      verifyUserToken();
    }
  }, [token, user, verifyUserToken]);

  // Preload speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Voices are loaded
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  // Login Component
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
      setError('');
      setLoading(true);

      try {
        const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
        const payload = isSignup
          ? { name, email, password, confirmPassword }
          : { email, password };

        const response = await fetch(`http://localhost:3001${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('authToken', data.token);
          setToken(data.token);
          setUser(data.user);
          setCurrentPage('home');
        } else {
          setError(data.error || data.errors?.[0]?.msg || 'Authentication failed');
        }
      } catch (err) {
        setError('Connection error. Make sure the server is running.');
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam News Hub</h1>
            <p className="text-gray-600">Your Gateway to Exam-Relevant News</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="ml-2 text-blue-600 font-semibold hover:underline disabled:opacity-50"
              disabled={loading}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Privacy-first • 🌐 Open-source • ♿ Fully accessible
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Home Page
  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="text-blue-600" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Exam Daily</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Digital Newspaper</span>
            </div>
            <div className="flex items-center space-x-4">
              <User className="text-gray-600" size={24} />
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 text-white">
            <h1 className="text-5xl font-bold mb-4">
              📰 Your Exam Newspaper
            </h1>
            <p className="text-xl text-blue-100">
              Curated, auto-segregated news covering all syllabus topics. No clutter. Just what you need to know.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {EXAMS.map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  setSelectedExam(exam.id);
                  setCurrentPage('news');
                  setSelectedTopic(null);
                }}
                className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{exam.icon}</div>
                  <ChevronRight className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{exam.name}</h3>
                <p className="text-gray-600 text-sm">{exam.fullName}</p>
              </button>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white text-center border border-white border-opacity-20">
              <Newspaper className="mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">Auto-Segregated</h3>
              <p className="text-sm text-blue-100">News classified by syllabus topics automatically</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white text-center border border-white border-opacity-20">
              <Tag className="mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">Topic-Based</h3>
              <p className="text-sm text-blue-100">Find news for each syllabus domain</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white text-center border border-white border-opacity-20">
              <BarChart3 className="mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">Relevance Score</h3>
              <p className="text-sm text-blue-100">Know how relevant each article is</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white text-center border border-white border-opacity-20">
              <Headphones className="mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">Audio & Download</h3>
              <p className="text-sm text-blue-100">Listen and learn on-the-go</p>
            </div>
          </div>

          <div className="mt-12 text-center text-blue-100 text-sm">
            <p>📚 Real news from NewsAPI.org • 🤖 AI-powered classification • 💾 Save & download articles</p>
          </div>
        </div>
      </div>
    );
  };

  // Topics Page
  const TopicsPage = () => {
    const topics = SYLLABUS_TOPICS[selectedExam] || {};

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Back to Exams
              </button>
              <Newspaper className="text-blue-600" size={28} />
              <span className="text-xl font-bold text-gray-800">
                {EXAMS.find(e => e.id === selectedExam)?.name} Topics
              </span>
            </div>
            <User className="text-gray-600" size={24} />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Syllabus Topics</h2>
          <p className="text-gray-600 mb-8">Select a topic to see all relevant news articles</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(topics).map(([domain, subtopics]) => (
              <button
                key={domain}
                onClick={() => {
                  setSelectedTopic(domain);
                  setCurrentPage('news');
                }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:border-blue-500 transition-all text-left border-2 border-transparent"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-blue-600" />
                  {domain}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subtopics.slice(0, 2).map((sub, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {sub}
                    </span>
                  ))}
                  {subtopics.length > 2 && (
                    <span className="text-xs text-gray-500 font-medium">+{subtopics.length - 2} more</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-blue-800"><strong>Auto-segregation enabled:</strong> News articles are automatically classified and mapped to relevant topics based on keyword analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // News Page
  const NewsPage = () => {
    // Defensive filtering: ensure selectedExam/selectedTopic may be null and avoid runtime errors
    const filteredNews = news.filter((n) => {
      try {
        if (!selectedExam) return false;
        if (!Array.isArray(n.exams) || !n.exams.includes(selectedExam)) return false;
        if (selectedTopic) {
          const topicList = Array.isArray(n.topics) ? n.topics : [];
          const found = topicList.some((t) => {
            try {
              return String(t).toLowerCase().includes(String(selectedTopic).toLowerCase());
            } catch {
              return false;
            }
          });
          if (!found) return false;
        }
        if (typeof n.relevance === 'number' && n.relevance < filterRelevance) return false;
        if (searchQuery && !String(n.title || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      } catch (err) {
        console.error('Error filtering news item', n, err);
        return false;
      }
    });

    

    const generateSummary = (newsItem) => {
      // PERT-style summarization: score sentences by syllabus/exam relevance
      const content = (newsItem.content || newsItem.description || newsItem.title || '').trim();
      if (!content) {
        const fallback = newsItem.title ? `${newsItem.title}` : 'Summary not available.';
        setNews(prev => prev.map(n => n.id === newsItem.id ? { ...n, summary: fallback } : n));
        console.log('Generated fallback summary for', newsItem.id);
        return fallback;
      }

      // Split into sentences (keeps punctuation)
      const rawSentences = content.match(/[^.!?\n]+[.!?]?/g) || [content];
      const sentences = rawSentences.map(s => s.trim()).filter(Boolean);

      // Build keyword set from syllabus, selected topic, article topics and title
      const kwSet = new Set();
      const addWords = (text) => {
        if (!text) return;
        String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).forEach(w => kwSet.add(w));
      };

      // Add title words
      addWords(newsItem.title);

      // Add article topics
      (newsItem.topics || []).forEach(t => addWords(t));

      // Add selectedTopic and its syllabus keywords (if available)
      if (selectedTopic && selectedExam && SYLLABUS_TOPICS[selectedExam]) {
        addWords(selectedTopic);
        const domain = SYLLABUS_TOPICS[selectedExam][selectedTopic];
        if (Array.isArray(domain)) domain.forEach(d => addWords(d));
      }

      // Add syllabusMatch if present
      (newsItem.syllabusMatch || []).forEach(s => addWords(s));

      // Score sentences
      const docWords = content.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      const wordFreq = {};
      docWords.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);

      const sentenceScores = sentences.map((s, idx) => {
        const sWords = String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        // keyword score: count how many words in this sentence are in kwSet
        let kwMatches = 0;
        sWords.forEach(w => { if (kwSet.has(w)) kwMatches += 1; });

        // TF score: sum of word frequencies (gives prominence within article)
        let tfScore = 0;
        sWords.forEach(w => { tfScore += (wordFreq[w] || 0); });

        // Position bonus: earlier sentences get a small boost
        const positionBonus = Math.max(0, 1 - (idx / Math.max(1, sentences.length)));

        // Combined score
        const score = (kwMatches * 5) + tfScore + (positionBonus * 2) + (newsItem.relevance ? (newsItem.relevance / 100) : 0);
        return { idx, sentence: s, score };
      });

      // Pick top N sentences (default 2) but keep original order
      const N = 2;
      const top = sentenceScores.slice().sort((a, b) => b.score - a.score).slice(0, N).sort((a, b) => a.idx - b.idx);
      const summary = top.map(t => t.sentence).join(' ').trim();

      const finalSummary = summary || sentences.slice(0, Math.min(2, sentences.length)).join(' ');

      setNews(prev => prev.map(n => n.id == newsItem.id ? { ...n, summary: finalSummary } : n));
      console.log('Generated summary for', newsItem.id, finalSummary);
      return finalSummary;
    };

    

    const playPodcast = async (newsItem, mode = audioMode) => {
      const text = newsItem.summary || newsItem.content || newsItem.title || '';

      setIsLoadingAudio(true);

      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setIsPlaying(false);
      }

      // Try browser SpeechSynthesis first (prefer Indian English)
      if (false && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const voices = window.speechSynthesis.getVoices() || [];
          // Prefer Indian English, then any English voice
          let match = voices.find(v => v.lang && v.lang.toLowerCase() === 'en-in') || 
                     voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en') && v.lang.toLowerCase().includes('in')) ||
                     voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || 
                     voices.find(v => /english.*india/i.test(v.name)) ||
                     voices.find(v => /india.*english/i.test(v.name)) ||
                     voices.find(v => /english/i.test(v.name));
          if (match) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(`${newsItem.title}. ${text}`);
            utter.lang = match.lang || 'en-IN'; // Default to Indian English
            
            // Configure speech parameters based on mode
            switch (mode) {
              case 'reading':
                utter.rate = 0.8;
                utter.pitch = 1.0;
                break;
              case 'calm':
                utter.rate = 0.7;
                utter.pitch = 0.9;
                break;
              case 'conversational':
                utter.rate = 1.1;
                utter.pitch = 1.1;
                break;
              case 'motivational':
                utter.rate = 1.2;
                utter.pitch = 1.2;
                break;
              case 'professional':
                utter.rate = 0.9;
                utter.pitch = 1.0;
                break;
              case 'dramatic':
                utter.rate = 0.85;
                utter.pitch = 1.3;
                break;
              case 'podcast':
                utter.rate = 1.05;
                utter.pitch = 1.05;
                break;
              default: // narrative
                utter.rate = 0.95;
                utter.pitch = 1.0;
            }
            
            utter.voice = match;
            
            utter.onstart = () => {
              setIsPlaying(true);
              setIsLoadingAudio(false);
            };
            utter.onend = () => setIsPlaying(false);
            utter.onerror = () => {
              setIsPlaying(false);
              setIsLoadingAudio(false);
            };
            
            window.speechSynthesis.speak(utter);
            return;
          }
        } catch (err) {
          console.warn('speechSynthesis play error', err);
        }
      }

      // Fallback: fetch audio from local TTS server and play
      try {
        const res = await fetch('http://localhost:3001/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: 'english', mode })
        });
        if (!res.ok) throw new Error('TTS server error ' + res.status);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(url);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(url);
        };
        
        setCurrentAudio(audio);
        audio.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch(e => {
          console.warn('audio.play failed', e);
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
      } catch (err) {
        console.error('playPodcast error', err);
        setIsLoadingAudio(false);
        alert('Audio not available. Ensure the TTS server is running (npm run start:server) or your browser has a suitable Indian English voice.');
      }
    };

    const pausePodcast = () => {
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }
    };

    const _resumePodcast = () => {
      if (currentAudio) {
        currentAudio.play().then(() => setIsPlaying(true)).catch(e => console.warn('resume failed', e));
      }
    };

    const downloadPodcast = async (newsItem) => {
      const text = newsItem.summary || newsItem.content || newsItem.title || '';
      try {
        // Use selected audio mode for download
        const res = await fetch('http://localhost:3001/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: 'english', mode: audioMode })
        });
        if (!res.ok) throw new Error('TTS server error ' + res.status);
        const blob = await res.blob();
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `${(newsItem.id || 'article')}-podcast-${audioMode}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('downloadPodcast error', err);
        alert('Could not download audio. Ensure the TTS server is running (npm run start:server).');
      }
    };

    // Playlist functions
    const startPlaylist = (mode) => {
      setIsPlaylistMode(true);
      setPlaylistMode(mode);
      setCurrentPlaylistIndex(0);
      setShowModeSelector(false);
      playPlaylistItem(0, mode);
    };

    const playPlaylistItem = async (index, mode) => {
      if (index >= filteredNews.length) {
        // Loop back to beginning (circular playlist)
        index = 0;
        setCurrentPlaylistIndex(0);
      }

      const newsItem = filteredNews[index];
      if (!newsItem) return;

      setCurrentPlaylistIndex(index);
      setIsLoadingAudio(true);

      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      const text = newsItem.summary || newsItem.content || newsItem.title || '';

      // Try browser SpeechSynthesis first
      if (false && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const voices = window.speechSynthesis.getVoices() || [];
          let match = voices.find(v => v.lang && v.lang.toLowerCase() === 'en-in') || 
                     voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en') && v.lang.toLowerCase().includes('in')) ||
                     voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || 
                     voices.find(v => /english.*india/i.test(v.name)) ||
                     voices.find(v => /india.*english/i.test(v.name)) ||
                     voices.find(v => /english/i.test(v.name));
          if (match) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(`${newsItem.title}. ${text}`);
            utter.lang = match.lang || 'en-IN';
            
            // Configure speech parameters based on mode
            switch (mode) {
              case 'reading':
                utter.rate = 0.8;
                utter.pitch = 1.0;
                break;
              case 'calm':
                utter.rate = 0.7;
                utter.pitch = 0.9;
                break;
              case 'conversational':
                utter.rate = 1.1;
                utter.pitch = 1.1;
                break;
              case 'motivational':
                utter.rate = 1.2;
                utter.pitch = 1.2;
                break;
              case 'professional':
                utter.rate = 0.9;
                utter.pitch = 1.0;
                break;
              case 'dramatic':
                utter.rate = 0.85;
                utter.pitch = 1.3;
                break;
              case 'podcast':
                utter.rate = 1.05;
                utter.pitch = 1.05;
                break;
              default: // narrative
                utter.rate = 0.95;
                utter.pitch = 1.0;
            }
            
            utter.voice = match;
            
            utter.onstart = () => {
              setIsPlaying(true);
              setIsLoadingAudio(false);
            };
            utter.onend = () => {
              setIsPlaying(false);
              // Auto-play next item in playlist
              if (isPlaylistMode) {
                const nextIndex = (index + 1) % filteredNews.length;
                setTimeout(() => playPlaylistItem(nextIndex, mode), 1000); // 1 second pause between articles
              }
            };
            utter.onerror = () => {
              setIsPlaying(false);
              setIsLoadingAudio(false);
              if (isPlaylistMode) {
                const nextIndex = (index + 1) % filteredNews.length;
                setTimeout(() => playPlaylistItem(nextIndex, mode), 1000);
              }
            };
            
            window.speechSynthesis.speak(utter);
            return;
          }
        } catch (err) {
          console.warn('speechSynthesis playlist error', err);
        }
      }

      // Fallback: fetch audio from local TTS server
      try {
        const res = await fetch('http://localhost:3001/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: 'english', mode })
        });
        if (!res.ok) throw new Error('TTS server error ' + res.status);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(url);
          // Auto-play next item in playlist
          if (isPlaylistMode) {
            const nextIndex = (index + 1) % filteredNews.length;
            setTimeout(() => playPlaylistItem(nextIndex, mode), 1000);
          }
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(url);
          if (isPlaylistMode) {
            const nextIndex = (index + 1) % filteredNews.length;
            setTimeout(() => playPlaylistItem(nextIndex, mode), 1000);
          }
        };
        
        setCurrentAudio(audio);
        audio.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch(e => {
          console.warn('playlist audio.play failed', e);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          if (isPlaylistMode) {
            const nextIndex = (index + 1) % filteredNews.length;
            setTimeout(() => playPlaylistItem(nextIndex, mode), 1000);
          }
        });
      } catch (err) {
        console.error('playlist playPodcast error', err);
        setIsLoadingAudio(false);
        if (isPlaylistMode) {
          const nextIndex = (index + 1) % filteredNews.length;
          setTimeout(() => playPlaylistItem(nextIndex, mode), 1000);
        }
      }
    };

    const pausePlaylist = () => {
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }
    };

    const resumePlaylist = () => {
      if (currentAudio) {
        currentAudio.play().then(() => setIsPlaying(true)).catch(e => console.warn('resume failed', e));
      }
    };

    const stopPlaylist = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setIsPlaying(false);
      setIsPlaylistMode(false);
      setCurrentPlaylistIndex(0);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentPage('topics')} className="text-blue-600">← Back</button>
              <BookOpen className="text-blue-600" size={28} />
              <div className="text-lg font-bold">{EXAMS.find(e => e.id === selectedExam)?.name}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">{selectedTopic}</div>
              
              {/* Playlist Controls */}
              {!isPlaylistMode ? (
                <button 
                  onClick={() => setShowModeSelector(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Headphones size={16} />
                  Start Audio Playlist
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Playing: {currentPlaylistIndex + 1}/{filteredNews.length}
                  </span>
                  {isPlaying ? (
                    <button 
                      onClick={pausePlaylist}
                      className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors"
                    >
                      <Pause size={14} />
                      Pause
                    </button>
                  ) : (
                    <button 
                      onClick={resumePlaylist}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      <Play size={14} />
                      Resume
                    </button>
                  )}
                  <button 
                    onClick={stopPlaylist}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    ⏹️ Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Audio Mode Selector Modal */}
        {showModeSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4 text-center">Choose Audio Mode for Playlist</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={() => startPlaylist('narrative')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">📖</span>
                  <span className="font-medium">Narrative</span>
                  <span className="text-xs text-gray-500 text-center">Default storytelling</span>
                </button>
                <button 
                  onClick={() => startPlaylist('reading')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">📰</span>
                  <span className="font-medium">Reading News</span>
                  <span className="text-xs text-gray-500 text-center">Formal news reading</span>
                </button>
                <button 
                  onClick={() => startPlaylist('conversational')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <span className="font-medium">Conversational</span>
                  <span className="text-xs text-gray-500 text-center">Chat-like friendly</span>
                </button>
                <button 
                  onClick={() => startPlaylist('motivational')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">⚡</span>
                  <span className="font-medium">Motivational</span>
                  <span className="text-xs text-gray-500 text-center">High-energy inspiring</span>
                </button>
                <button 
                  onClick={() => startPlaylist('professional')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">👔</span>
                  <span className="font-medium">Professional</span>
                  <span className="text-xs text-gray-500 text-center">Authoritative business</span>
                </button>
                <button 
                  onClick={() => startPlaylist('dramatic')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">🎭</span>
                  <span className="font-medium">Dramatic</span>
                  <span className="text-xs text-gray-500 text-center">Theatrical engaging</span>
                </button>
                <button 
                  onClick={() => startPlaylist('podcast')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">🎧</span>
                  <span className="font-medium">Podcast Style</span>
                  <span className="text-xs text-gray-500 text-center">Modern engaging</span>
                </button>
                <button 
                  onClick={() => startPlaylist('calm')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="text-2xl">😌</span>
                  <span className="font-medium">Calm & Relaxing</span>
                  <span className="text-xs text-gray-500 text-center">Soothing focused</span>
                </button>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModeSelector(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{filteredNews.length} Relevant Articles</h2>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleString()} 
                {isRefreshing && <span className="ml-2 text-blue-500">🔄 Refreshing...</span>}
                {hasStoredNews && <span className="ml-2 text-green-600">💾 Stored news available</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleManualRefresh(false)}
                  disabled={isRefreshing}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isRefreshing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  title="Refresh from stored news (faster)"
                >
                  {isRefreshing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      🔄 Quick Refresh
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleManualRefresh(true)}
                  disabled={isRefreshing}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isRefreshing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title="Fetch fresh news from NewsAPI (slower)"
                >
                  🆕 Fresh News
                </button>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border rounded"
              />
              <select
                value={filterRelevance}
                onChange={(e) => setFilterRelevance(Number(e.target.value))}
                className="px-2 py-1 border rounded"
              >
                <option value={0}>All</option>
                <option value={90}>90%+</option>
                <option value={95}>95%+</option>
              </select>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">No relevant articles found for this exam and topic.</div>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`bg-white p-4 rounded shadow ${
                    isPlaylistMode && index === currentPlaylistIndex 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : ''
                  }`}
                >
                  {isPlaylistMode && index === currentPlaylistIndex && (
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Now Playing</span>
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.source} • {item.date} • {item.relevance}%</p>
                  <p className="mt-2 text-gray-700">{item.description || item.content}</p>

                  {/* PERT Summary box */}
                  {item.summary && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 mt-4 rounded">
                      <div className="flex items-center gap-3 mb-2">
                        <Eye size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-800">PERT Summary</span>
                      </div>
                      <p className="text-gray-700">{item.summary}</p>
                    </div>
                  )}

                  {/* PYQ Connection box */}
                  {item.pyqRelevance && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="font-semibold text-green-800">PYQ Connection</span>
                      </div>
                      <p className="text-gray-700 text-sm">{item.pyqRelevance}</p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-3">
                    {/* Audio Mode Selection */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Audio Mode:</span>
                      <select 
                        value={audioMode} 
                        onChange={(e) => setAudioMode(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="narrative">📖 Narrative</option>
                        <option value="reading">📰 Reading News</option>
                        <option value="conversational">💬 Conversational</option>
                        <option value="motivational">⚡ Motivational</option>
                        <option value="professional">👔 Professional</option>
                        <option value="dramatic">🎭 Dramatic</option>
                        <option value="podcast">🎧 Podcast Style</option>
                        <option value="calm">😌 Calm & Relaxing</option>
                      </select>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex gap-3 items-center">
                      {item.summary ? (
                        <button className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg" disabled>
                          <FileText size={16} />
                          Summarized
                        </button>
                      ) : (
                        <button onClick={() => generateSummary(item)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                          <FileText size={16} />
                          Summarize
                        </button>
                      )}

                      {/* Individual audio controls - disabled during playlist mode */}
                      {isPlaylistMode ? (
                        <button disabled className="flex items-center gap-2 bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed">
                          <Headphones size={16} />
                          Use Playlist Controls
                        </button>
                      ) : isPlaying ? (
                        <button onClick={pausePodcast} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg">
                          <Pause size={16} />
                          Pause
                        </button>
                      ) : isLoadingAudio ? (
                        <button disabled className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </button>
                      ) : (
                        <button onClick={() => playPodcast(item)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
                          <Play size={16} />
                          Play Audio
                        </button>
                      )}

                      <button 
                        onClick={() => downloadPodcast(item)} 
                        disabled={isPlaylistMode}
                        className={`flex items-center gap-2 border px-4 py-2 rounded-lg ${
                          isPlaylistMode 
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render current page
  return (
    <>
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'topics' && <TopicsPage />}
      {currentPage === 'news' && <NewsPage />}
    </>
  );
}

export default App;


