import * as googleTTS from 'google-tts-api';
import fetch from 'node-fetch';

async function test() {
  try {
    const url = googleTTS.getAudioUrl('Hello', {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com'
    });
    console.log('URL:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    if (res.ok) {
      console.log('Success!');
    } else {
      console.log('Failed to fetch from Google:', await res.text());
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
