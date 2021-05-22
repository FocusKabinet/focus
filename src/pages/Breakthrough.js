import React from 'react'
import "./styles/Breakthrough.scss";
import {Grid, Typography, Button, Paper} from '@material-ui/core';

function Breakthrough({handleLogout, ...props}) {
    return (
        <div className="page-container">
            <Grid container justify="center" alignItems="center" spacing={3}>
                <Grid container direction="row" justify="flex-end" alignItems="center" item xs={12}>
                    <Grid item xs={10}>
                        <Typography variant="h1">Timer Title</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" size="large">Tasks</Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" size="large">Data</Button>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} className="timer-container">
                        s
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                </Grid>
            </Grid>
            BreakThrough
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default Breakthrough
