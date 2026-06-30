import * as googleTTS from 'google-tts-api';
import fs from 'fs';

const p = 'd:\\Duplicate mini 2 [AI POWERED NEWS ]\\exam-news-platform\\';
fs.writeFileSync(p + 'keys.txt', JSON.stringify(Object.keys(googleTTS), null, 2));
if (googleTTS.default) {
  fs.writeFileSync(p + 'default.txt', typeof googleTTS.default === 'object' ? JSON.stringify(Object.keys(googleTTS.default), null, 2) : typeof googleTTS.default);
} else {
  fs.writeFileSync(p + 'default.txt', 'no default export');
}
