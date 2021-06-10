import React from 'react';
import './styles/FocusHome.scss';
import TimerCard from '../components/Focus/TimerCard';
// import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

function FocusHome() {
	return (
		<Grid
			container
			className='home-container'
			justify='center'
			alignItems='center'
		>
			<Grid
				item
				xs={6}
				container
				justify='center'
				alignItems='center'
				className='section-one'
			>
				<Grid item xs={10}>
					<TimerCard
						name='Study Timer'
						studySes={false}
						des='Just the study timer'
					/>
				</Grid>
			</Grid>
			<Grid
				item
				xs={6}
				container
				justify='center'
				alignItems='center'
				className='section-two'
			>
				<Grid item xs={10}>
					<TimerCard name='Session Timer' studySes={true} des='Record data' />
				</Grid>
			</Grid>
		</Grid>
	);
}

export default FocusHome;
