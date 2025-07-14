const express = require('express');
const { loggingMiddleware, errorLogger } = require('./middleware/logging');
const cors = require('cors');
const shorturlsRouter = require('./routes/shorturls');
const { getAndValidateShortUrl, logClick } = require('./services/urlService');
const errorHandler = require('./middleware/errorHandler');
const externalAuthRouter = require('./routes/externalAuth');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(loggingMiddleware);
app.use(cors());

// Placeholder root route
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener Microservice Running' });
});

// Placeholder for /shorturls route
app.use('/shorturls', shorturlsRouter);
app.use('/api', externalAuthRouter);

// Redirection endpoint
app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const result = getAndValidateShortUrl(shortcode);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  logClick(shortcode, req);
  res.redirect(result.data.url);
});

// Error logging middleware (should be after all routes)
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  // No console.log per requirements
  // Log to file if needed via loggingMiddleware
});

module.exports = app; 