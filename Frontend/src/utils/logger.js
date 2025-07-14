function log(type, endpoint, data) {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({
    timestamp: new Date().toISOString(),
    type,
    endpoint,
    data,
  });
  localStorage.setItem('logs', JSON.stringify(logs));
}

const logger = { log };
export default logger; 