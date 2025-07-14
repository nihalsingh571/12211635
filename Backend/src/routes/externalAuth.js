const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CREDENTIALS_PATH = path.join(__dirname, '../../external-credentials.json');

// Helper to save credentials/token
function saveCredentials(data) {
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(data, null, 2));
}
function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) return {};
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/register', req.body);
    const creds = { ...req.body, ...response.data };
    saveCredentials(creds);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// POST /api/auth
router.post('/auth', async (req, res) => {
  try {
    const creds = req.body.clientID ? req.body : loadCredentials();
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', creds);
    const all = { ...creds, ...response.data };
    saveCredentials(all);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// GET /api/credentials
router.get('/credentials', (req, res) => {
  const creds = loadCredentials();
  res.json(creds);
});

module.exports = router; 