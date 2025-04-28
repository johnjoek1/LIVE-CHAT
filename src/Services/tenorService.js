//tenorService

const axios = require('axios');

const TENOR_API_KEY = process.env.TENOR_API_KEY;
const TENOR_BASE_URL = 'https://g.tenor.com/v1';

// Search for GIFs based on a query
const searchGIFs = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${TENOR_BASE_URL}/search`, {
      params: {
        q: query,
        key: TENOR_API_KEY,
        limit,
      },
    });

    return response.data.results.map((gif) => ({
      id: gif.id,
      url: gif.media[0].gif.url,
    }));
  } catch (error) {
    console.error('Error fetching GIFs:', error);
    throw new Error('Failed to fetch GIFs from Tenor');
  }
};

// Fetch trending GIFs
const getTrendingGIFs = async (limit = 10) => {
  try {
    const response = await axios.get(`${TENOR_BASE_URL}/trending`, {
      params: {
        key: TENOR_API_KEY,
        limit,
      },
    });

    return response.data.results.map((gif) => ({
      id: gif.id,
      url: gif.media[0].gif.url,
    }));
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    throw new Error('Failed to fetch trending GIFs from Tenor');
  }
};

module.exports = { searchGIFs, getTrendingGIFs };




