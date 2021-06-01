import React from 'react';
import './styles/Focus.scss';
import { Grid, Typography, Button } from '@material-ui/core';
import Timer from '../components/Focus/Timer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { TimerActionCreators } from '../redux/actions/timer';

function Focus({ handleLogout }) {
	const deepStudy = useSelector((state) => state.timer.deep_study);

	const [background, setBackground] = React.useState({ backgroundColor: '' });
	const [inSession, setInSession] = React.useState(false);
	const changeBackground = (color) => {
		setBackground({ backgroundColor: color });
	};
	return (
		<Grid container justify='center' className='page-container' style={background}>
			<Grid item xs={10}>
				<Typography variant='h2'>Timer</Typography>
			</Grid>
			{deepStudy && inSession && (
				<Grid item xs={2}>
					<Button onClick={() => setInSession(false)} className='timer-buttons'>
						End Session
					</Button>
				</Grid>
			)}
			<Grid item xs={12} container justify='center' alignItems='center' direction='row' sapcing={3}>
				<Grid item xs={6}>
					<Timer changeBackground={changeBackground} inSession={inSession} setInSession={setInSession} />
				</Grid>
			</Grid>
			<button onClick={handleLogout}>logout</button>
		</Grid>
	);
}

export default Focus;
