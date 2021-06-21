import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import './styles/DataDropdown.scss';
import { Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

function DataDropdown({ session_times }) {
	const [checked, setChecked] = useState(new Array(session_times.length).fill(false));
	const [numChecked, setNumChecked] = useState(0);

	const getDate = (sessionDate, sessionStartTime, sessionEndTime) => {
		let date = new Date(sessionDate.year, sessionDate.month, sessionDate.day, sessionStartTime.hours, sessionStartTime.minutes, sessionStartTime.seconds);
		return `${date.toDateString()}`;
	};

	useEffect(() => {
		let tempArr = checked.filter((check) => {
			return check === true;
		})
		setNumChecked(tempArr.length);
	}, [checked])

	const handleToggleAll = () => {
		if (numChecked === session_times.length) {
			setChecked(new Array(checked.length).fill(false));
		} else {
			setChecked(new Array(checked.length).fill(true));
		}
	};

	const handleChange = (value) => {
		let tempArr = checked.map((check,id) =>
							value === id? !check:check
						);
		setChecked(tempArr)
	};

	const present = () => {
		console.log(checked);
		console.log(numChecked);
	};

	return (
		<div className='data-dropdown-container'>
			<button onClick={present}>present</button>
			<CardHeader
				avatar={
					<Checkbox
						onClick={handleToggleAll}
						checked={numChecked === session_times.length}
						disabled={session_times && session_times.length === 0}
						inputProps={{ 'aria-label': 'all items selected' }}
					/>
				}
				title='Saved Sessions Selected'
				subheader={`${numChecked}/${session_times.length} selected`}
			/>
			<Divider />
			{session_times.map((session, id) => {
				return (
					<Accordion key={id}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-actions1-content' id='additional-actions1-header'>
							<FormControlLabel
								aria-label='Acknowledge'
								onClick={(event) => {
									event.stopPropagation();
								}}
								onFocus={(event) => event.stopPropagation()}
								control={<Checkbox checked={checked[id] && checked[id]} onClick={()=>handleChange(id)} type='checkbox' label={id} value={id} />}
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
							<Chart label='Study Data' data={session} />
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
}

export default DataDropdown;
