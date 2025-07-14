import React from 'react';
import { Grid, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function UrlForm({ idx, data, onChange, onRemove, canRemove }) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          label="Long URL"
          fullWidth
          required
          value={data.url}
          onChange={e => onChange(idx, 'url', e.target.value)}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Validity (min)"
          type="number"
          fullWidth
          value={data.validity}
          onChange={e => onChange(idx, 'validity', e.target.value)}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Custom Shortcode"
          fullWidth
          value={data.shortcode}
          onChange={e => onChange(idx, 'shortcode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        {canRemove && (
          <IconButton color="error" onClick={() => onRemove(idx)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}

export default UrlForm; 