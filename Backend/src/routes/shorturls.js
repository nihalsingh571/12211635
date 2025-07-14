const express = require('express');
const router = express.Router();
const { createShortUrl, getAndValidateShortUrl, logClick } = require('../services/urlService');
const { getShortUrl } = require('../storage');

// POST /shorturls - create a short URL
router.post('/', (req, res) => {
  const { url, validity, shortcode } = req.body;
  const result = createShortUrl({ url, validity, shortcode });
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  const { shortcode: code, expiry } = result;
  const host = req.protocol + '://' + req.get('host');
  res.status(201).json({
    shortLink: `${host}/${code}`,
    expiry: expiry.toISOString(),
  });
});

// GET /shorturls/:shortcode - get stats for a short URL
router.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const result = getAndValidateShortUrl(shortcode);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  const { url, createdAt, expiry, clicks } = result.data;
  res.json({
    url,
    createdAt,
    expiry,
    clickCount: clicks.length,
    clicks: clicks.map(c => ({
      timestamp: c.timestamp,
      referrer: c.referrer,
      location: c.location,
    })),
  });
});

module.exports = router; 