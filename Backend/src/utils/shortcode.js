function generateShortcode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidShortcode(code) {
  return /^[A-Za-z0-9]{4,16}$/.test(code);
}

module.exports = { generateShortcode, isValidShortcode }; 