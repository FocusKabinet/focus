import React from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import './styles/KabinetDashboard.scss';

function KabinetDashboard() {
  return (
    <div>
      <Grid container className="grid-container">
        <Grid item className="grid-item">
          <Button className="add-button" variant="contained" color="primary">
            Add new idea
          </Button>
        </Grid>
        <Grid item>
          <TextField
            className="search-field"
            label="Search"
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default KabinetDashboard;
