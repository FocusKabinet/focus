import React, { useState, useEffect } from 'react';
import './styles/Timer.scss';
import timerAlarm from '../../assets/audio/timer_alarm.mp3';
import { convertMilli } from './helpers/convertMilli';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Howl } from 'howler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUndoAlt,
	faTasks,
	faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { StudyActionCreators } from '../../redux/actions/studyData';
import DataPopup from './DataPopup';
import LeavePrompt from './Prompt';
import { Prompt, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Timer({ changeBackground, inSession, setInSession }) {
	const dispatch = useDispatch();

	const studyTime = useSelector((state) => state.timer.study);
	const deepStudy = useSelector((state) => state.timer.deep_study);

	const sound = new Howl({
		src: [timerAlarm],
	});

	const [studyStart, setStudyStart] = useState({
		hours: -1,
		minutes: 0,
		seconds: 0,
	});
	const [time, setTime] = useState(convertMilli(studyTime));
	const [heldTime, setHeldTime] = useState(0);
	const [backgroundColor, setBackground] = useState({
		backgroundColor: '#75a27c',
	});
	const [breakTime, setBreakTime] = useState({
		break: 1,
		short: convertMilli(5),
		long: convertMilli(10),
	});
	const [timerOn, setTimerOn] = useState(false);
	const [openData, setOpenData] = React.useState(false);
	const [openTask, setOpenTask] = React.useState(false);
	const [session, setSession] = React.useState({
		started: false,
		start: 0,
		end: 0,
		currentTime: 0,
	});

	const [showExitPrompt, setShowExitPrompt] = LeavePrompt(false);

	useEffect(() => {
		let interval = null;

		if (timerOn || session.started) {
			interval = setInterval(() => {
				if (timerOn) {
					setTime((prevTime) => {
						if (
							Math.floor((prevTime / 60000) % 60) <= 0 &&
							Math.floor((prevTime / 1000) % 60) <= 0
						) {
							let timerSound = sound.play();
							sound.fade(0, 0.1, 5000, timerSound);
							resetTime();
						} else {
							return prevTime - 1000;
						}
					});
				}
			}, 1000);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerOn]);

	useEffect(() => {
		if (inSession === 3 && timerOn) {
			setTimerOn(false);
		}
		let interval = null;
		if (session.started) {
			interval = setInterval(() => {
				if (deepStudy && inSession === 1) {
					setSession((prevTime) => {
						return {
							...session,
							currentTime: prevTime.currentTime + 1000,
						};
					});
				}
			}, 1000);
		} else {
			alert('problem');
		}
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerOn, inSession]);

	useEffect(() => {
		return () => {
			if (inSession === 1) setShowExitPrompt(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (inSession === 0 && session.start) {
			let d = new Date();
			dispatch(
				StudyActionCreators.addSession({
					start: session.start,
					end: d,
				})
			);
			setSession({
				started: false,
				start: 0,
				end: 0,
				currentTime: 0,
			});
			resetTime();
			alert('session done');
		} else if (inSession === 0) {
			alert('not in session');
		} else if (inSession === 1) {
			alert('in session but not ended');
		} else {
			alert('problem');
		}
	}, [inSession]);

	const handleOpen = () => {
		setOpenData(true);
	};

	const handleClose = () => {
		setOpenData(false);
	};

	const startBreak = (bool) => {
		if (breakTime.break === 1 && studyStart.hours !== -1 && deepStudy) {
			dispatch(
				StudyActionCreators.addStudy({
					start: studyStart,
					end: {
						hours: convertMilli(time, 'hour'),
						minutes: convertMilli(time, 'min'),
						seconds: convertMilli(time, 'sec'),
					},
				})
			);
		}
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
			timerBreak(convertMilli(studyTime), 1);
		}
	};

	const resetTime = () => {
		setTimerOn(false);
		if (breakTime.break === 1) {
			if (
				studyStart.hours !== -1 &&
				time !== convertMilli(studyTime) &&
				deepStudy
			) {
				dispatch(
					StudyActionCreators.addStudy({
						start: studyStart,
						end: {
							hours: convertMilli(time, 'hour'),
							minutes: convertMilli(time, 'min'),
							seconds: convertMilli(time, 'sec'),
						},
					})
				);
			}
			setTime(convertMilli(studyTime));
		} else if (breakTime.break === 2) {
			setTime(breakTime.short);
		} else if (breakTime.break === 3) {
			setTime(breakTime.long);
		} else {
			setTime(convertMilli(studyTime));
		}
	};

	const timerBreak = (t, b) => {
		setTimerOn(false);
		setTime(t);
		setBreakTime({ ...breakTime, break: b });
	};

	const setColor = (pageCol, timerCol) => {
		changeBackground(pageCol);
		setBackground({
			backgroundColor: timerCol,
			transition: 'all .8s ease',
			WebkitTransition: 'all .8s ease',
			MozTransition: 'all .8s ease',
		});
	};

	const toggleTimer = () => {
		if (!session.started && deepStudy) {
			let d = new Date();
			setSession({
				...session,
				started: true,
				start: d,
				currentTime: 0,
			});
		}
		if (timerOn) {
			if (breakTime.break === 1 && studyStart.hours !== -1 && deepStudy) {
				dispatch(
					StudyActionCreators.addStudy({
						start: studyStart,
						end: {
							hours: convertMilli(time, 'hour'),
							minutes: convertMilli(time, 'min'),
							seconds: convertMilli(time, 'sec'),
						},
					})
				);
			}
			setTimerOn(false);
		} else {
			if (breakTime.break === 1) {
				setStudyStart({
					hours: convertMilli(time, 'hour'),
					minutes: convertMilli(time, 'min'),
					seconds: convertMilli(time, 'sec'),
				});
			}
			setInSession(1);
			setTimerOn(true);
		}
		if (deepStudy) setShowExitPrompt(true);
	};

	return (
		<Paper elevation={3} className='timer-container' style={backgroundColor}>
			<Grid container justify='center' alignItems='center'>
				<Grid item container justify='center' alignItems='center' xs={12}>
					<Grid item container justify='space-around'>
						<Button
							onClick={() => startTimer()}
							className='timer-buttons'
							disabled={breakTime.break === 1}
						>
							Timer
						</Button>
						<Button
							onClick={() => startBreak(false)}
							className='timer-buttons'
							disabled={breakTime.break === 3}
						>
							Long Break
						</Button>
						<Button
							onClick={() => startBreak(true)}
							className='timer-buttons'
							disabled={breakTime.break === 2}
						>
							Short Break
						</Button>
					</Grid>
					<Typography variant='h1' className='timer'>
						<Grid item container justify='center' alignItems='center'>
							<span>
								{(time / (1000 * 60 * 60)) % 24 > 0.9 &&
									('0' + Math.floor((time / (1000 * 60 * 60)) % 24)).slice(-2) +
										':'}
							</span>
							<span>
								{(time / 60000) % 60 > 0.9 &&
									('0' + Math.floor((time / 60000) % 60)).slice(-2) + ':'}
							</span>
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
						<Grid item container justify='center' xs={4}>
							{deepStudy && (
								<Button
									size='medium'
									style={
										breakTime.break === 3
											? { color: '#fff' }
											: { color: '#000' }
									}
								>
									<FontAwesomeIcon icon={faTasks} className='act-icons' /> Tasks
								</Button>
							)}
						</Grid>
						<Button
							onClick={toggleTimer}
							className={timerOn ? 'stop-button' : 'start-button'}
						>
							{timerOn ? <>Stop</> : <>Start</>}
						</Button>
						<Grid item container justify='center' xs={4}>
							{deepStudy && (
								<Button
									size='medium'
									onClick={handleOpen}
									style={
										breakTime.break === 3
											? { color: '#fff' }
											: { color: '#000' }
									}
								>
									<FontAwesomeIcon
										icon={faHourglassHalf}
										className='act-icons '
									/>
									Data
								</Button>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{deepStudy && (
				<>
					<DataPopup
						session={session}
						open={openData}
						handleClose={handleClose}
					/>
					{inSession > 0 && (
						<Prompt
							when={session.started}
							message='Leaving will end the session.'
						/>
					)}
				</>
			)}
		</Paper>
	);
}

export default Timer;
