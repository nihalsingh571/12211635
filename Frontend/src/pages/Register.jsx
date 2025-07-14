import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function Register() {
  const [form, setForm] = useState({
    email: '', name: '', mobileNo: '', githubUsername: '', rollNo: '', accessCode: '', clientID: '', clientSecret: ''
  });
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const creds = JSON.parse(localStorage.getItem('externalCreds') || '{}');
    setForm(f => ({ ...f, ...creds }));
    setToken(creds.access_token || '');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/register`, form);
      setMessage('Registered! Save your clientID and clientSecret.');
      localStorage.setItem('externalCreds', JSON.stringify({ ...form, ...res.data }));
      setForm(f => ({ ...f, ...res.data }));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleAuth = async () => {
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/auth`, form);
      setMessage('Authenticated!');
      localStorage.setItem('externalCreds', JSON.stringify({ ...form, ...res.data }));
      setToken(res.data.access_token);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>External API Registration & Auth</Typography>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Mobile No" name="mobileNo" value={form.mobileNo} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="GitHub Username" name="githubUsername" value={form.githubUsername} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Access Code" name="accessCode" value={form.accessCode} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" onClick={handleRegister} sx={{ mr: 2 }}>Register</Button>
        <TextField label="Client ID" name="clientID" value={form.clientID} onChange={handleChange} fullWidth sx={{ my: 2 }} />
        <TextField label="Client Secret" name="clientSecret" value={form.clientSecret} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="secondary" onClick={handleAuth}>Authenticate</Button>
        {token && <Typography sx={{ mt: 2 }}>Access Token: <span style={{ wordBreak: 'break-all' }}>{token}</span></Typography>}
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Box>
  );
}

export default Register; 