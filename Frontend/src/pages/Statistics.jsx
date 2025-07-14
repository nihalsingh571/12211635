import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import { getStats } from '../api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function StatsTable({ stats }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <a href={stats.shortLink} target="_blank" rel="noopener noreferrer">{stats.shortLink}</a>
        </TableCell>
        <TableCell>{new Date(stats.createdAt).toLocaleString()}</TableCell>
        <TableCell>{new Date(stats.expiry).toLocaleString()}</TableCell>
        <TableCell>{stats.clickCount}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2">Click Details:</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.clicks.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(c.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{c.referrer || '-'}</TableCell>
                      <TableCell>{c.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Statistics() {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortened') || '[]');
    setUrls(stored);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const arr = await Promise.all(
        urls.map(async (u) => {
          try {
            const s = await getStats(u.shortLink.split('/').pop());
            return { ...u, ...s };
          } catch {
            return { ...u, error: 'Failed to fetch stats' };
          }
        })
      );
      setStats(arr);
    }
    if (urls.length) fetchStats();
  }, [urls]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Short URL Statistics</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Click Count</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((row, idx) =>
              row.error ? (
                <TableRow key={idx}>
                  <TableCell colSpan={5} style={{ color: 'red' }}>{row.error}</TableCell>
                </TableRow>
              ) : (
                <StatsTable key={idx} stats={row} />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Statistics; 