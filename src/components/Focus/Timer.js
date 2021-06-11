import React, { useState, useEffect } from 'react';
import './styles/Timer.scss';
import timerAlarm from '../../assets/audio/timer_alarm.mp3';
import { convertMilli } from './helpers/convertMilli';
import { timeCalc } from './helpers/timeCalc';
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
import TaskPopup from './TaskPopup';
import LeavePrompt from './Prompt';
import { Prompt } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Timer({ changeBackground, inSession, setInSession }) {
	const dispatch = useDispatch();

	const studyTime = useSelector((state) => state.timer.study);
	const shortBreak = useSelector((state) => state.timer.short);
	const longBreak = useSelector((state) => state.timer.long);
	const deepStudy = useSelector((state) => state.timer.deep_study);

	const sound = new Howl({
		src: [timerAlarm],
	});

	const [sessionInfo, setSessionInfo] = useState({
		studies: 0,
		studyTimes: [],
		shortBreaks: 0,
		longBreaks: 0,
		shortBreakTimes: [],
		longBreakTimes: [],
	});

	const [studyStart, setStudyStart] = useState({
		hours: -1,
		minutes: 0,
		seconds: 0,
	});
	const [time, setTime] = useState(convertMilli(studyTime));
	const [heldTime, setHeldTime] = useState(0);
	const [backgroundColor, setBackground] = useState({
		backgroundColor: '#498551',
	});
	const [breakTime, setBreakTime] = useState({
		break: 1,
		short: convertMilli(shortBreak),
		long: convertMilli(longBreak),
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
		if (inSession === 2 && timerOn) {
			setTimerOn(false);
			resetTime();
			timerBreak(convertMilli(studyTime), 1);
			setColor(['#407447','#a0c0ae'], '#498551');
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
		if (inSession === 0) {
			alert('not in session');
		} else if (inSession === 1) {
			alert('Session Started');
		} else if (inSession === 2) {
			alert('Session Ended');
			let d = new Date();
			dispatch(
				StudyActionCreators.addSession({
					start: session.start,
					end: {
						date: {
							day: d.getDate(),
							month: d.getMonth() + 1,
							year: d.getFullYear(),
						},
						time: {
							hours: d.getHours(),
							minutes: d.getMinutes(),
							seconds: d.getSeconds(),
						},
					},
					sessionInfo: sessionInfo,
				})
			);
			setSession((prevTime) => {
				return {
					...session,
					currentTime: 0,
					started: false,
				};
			});
		} else {
			alert('problem: ' + inSession + '.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inSession]);

	// working
	const handleOpen = (target) => {
		if (target === 'task') {
			setOpenTask(true);
		} else {
			setOpenData(true);
		}
	};

	const handleCloseTask = () => {
		setOpenTask(false);
	};

	const handleCloseData = () => {
		setOpenData(false);
	};

	const startBreak = (bool) => {
		if (breakTime.break === 1 && studyStart.hours !== -1 && deepStudy) {
			let d = new Date();
			let endTime = {
				hours: d.getHours(),
				minutes: d.getMinutes(),
				seconds: d.getSeconds(),
			};
			let addedStudy = {
				start: studyStart,
				end: endTime,
				timeSpent: timeCalc(
					studyStart.hours,
					studyStart.minutes,
					studyStart.seconds,
					endTime.hours,
					endTime.minutes,
					endTime.seconds,
					'add'
				),
			};
			dispatch(StudyActionCreators.addStudy(addedStudy));
			setSessionInfo((prev) => {
				return {
					...sessionInfo,
					studies: prev.studies + 1,
					studyTimes: [...prev.studyTimes, addedStudy],
				};
			});
		}
		if (bool) {
			setColor(['#437ea8','#b1cce0'], '#5599c5');
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			timerBreak(breakTime.short, 2);
		} else {
			setColor(['#52307c','#eee1ff'], '#763ea8');
			if (breakTime.break === 1) {
				setHeldTime(time);
			}
			timerBreak(breakTime.long, 3);
		}
	};

	const startTimer = () => {
		setColor(['#5c8762','#a0c0ae'], '#498551');
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
				let d = new Date();
				let endTime = {
					hours: d.getHours(),
					minutes: d.getMinutes(),
					seconds: d.getSeconds(),
				};
				let addedStudy = {
					start: studyStart,
					end: endTime,
					timeSpent: timeCalc(
						studyStart.hours,
						studyStart.minutes,
						studyStart.seconds,
						endTime.hours,
						endTime.minutes,
						endTime.seconds,
						'add'
					),
				};
				dispatch(StudyActionCreators.addStudy(addedStudy));
				setSessionInfo((prev) => {
					return {
						...sessionInfo,
						studies: prev.studies + 1,
						studyTimes: [...prev.studyTimes, addedStudy],
					};
				});
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
		changeBackground(pageCol, {
			backgroundColor: timerCol,
			transition: 'all .8s ease',
			WebkitTransition: 'all .8s ease',
			MozTransition: 'all .8s ease',
		});
		setBackground({
			backgroundColor: timerCol,
			transition: 'all .8s ease',
			WebkitTransition: 'all .8s ease',
			MozTransition: 'all .8s ease',
		});
	};

	const toggleTimer = () => {
		let d = new Date();
		if (!session.started && deepStudy) {
			setSession({
				...session,
				started: true,
				start: {
					date: {
						day: d.getDate(),
						month: d.getMonth() + 1,
						year: d.getFullYear(),
					},
					time: {
						hours: d.getHours(),
						minutes: d.getMinutes(),
						seconds: d.getSeconds(),
					},
				},
				currentTime: 0,
			});
		}
		if (timerOn) {
			if (breakTime.break === 1 && studyStart.hours !== -1 && deepStudy) {
				let d = new Date();
				let endTime = {
					hours: d.getHours(),
					minutes: d.getMinutes(),
					seconds: d.getSeconds(),
				};
				let addedStudy = {
					start: studyStart,
					end: endTime,
					timeSpent: timeCalc(
						studyStart.hours,
						studyStart.minutes,
						studyStart.seconds,
						endTime.hours,
						endTime.minutes,
						endTime.seconds,
						'add'
					),
				};
				dispatch(StudyActionCreators.addStudy(addedStudy));
				setSessionInfo((prev) => {
					return {
						...sessionInfo,
						studies: prev.studies + 1,
						studyTimes: [...prev.studyTimes, addedStudy],
					};
				});
			}

			setTimerOn(false);
		} else {
			let d = new Date();
			let timeObj = {
				hours: d.getHours(),
				minutes: d.getMinutes(),
				seconds: d.getSeconds(),
			};
			if (breakTime.break === 1) {
				setStudyStart(timeObj);
			} else if (breakTime.break === 2 && time === convertMilli(shortBreak)) {
				dispatch(
					StudyActionCreators.addSBreak({
						time: timeObj,
					})
				);
				setSessionInfo((prev) => {
					return {
						...sessionInfo,
						shortBreaks: prev.shortBreaks + 1,
						shortBreakTimes: [...prev.shortBreakTimes, timeObj],
					};
				});
			} else if (breakTime.break === 3 && time === convertMilli(longBreak)) {
				dispatch(
					StudyActionCreators.addLBreak({
						time: timeObj,
					})
				);
				setSessionInfo((prev) => {
					return {
						...sessionInfo,
						longBreaks: prev.longBreaks + 1,
						longBreakTimes: [...prev.longBreakTimes, timeObj],
					};
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
									//working
									onClick={() => handleOpen('task')}
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
									onClick={() => handleOpen('data')}
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
					<TaskPopup
						session={session}
						open={openTask}
						handleClose={handleCloseTask}
					/>
					<DataPopup
						session={session}
						open={openData}
						handleClose={handleCloseData}
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
