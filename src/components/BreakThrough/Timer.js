import React, { useState, useEffect } from 'react';
import '.././styles/Timer.scss';
import { Button, Grid, Paper } from '@material-ui/core';

function Timer() {
	const [time, setTime] = useState(minToMilli(24));
	const [heldTime, setHeldTime] = useState(0);
	const [breakTime, setBreakTime] = useState({
		break: 1,
		short: minToMilli(5),
		long: minToMilli(10),
	});
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

	const startBreak = (bool) => {
		if (bool) {
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			setTime(breakTime.short);
			setBreakTime({ ...breakTime, break: 2 });
		} else {
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			setTime(breakTime.long);
			setBreakTime({ ...breakTime, break: 3 });
		}
	};

	const startTimer = () => {
		setTimerOn(false);
		if (breakTime.break === 1) {
			alert('choose timer');
		} else if (breakTime.break === 2) {
			setTime(heldTime);
			setBreakTime({ ...breakTime, break: 1 });
		} else if (breakTime.break === 3) {
			setTime(heldTime);
			setBreakTime({ ...breakTime, break: 1 });
		} else {
			setTime(minToMilli(24));
			setBreakTime({ ...breakTime, break: 1 });
		}
	};

	const resetTime = () => {
		setTimerOn(false);
		if (breakTime.break === 1) {
			setTime(minToMilli(24));
		} else if (breakTime.break === 2) {
			setTime(breakTime.short);
		} else if (breakTime.break === 3) {
			setTime(breakTime.long);
		} else {
			setTime(minToMilli(24));
		}
	};

	return (
		<Paper elevation={3} className='timer-container'>
			<Grid container justify='center' alignItems='center'>
				<Grid item container justify='center' alignItems='center' xs={12}>
					<Grid item container justify='space-evenly'>
						<Button onClick={() => startTimer()}>Timer</Button>
						<Button onClick={() => startBreak(true)}>Short Break</Button>
						<Button onClick={() => startBreak(false)}>Long Break</Button>
					</Grid>
					<h1>
						<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
						<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
						{/* :<span>{('0' + Math.floor(((time  / 10) % 100)).slice(-2)}</span> */}
					</h1>
					<Grid item container justify='space-evenly'>
						{timerOn ? (
							<Button onClick={() => setTimerOn(false)}>Stop</Button>
						) : (
							<Button onClick={() => setTimerOn(true)}>Start</Button>
						)}
						<Button onClick={() => resetTime()}>Reset</Button>
					</Grid>
				</Grid>
				<Grid item xs={12}></Grid>
			</Grid>
		</Paper>
	);
}

export default Timer;
