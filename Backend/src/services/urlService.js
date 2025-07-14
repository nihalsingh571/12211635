const { addShortUrl, getShortUrl, updateShortUrl, addClick, shortcodeExists } = require('../storage');
const { generateShortcode, isValidShortcode } = require('../utils/shortcode');
const geoip = require('geoip-lite');

function createShortUrl({ url, validity, shortcode }) {
  // Validate URL
  try {
    new URL(url);
  } catch {
    return { error: 'Invalid URL format', status: 400 };
  }

  // Validity
  const validMinutes = validity && Number.isInteger(validity) && validity > 0 ? validity : 30;
  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + validMinutes * 60000);

  // Shortcode
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) return { error: 'Invalid shortcode format', status: 400 };
    if (shortcodeExists(code)) return { error: 'Shortcode already exists', status: 409 };
  } else {
    // Auto-generate unique shortcode
    let tries = 0;
    do {
      code = generateShortcode();
      tries++;
      if (tries > 10) return { error: 'Failed to generate unique shortcode', status: 500 };
    } while (shortcodeExists(code));
  }

  addShortUrl(code, { url, createdAt, expiry });
  return { shortcode: code, expiry };
}

function getAndValidateShortUrl(code) {
  const data = getShortUrl(code);
  if (!data) return { error: 'Shortcode not found', status: 404 };
  if (new Date() > new Date(data.expiry)) return { error: 'Shortcode expired', status: 410 };
  return { data };
}

function logClick(code, req) {
  const referrer = req.get('referer') || null;
  const ip = req.ip;
  const geo = geoip.lookup(ip) || {};
  addClick(code, {
    timestamp: new Date(),
    referrer,
    location: geo.city || geo.country || 'Unknown',
  });
}

module.exports = { createShortUrl, getAndValidateShortUrl, logClick }; 