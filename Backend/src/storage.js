// In-memory storage for URLs and analytics
// Structure: { shortcode: { url, createdAt, expiry, clicks: [], ... } }
const urlStore = new Map();

function addShortUrl(shortcode, data) {
  urlStore.set(shortcode, { ...data, clicks: [] });
}

function getShortUrl(shortcode) {
  return urlStore.get(shortcode);
}

function updateShortUrl(shortcode, data) {
  if (urlStore.has(shortcode)) {
    urlStore.set(shortcode, { ...urlStore.get(shortcode), ...data });
  }
}

function addClick(shortcode, clickData) {
  if (urlStore.has(shortcode)) {
    urlStore.get(shortcode).clicks.push(clickData);
  }
}

function shortcodeExists(shortcode) {
  return urlStore.has(shortcode);
}

function getAllShortUrls() {
  return Array.from(urlStore.entries()).map(([shortcode, data]) => ({ shortcode, ...data }));
}

module.exports = {
  addShortUrl,
  getShortUrl,
  updateShortUrl,
  addClick,
  shortcodeExists,
  getAllShortUrls,
}; 