import axios from 'axios';
import logger from '../utils/logger';

const API_BASE = 'http://localhost:5000';

export async function shortenUrl(data) {
  try {
    logger.log('POST', '/shorturls', data);
    const res = await axios.post(`${API_BASE}/shorturls`, data);
    logger.log('RESPONSE', '/shorturls', res.data);
    return res.data;
  } catch (err) {
    logger.log('ERROR', '/shorturls', err.response?.data || err.message);
    throw err;
  }
}

export async function getStats(shortcode) {
  try {
    logger.log('GET', `/shorturls/${shortcode}`);
    const res = await axios.get(`${API_BASE}/shorturls/${shortcode}`);
    logger.log('RESPONSE', `/shorturls/${shortcode}`, res.data);
    return res.data;
  } catch (err) {
    logger.log('ERROR', `/shorturls/${shortcode}`, err.response?.data || err.message);
    throw err;
  }
} 