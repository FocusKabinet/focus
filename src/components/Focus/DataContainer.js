import React from 'react';
import './styles/DataContainer.scss';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Checkbox, ListItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function DataContainer({ sessionInfo }) {
	const showData = (attr, title, parent, arrBool) => {
		let tempTitle = title.charAt(0).toUpperCase() + title.slice(1);
		tempTitle = tempTitle.split(/(?=[A-Z])/).join(' ');

		if (parent[attr] && attr !== 'tasks') {
			if (!arrBool && parent[attr] > 0) {
				return (
					<Typography variant='h6' gutterBottom>
						{tempTitle + ': ' + parent[attr]}
					</Typography>
				);
			} else if (arrBool && parent[attr].length > 0) {
				return (
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-actions1-content' id='additional-actions1-header'>
							{tempTitle}:
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant='h6' gutterBottom>
								<ul>
									{parent[attr].map((time, id) => (
										<li key={id}>
											{('0' + time.start.hours).slice(-2)}:{('0' + time.start.minutes).slice(-2)}:{('0' + time.start.seconds).slice(-2)} - {('0' + time.end.hours).slice(-2)}:
											{('0' + time.end.minutes).slice(-2)}:{('0' + time.end.seconds).slice(-2)}, <strong>Time Spent:</strong> {('0' + time.timeSpent.hour).slice(-2)}:
											{('0' + time.timeSpent.min).slice(-2)}:{('0' + time.timeSpent.sec).slice(-2)}
										</li>
									))}
								</ul>
							</Typography>
						</AccordionDetails>
					</Accordion>
				);
			} else {
				return null;
			}
		} else if (attr === 'tasks') {
			return (
				<>
					{Object.keys(parent[attr]).map(function (keyName, keyIndex) {
						if (parent[attr][keyName].length > 0 && keyName !== 'favoriteTask') {
							let taskTitle = keyName.charAt(0).toUpperCase() + keyName.slice(1);
							taskTitle = taskTitle.split(/(?=[A-Z])/).join(' ');
							return (
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-actions1-content' id='additional-actions1-header'>
										Your {taskTitle} this Session:
									</AccordionSummary>
									<AccordionDetails>
										<Typography variant='h6' gutterBottom>
											<ul className='task-list'>
												{parent[attr][keyName].map((task, id) => (
													<li key={id}>
														<div>
															<strong>Task: </strong>
															{task.task}
														</div>
														<div>
															<strong>Time Started: </strong>
															{('0' + task.time.hours).slice(-2)}:{('0' + task.time.minutes).slice(-2)}:{('0' + task.time.seconds).slice(-2)}
														</div>
														{task.timeFinished && (
															<div>
																<strong>Time Finished: </strong>
																{('0' + task.timeFinished.hours).slice(-2)}:{('0' + task.timeFinished.minutes).slice(-2)}:{('0' + task.timeFinished.seconds).slice(-2)}
															</div>
														)}
														{task.timeReopened && (
															<div>
																<strong>Time Reopened: </strong>
																{('0' + task.timeReopened.hours).slice(-2)}:{('0' + task.timeReopened.minutes).slice(-2)}:{('0' + task.timeReopened.seconds).slice(-2)}
															</div>
														)}
													</li>
												))}
											</ul>
										</Typography>
									</AccordionDetails>
								</Accordion>
								// <Typography key={keyIndex} variant='h6' gutterBottom>
								// 	Your {taskTitle} this Session:
								// <ul className='task-list'>
								// 	{parent[attr][keyName].map((task, id) => (
								// 		<li key={id}>
								// 			<div>
								// 				<strong>Task: </strong>
								// 				{task.task}
								// 			</div>
								// 			<div>
								// 				<strong>Time Started: </strong>
								// 				{('0' + task.time.hours).slice(-2)}:{('0' + task.time.minutes).slice(-2)}:{('0' + task.time.seconds).slice(-2)}
								// 			</div>
								// 			{task.timeFinished && (
								// 				<div>
								// 					<strong>Time Finished: </strong>
								// 					{('0' + task.timeFinished.hours).slice(-2)}:{('0' + task.timeFinished.minutes).slice(-2)}:{('0' + task.timeFinished.seconds).slice(-2)}
								// 				</div>
								// 			)}
								// 			{task.timeReopened && (
								// 				<div>
								// 					<strong>Time Reopened: </strong>
								// 					{('0' + task.timeReopened.hours).slice(-2)}:{('0' + task.timeReopened.minutes).slice(-2)}:{('0' + task.timeReopened.seconds).slice(-2)}
								// 				</div>
								// 			)}
								// 		</li>
								// 	))}
								// </ul>
								// </Typography>
							);
						}
					})}
				</>
			);
		} else {
			return null;
		}
	};
	return (
		<Grid container className='dataContainer'>
			<Grid item>
				<Typography variant='h4' gutterBottom>
					Your Data
				</Typography>
			</Grid>
			<Grid item>
				{Object.keys(sessionInfo).map(function (keyName, keyIndex) {
					return <span key={keyIndex}>{showData(keyName, keyName, sessionInfo, Array.isArray(sessionInfo[keyName]))}</span>;
				})}
			</Grid>
		</Grid>
	);
}

export default DataContainer;
