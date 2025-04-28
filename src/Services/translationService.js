//translationService

const axios = require('axios');
require('dotenv').config();

const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(
      LIBRETRANSLATE_API_URL,
      {
        q: text,
        source: 'auto', // Automatically detect language
        target: targetLanguage,
        format: 'text',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return {
      translatedText: response.data.translatedText,
      detectedLanguage: response.data.detectedLanguage.code,
    };
  } catch (error) {
    console.error('Translation Error:', error.response?.data || error.message);
    return { translatedText: text, detectedLanguage: 'unknown' }; // Fallback to original text
  }
};

module.exports = { translateText };









