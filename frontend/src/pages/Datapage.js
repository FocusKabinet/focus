import React, { useState } from 'react';
import './styles/DataPage.scss';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { TimerActionCreators } from '../redux/actions/timer';
import { StudyActionCreators } from '../redux/actions/studyData';
import { TaskActionCreators } from '../redux/actions/task';

function Datapage() {
	const dispatch = useDispatch();

	const deepStudy = useSelector((state) => state.timer.deep_study);

	const clearAll = () => {
		dispatch(TimerActionCreators.clearState());
		dispatch(StudyActionCreators.clearState());
		dispatch(TaskActionCreators.clearState());
	};

	return (
		<Grid
			container
			justify='center'
			alignItems='flex-start'
			className='data-container'
		>
			<Grid item xs={12}>
				<Typography variant='h1'>Data</Typography>
			</Grid>
			<button onClick={clearAll}>Clear</button>
		</Grid>
	);
}

export default Datapage;
