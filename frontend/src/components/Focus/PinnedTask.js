import React, { useState } from 'react';
import './styles/PinnedTask.scss';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PinnedTask({ paperCol }) {
	const pinTask = useSelector((state) => state.task.favoriteTask);

	return (
		<Paper elevation={1} className='pinned-container' style={paperCol}>
			<Typography variant='h6'>
				<FontAwesomeIcon icon={faStar} className='pinned-icon' />
				{pinTask}
			</Typography>
		</Paper>
	);
}

export default PinnedTask;
