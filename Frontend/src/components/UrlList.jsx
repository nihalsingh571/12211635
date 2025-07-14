import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function UrlList({ results }) {
  if (!results.length) return null;
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Original URL</TableCell>
            <TableCell>Short URL</TableCell>
            <TableCell>Expiry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Typography variant="body2" noWrap maxWidth={200}>{row.url}</Typography>
              </TableCell>
              <TableCell>
                <a href={row.shortLink} target="_blank" rel="noopener noreferrer">{row.shortLink}</a>
              </TableCell>
              <TableCell>{new Date(row.expiry).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UrlList; 