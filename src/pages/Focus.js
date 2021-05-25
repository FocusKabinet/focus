import React from 'react';
import './styles/Focus.scss';
import { Grid, Typography, Button } from '@material-ui/core';
import Timer from '../components/Focus/Timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTasks,
	faHourglassHalf,
	faCog,
} from '@fortawesome/free-solid-svg-icons';

function Focus({ handleLogout, ...props }) {
	const [background, setBackground] = React.useState({ backgroundColor: '' });

	const changeBackground = (color) => {
		setBackground({ backgroundColor: color });
	};

	return (
		<div className='page-container' style={background}>
			<Grid container justify='center' alignItems='center' spacing={5}>
				<Grid
					container
					direction='row'
					justify='flex-end'
					alignItems='center'
					item
					spacing={1}
					xs={12}
				>
					<Grid item xs={10}>
						<Typography variant='h2'>Timer Title</Typography>
					</Grid>
					<Grid item xs={1}>
						<Button variant='contained' size='medium'>
							<FontAwesomeIcon icon={faTasks} className='icons' /> Tasks
						</Button>
					</Grid>
					<Grid item xs={1}>
						<Button variant='contained' size='medium'>
							<FontAwesomeIcon icon={faHourglassHalf} className='icons' /> Data
						</Button>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Timer changePageBackground={changeBackground} />
				</Grid>
			</Grid>
			<button onClick={handleLogout}>logout</button>
		</div>
	);
}

export default Focus;
