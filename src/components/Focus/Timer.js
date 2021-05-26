import React, { useState, useEffect } from 'react';
import './styles/Timer.scss';
import timerAlarm from '../../assets/audio/timer_alarm.mp3';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Howl } from 'howler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUndoAlt,
	faTasks,
	faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

function Timer({ visible, setVisible, ...props }) {
	const sound = new Howl({
		src: [timerAlarm],
	});

	const [time, setTime] = useState(minToMilli(24));
	const [heldTime, setHeldTime] = useState(0);
	const [backgroundColor, setBackground] = useState({
		backgroundColor: '#75a27c',
	});
	const [buttonColor, setButtonCol] = useState({
		color: '#5dc245',
		border: '2px solid #5dc245',
	});
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
				setTime((prevTime) => {
					if (
						Math.floor((prevTime / 60000) % 60) <= 0 &&
						Math.floor((prevTime / 1000) % 60) <= 0
					) {
						let timerSound = sound.play();
						sound.fade(0, 1, 5000, timerSound);
						resetTime();
					} else {
						return prevTime - 10;
					}
				});
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
			setColor('#437ea8', '#3597d6');
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			timerBreak(breakTime.short, 2);
		} else {
			setColor('#52307c', '#3c1361');
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			timerBreak(breakTime.long, 3);
		}
	};

	const startTimer = () => {
		setColor('#8abd91', '#75a27c');
		setTimerOn(false);
		if (breakTime.break === 1) {
			alert('choose timer');
		} else if (breakTime.break === 2) {
			timerBreak(heldTime, 1);
		} else if (breakTime.break === 3) {
			timerBreak(heldTime, 1);
		} else {
			timerBreak(minToMilli(24), 1);
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

	const timerBreak = (t, b) => {
		setTimerOn(false);
		setTime(t);
		setBreakTime({ ...breakTime, break: b });
	};

	const setColor = (pageCol, timerCol) => {
		props.changePageBackground(pageCol);
		setBackground({
			backgroundColor: timerCol,
			transition: 'all .8s ease',
			WebkitTransition: 'all .8s ease',
			MozTransition: 'all .8s ease',
		});
	};

	return (
		<Paper elevation={3} className='timer-container' style={backgroundColor}>
			<Grid container justify='center' alignItems='center'>
				<Grid item container justify='center' alignItems='center' xs={12}>
					<Grid item container justify='space-around'>
						<Button onClick={() => startTimer()} className='timer-buttons'>
							Timer
						</Button>
						<Button onClick={() => startBreak(false)} className='timer-buttons'>
							Long Break
						</Button>
						<Button onClick={() => startBreak(true)} className='timer-buttons'>
							Short Break
						</Button>
					</Grid>
					<Typography variant='h1' className='timer'>
						<Grid item container justify='center' alignItems='center'>
							<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
							<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
							{/* :<span>{('0' + Math.floor(((time  / 10) % 100)).slice(-2)}</span> */}
							<FontAwesomeIcon
								icon={faUndoAlt}
								className='icons'
								onClick={() => resetTime()}
							/>
						</Grid>
					</Typography>
					<Grid item container justify='space-between'>
						<Button size='medium'>
							<Typography variant='subtitle1'>
								<FontAwesomeIcon icon={faTasks} className='act-icons' /> Tasks
							</Typography>
						</Button>
						<Button
							onClick={() => {
								if (timerOn) {
									setTimerOn(false);
								} else {
									setTimerOn(true);
								}
							}}
							className={timerOn ? 'stop-button' : 'start-button'}
						>
							{timerOn ? <>Stop</> : <>Start</>}
						</Button>
						<Button
							// variant='contained'
							size='medium'
							onClick={() => setVisible(!visible)}
						>
							<FontAwesomeIcon icon={faHourglassHalf} className='act-icons ' />
							Data
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default Timer;
