import React from 'react';
import './styles/Breakthrough.scss';
import { Grid, Typography, Button } from '@material-ui/core';
import Timer from '../components/BreakThrough/Timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTasks,
	faHourglassHalf,
	faCog,
} from '@fortawesome/free-solid-svg-icons';

function Breakthrough({ handleLogout, ...props }) {
	return (
		<div className='page-container'>
			<Grid container justify='center' alignItems='center' spacing={5}>
				<Grid
					container
					direction='row'
					justify='flex-end'
					alignItems='center'
					item
					xs={12}
				>
					<Grid item xs={9}>
						<Typography variant='h2'>Timer Title</Typography>
					</Grid>
					<Grid item xs={1}>
						<Button variant='contained' size='large'>
							<FontAwesomeIcon icon={faTasks} />
						</Button>
					</Grid>
					<Grid item xs={1}>
						<Button variant='contained' size='large'>
							<FontAwesomeIcon icon={faHourglassHalf} />
						</Button>
					</Grid>
					<Grid item xs={1}>
						<Button variant='contained' size='large'>
							<FontAwesomeIcon icon={faCog} />
						</Button>
					</Grid>
				</Grid>
				<Grid item xs={8}>
					<Timer />
				</Grid>
			</Grid>
			<button onClick={handleLogout}>logout</button>
		</div>
	);
}

export default Breakthrough;
