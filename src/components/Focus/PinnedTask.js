import React from 'react';
import './styles/PinnedTask.scss';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function PinnedTask({ paperCol }) {
	const pinTask = useSelector((state) => state.task.favoriteTask);

	return (
		<Accordion className='pinned-container' style={paperCol}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
				<FontAwesomeIcon icon={faThumbtack} className='pinned-icon' />
				<Typography variant='h6'>Pinned Task </Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography variant='h6' className='pinned-task'>
					{pinTask}
				</Typography>
			</AccordionDetails>
		</Accordion>
	);
}

export default PinnedTask;
