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
	const [ready, setReady] = useState(false); //ready to end session

	const [inSession, setInSession] = useState(0); //0: not in session, 1: in session, 2: session just ended,  3: user wants session to end
	const changeBackground = (color, paperColor) => {
		setPaperCol(paperColor);
		setBackground({
			background: `linear-gradient( ${color[0]} 0% ,${color[1]} 74%)`,
		});
	};
	const clearAll = () => {
		dispatch(TimerActionCreators.clearState());
		dispatch(StudyActionCreators.clearState());
		dispatch(TaskActionCreators.clearState());
	};

	return (
		<Grid container justify='center' alignItems='center' alignContent='center' className='page-container' style={background}>
			<Grid
				item
				xs={deepStudy && (inSession === 1 || inSession === 3) ? 8 : 12}
				sm={deepStudy && (inSession === 1 || inSession === 3) ? 9 : 12}
				md={deepStudy && (inSession === 1 || inSession === 3) ? 4 : 12}
			>
				<Typography variant='h2' style={{ textAlign: !(deepStudy && (inSession === 1 || inSession === 3)) && 'center' }}>
					Timer
				</Typography>
			</Grid>

			{deepStudy && (inSession === 1 || inSession === 3) && (
				<Grid item xs={4} sm={3} md={4} className='btn-container'>
					<Button
						onClick={() => {
							if (ready) {
								setInSession(2);
							} else {
								setInSession(3);
							}
						}}
						className='end-session'
					>
						End Session
					</Button>
				</Grid>
			)}
			<Grid item xs={12} container justify='center' alignItems='center' direction='column' sapcing={3}>
				<Grid item xs={12} md={8} xl={8}>
					<Timer changeBackground={changeBackground} inSession={inSession} setInSession={setInSession} setReady={setReady} ready={ready} />
				</Grid>
				{deepStudy && pinTask !== '' && (
					<Grid item xs={12} md={8} xl={8} className='pinned-grid'>
						<PinnedTask paperCol={paperCol} inSession={inSession} />
					</Grid>
				)}
			</Grid>
			{/* <button onClick={clearAll}>Clear</button> */}
		</Grid>
	);
}

export default Focus;
