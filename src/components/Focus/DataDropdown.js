import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import DataContainer from './DataContainer';
import { useDispatch } from 'react-redux';
import { StudyActionCreators } from '../../redux/actions/studyData';
import './styles/DataDropdown.scss';
import {
	Grid,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	AccordionActions,
	Button,
	Checkbox,
	FormControlLabel,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

function DataDropdown({ session_times }) {
	const dispatch = useDispatch();
	const isMobile = useMediaQuery({ query: `(max-width: 1000px)` });

	const [checked, setChecked] = useState(new Array(session_times.length).fill(false));
	const [expanded, setExpanded] = useState(new Array(session_times.length).fill(false));
	const [numChecked, setNumChecked] = useState(0);
	const [delPrompt, setDelPrompt] = useState(false);
	const [alert, setAlert] = useState(false);

	const getDate = (sessionDate, sessionStartTime, sessionEndTime) => {
		let date = new Date(sessionDate.year, sessionDate.month, sessionDate.day, sessionStartTime.hours, sessionStartTime.minutes, sessionStartTime.seconds);
		return `${date.toDateString()}`;
	};

	useEffect(() => {
		let tempArr = checked.filter((check) => {
			return check === true;
		});
		setNumChecked(tempArr.length);
	}, [checked]);

	useEffect(() => {
		if (delPrompt) deleteMulSession();
	}, [delPrompt]);

	const handleToggleAll = () => {
		if (numChecked === session_times.length) {
			setChecked(new Array(checked.length).fill(false));
		} else {
			setChecked(new Array(checked.length).fill(true));
		}
	};

	const handleChange = (value) => {
		let tempArr = checked.map((check, id) => (value === id ? !check : check));
		setChecked(tempArr);
	};

	const expand = (id) => {
		let tempArr = expanded.map((item, index) => {
			return index === id && !item;
		});
		setExpanded(tempArr);
	};

	function Alert(props) {
		return <MuiAlert elevation={6} variant='filled' {...props} />;
	}

	const accessAlert = (ans) => {
		if (ans) {
			setDelPrompt(true);
			setAlert(false);
		} else {
			setDelPrompt(false);
			setAlert(false);
		}
	};

	const handleWarningClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setAlert(false);
	};

	const deleteSession = (SessionId, checkId) => {
		let sesInfo = session_times[checkId].sessionInfo;
		for (var keyObj of Object.keys(sesInfo)) {
			let key = sesInfo[keyObj];
			if (keyObj == 'longBreakTimes' && key.length > 0) {
				for (let i = 0; i < key.length; i++) {
					if (key[i].SessionId === session_times[checkId].SessionId) {
						dispatch(StudyActionCreators.delLBreak(session_times[checkId].id));
					}
				}
			} else if (keyObj == 'studyTimes' && key.length > 0) {
				for (let i = 0; i < key.length; i++) {
					if (key[i].SessionId === session_times[checkId].SessionId) {
						dispatch(StudyActionCreators.delStudy(session_times[checkId].id));
					}
				}
			} else if (keyObj == 'shortBreakTimes' && key.length > 0) {
				for (let i = 0; i < key.length; i++) {
					if (key[i].SessionId === session_times[checkId].SessionId) {
						dispatch(StudyActionCreators.delSBreak(session_times[checkId].id));
					}
				}
			}
		}
		let tempArr = checked;
		tempArr.splice(checkId, 1);

		dispatch(StudyActionCreators.delSession(SessionId));
		setChecked(tempArr);
		return true;
	};

	const deleteMulSession = () => {
		let sesArr = [];
		let newCheck = [];
		if (numChecked === session_times.length) {
			setAlert(true);
			if (delPrompt) dispatch(StudyActionCreators.clearState());
		} else {
			sesArr = checked.map((check, id) => {
				if (check) {
					let SessionId = session_times[checked.indexOf(check, id)].id;
					let checkId = checked.indexOf(check, id);
					return { SessionId: SessionId, checkId: checkId };
				} else {
					newCheck.push(false);
				}
			});
			sesArr.map((ses) => {
				if (ses !== undefined) {
					const { SessionId, checkId } = ses;
					if (deleteSession(SessionId, checkId)) setChecked(new Array(newCheck.length).fill(false));
				}
			});
		}
	};

	return (
		<div className='data-dropdown-container'>
			{session_times.length > 0 ? (
				<>
					<Snackbar open={alert} autoHideDuration={2000} onClose={handleWarningClose} className='prompt'>
						<Alert
							onClose={handleWarningClose}
							action={
								<>
									<Button onClick={() => accessAlert(true)} color='inherit' size='small'>
										Yes
									</Button>
									<Button onClick={() => accessAlert(false)} color='inherit' size='small'>
										No
									</Button>
								</>
							}
							severity='error'
						>
							Are you sure you want to delete all sessions?
						</Alert>
					</Snackbar>
					<ListItem role={undefined} dense button className='header'>
						<ListItemIcon>
							<Checkbox
								onClick={handleToggleAll}
								checked={numChecked === session_times.length}
								disabled={session_times && session_times.length === 0}
								inputProps={{ 'aria-label': 'all items selected' }}
							/>
						</ListItemIcon>
						<ListItemText primaryTypographyProps={{ variant: 'subtitle1' }} primary='Saved Sessions' secondary={`${numChecked}/${session_times.length} selected`} />
						{numChecked ? (
							<>
								<IconButton color='secondary' component='span' className='add-des' style={{ color: '#FF0000' }} onClick={() => deleteMulSession()} edge='end' aria-label='delete'>
									<FontAwesomeIcon icon={faTrashAlt} />
								</IconButton>
								{/* <IconButton component='span' className='add-des' onClick={() => favorSession()} edge='end' aria-label='pin'>
									<FontAwesomeIcon icon={faThumbtack} />
								</IconButton> */}
							</>
						) : null}
					</ListItem>
					<Divider />
					{session_times.map((session, id) => {
						return (
							<Accordion key={id} className='inner-acc'>
								<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-actions1-content' id='additional-actions1-header'>
									<FormControlLabel
										aria-label='Acknowledge'
										onClick={(event) => {
											event.stopPropagation();
										}}
										onFocus={(event) => event.stopPropagation()}
										control={<Checkbox checked={checked[id] && checked[id]} onClick={() => handleChange(id)} type='checkbox' label={id} value={id} />}
										label={getDate(session.start.date, session.start.time, session.end.time)}
									/>
									<Typography className='secondary-heading'>
										{`${('0' + session.start.time.hours).slice(-2)}:${('0' + session.start.time.minutes).slice(-2)}:${('0' + session.start.time.seconds).slice(-2)} - ${(
											'0' + session.end.time.hours
										).slice(-2)}:
								${('0' + session.end.time.minutes).slice(-2)}:${('0' + session.end.time.seconds).slice(-2)}`}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container direction='row' justify='center' alignItems='flex-start'>
										<Grid item xs={expanded[id] || isMobile ? 12 : 6}>
											<Chart data={session} />
										</Grid>
										<Grid item xs={expanded[id] || isMobile ? 12 : 6}>
											<DataContainer sessionInfo={session.sessionInfo} />
										</Grid>
									</Grid>
								</AccordionDetails>
								<Divider />
								<AccordionActions>
									<Button size='large' color='primary' onClick={() => expand(id)} className='mobile-hidden'>
										<Typography variant='h6'>{expanded[id] ? 'Shrink' : 'Expand'}</Typography>
									</Button>
									<Button size='large' color='secondary' onClick={() => deleteSession(session.id, id)}>
										<Typography variant='h6'>Delete</Typography>
									</Button>
								</AccordionActions>
							</Accordion>
						);
					})}
				</>
			) : (
				<Typography varaint='h1'>Complete Some Sessions and they'll show up here!</Typography>
			)}
		</div>
	);
}

export default DataDropdown;
