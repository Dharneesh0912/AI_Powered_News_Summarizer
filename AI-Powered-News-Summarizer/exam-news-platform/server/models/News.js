import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  relevance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  topics: [{
    type: String,
    required: true
  }],
  exams: [{
    type: String,
    required: true
  }],
  summary: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  syllabusMatch: [{
    type: String
  }],
  pyqRelevance: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
newsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ relevance: -1 });
newsSchema.index({ topics: 1 });
newsSchema.index({ exams: 1 });

const News = mongoose.model('News', newsSchema);

export default News;