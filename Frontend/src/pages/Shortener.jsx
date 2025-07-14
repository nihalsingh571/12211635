import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { shortenUrl } from '../api';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return !code || /^[A-Za-z0-9]{4,16}$/.test(code);
}

function Shortener() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleAdd = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const handleChange = (idx, field, value) => {
    const newUrls = urls.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    setUrls(newUrls);
  };

  const handleRemove = (idx) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setResults([]);
    const newErrors = urls.map((item) => {
      if (!isValidUrl(item.url)) return 'Invalid URL';
      if (item.validity && (!Number.isInteger(Number(item.validity)) || Number(item.validity) <= 0)) return 'Validity must be a positive integer';
      if (!isValidShortcode(item.shortcode)) return 'Shortcode must be alphanumeric (4-16 chars)';
      return null;
    });
    setErrors(newErrors);
    if (newErrors.some(e => e)) return;
    const promises = urls.map(item =>
      shortenUrl({
        url: item.url,
        validity: item.validity ? Number(item.validity) : undefined,
        shortcode: item.shortcode || undefined,
      }).then(res => ({ ...res, url: item.url })).catch(err => ({ error: err.response?.data?.error || 'Error', url: item.url }))
    );
    const resArr = await Promise.all(promises);
    setResults(resArr);
    const successful = resArr.filter(r => r.shortLink);
    if (successful.length) {
      const prev = JSON.parse(localStorage.getItem('shortened') || '[]');
      localStorage.setItem('shortened', JSON.stringify([...prev, ...successful]));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {urls.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2 }}>
                <UrlForm
                  idx={idx}
                  data={item}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  canRemove={urls.length > 1}
                />
                {errors[idx] && <Typography color="error">{errors[idx]}</Typography>}
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Button variant="contained" onClick={handleAdd} disabled={urls.length >= 5} sx={{ mr: 2 }}>
            Add URL
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Shorten
          </Button>
        </Box>
      </form>
      <Box mt={4}>
        <UrlList results={results} />
      </Box>
    </Box>
  );
}

export default Shortener; 