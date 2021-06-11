import React, { useState } from 'react';
import './styles/Focus.scss';
import Timer from '../components/Focus/Timer';
import PinnedTask from '../components/Focus/PinnedTask';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { TimerActionCreators } from '../redux/actions/timer';
import { StudyActionCreators } from '../redux/actions/studyData';
import { TaskActionCreators } from '../redux/actions/task';

function Focus({ handleLogout }) {
	const dispatch = useDispatch();

	const deepStudy = useSelector((state) => state.timer.deep_study);
	const pinTask = useSelector((state) => state.task.favoriteTask);

	const [background, setBackground] = useState({ background: '' });
	const [paperCol, setPaperCol] = useState({ backgroundColor: '#498551' });
	const [inSession, setInSession] = useState(0);
	const changeBackground = (color, paperColor) => {
		setPaperCol(paperColor);
		setBackground({ background: `linear-gradient( ${color[0]} 0% ,${color[1]} 74%)` });
	};
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
			className='page-container'
			style={background}
		>
			<Grid item xs={10}>
				<Typography variant='h2'>Timer</Typography>
			</Grid>
			<Grid item xs={2}>
				{deepStudy && inSession === 1 && (
					<Button onClick={() => setInSession(2)} className='timer-buttons'>
						End Session
					</Button>
				)}
			</Grid>

			<Grid
				item
				xs={12}
				container
				justify='center'
				alignItems='center'
				direction='column'
				sapcing={3}
			>
				<Grid item xs={6}>
					<Timer
						changeBackground={changeBackground}
						inSession={inSession}
						setInSession={setInSession}
					/>
				</Grid>
				{deepStudy && pinTask !== '' && (
					<Grid item xs={6} className='pinned-grid'>
						<PinnedTask paperCol={paperCol} inSession={inSession} />
					</Grid>
				)}
			</Grid>
			<button onClick={clearAll}>Clear</button>
		</Grid>
	);
}

export default Focus;
