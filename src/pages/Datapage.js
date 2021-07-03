import React from 'react';
import './styles/DataPage.scss';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import DataDropdown from '../components/Focus/DataDropdown';

function Datapage() {
	// Study Data
	const session_times = useSelector((state) => state.studyData.session_times);

	// Timer Data
	const timerData = {
		taskList: useSelector((state) => state.task.taskList),
		doneTasks: useSelector((state) => state.task.doneTasks),
	};

	return (
		<Grid container justify='center' alignItems='flex-start' className='data-container'>
			<Grid item xs={12}>
				<Typography variant='h2' className='title'>
					Your Data
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<DataDropdown session_times={session_times} />
			</Grid>
		</Grid>
	);
}

export default Datapage;
