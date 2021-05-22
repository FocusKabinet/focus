import React, { useState, useEffect } from 'react';
import '.././styles/Timer.scss';
import { Button, Grid, Paper, Typography } from '@material-ui/core';

function Timer() {
	const [time, setTime] = useState(minToMilli(24));
	const [timerOn, setTimerOn] = useState(false);

	useEffect(() => {
		let interval = null;

		if (timerOn) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime - 10);
			}, 10);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [timerOn]);

	function minToMilli(min) {
		return min * 60000;
	}

	return (
		<Paper elevation={3} className='timer-container'>
			<Grid container justify='center' alignItems='center'>
				<Grid item container justify='center' alignItems='center' xs={12}>
					<Grid item container justify='space-evenly'>
						<Button onClick={() => setTimerOn(false)}>Short Break</Button>
						<Button onClick={() => setTimerOn(true)}>Long Break </Button>
						<Button
							onClick={() => {
								setTimerOn(false);
								setTime(minToMilli(24));
							}}
						>
							Reset
						</Button>
					</Grid>
					<h1>
						<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
						<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>:
						<span>{('0' + Math.floor((time / 10) % 100)).slice(-2)}</span>
					</h1>
					<Grid item container justify='space-evenly'>
						{timerOn ? (
							<Button onClick={() => setTimerOn(false)}>Stop</Button>
						) : (
							<Button onClick={() => setTimerOn(true)}>Start</Button>
						)}
						<Button
							onClick={() => {
								setTimerOn(false);
								setTime(minToMilli(24));
							}}
						>
							Reset
						</Button>
					</Grid>
				</Grid>
				<Grid item xs={12}></Grid>
			</Grid>
		</Paper>
	);
}

export default Timer;
