const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs.txt');

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

const loggingMiddleware = (req, res, next) => {
  const { method, url, ip } = req;
  logToFile(`REQUEST: ${method} ${url} from ${ip}`);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logToFile(`RESPONSE: ${method} ${url} ${res.statusCode} (${duration}ms)`);
  });

  next();
};

// Error logging middleware (to be used after all routes)
function errorLogger(err, req, res, next) {
  logToFile(`ERROR: ${req.method} ${req.url} - ${err.message}`);
  next(err);
}

module.exports = {
  loggingMiddleware,
  errorLogger,
}; 