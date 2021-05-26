import React from 'react';
import './styles/Focus.scss';
import { Grid, Typography } from '@material-ui/core';
import Timer from '../components/Focus/Timer';
import DataPopup from '../components/Focus/DataPopup';

function Focus({ handleLogout, ...props }) {
	const [background, setBackground] = React.useState({ backgroundColor: '' });
	const [dataVisible, setDataVisible] = React.useState(false);

	const changeBackground = (color) => {
		setBackground({ backgroundColor: color });
	};

	return (
		<div className='page-container' style={background}>
			<Grid container justify='center' alignItems='center' spacing={5}>
				<Grid item xs={12}>
					<Typography variant='h2'>Pomodoro</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					container
					justify='center'
					alignItems='center'
					direction='row'
					sapcing={3}
				>
					<Grid item xs={6}>
						<Timer
							visible={dataVisible}
							setVisible={setDataVisible}
							changePageBackground={changeBackground}
						/>
					</Grid>
				</Grid>
			</Grid>
			{/* <DataPopup visible={dataVisible} setVisible={setDataVisible} /> */}
			<button onClick={handleLogout}>logout</button>
		</div>
	);
}

export default Focus;
