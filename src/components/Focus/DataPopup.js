import React from 'react';
import './styles/DataPopup.scss';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid, Box, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function DataPopup({ session, open, handleClose, setInSession, inSession, ready }) {
	const history = useHistory();

	const studies = useSelector((state) => state.studyData.studies);
	const study_times = useSelector((state) => state.studyData.study_times);
	const short_breaks = useSelector((state) => state.studyData.short_breaks_taken);
	const long_breaks = useSelector((state) => state.studyData.long_breaks_taken);

	const [toData, setToData] = React.useState(false);

	const toDataPage = () => {
		if (inSession === 1) {
			if (ready) {
				setInSession(2);
			} else {
				setInSession(3);
			}
		}
		if (ready || inSession === 0) {
			setToData(!toData);
		}
	};

	React.useEffect(() => {
		if (toData) {
			history.push('/data');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toData]);

	return (
		<Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open} className='data-popup' fullScreen fullWidth>
			<Box className='container'>
				<Grid container justify='space-between' alignItems='baseline'>
					<Typography variant='h4' gutterBottom>
						Your Data
					</Typography>
					<IconButton aria-label='close' onClick={handleClose} className='close-btn'>
						<CloseIcon />
					</IconButton>
				</Grid>
				<div>
					<Typography gutterBottom>Number of Pomodoro Sessions: {studies}</Typography>
					<Typography gutterBottom>Number of Short Breaks: {short_breaks}</Typography>
					<Typography gutterBottom>Number of Long Breaks: {long_breaks} </Typography>
					<Typography gutterBottom>
						Current Study Session Time: <span>{('0' + Math.floor((session.currentTime / (1000 * 60 * 60)) % 24)).slice(-2)}</span>:
						<span>{('0' + Math.floor((session.currentTime / 60000) % 60)).slice(-2)}</span>:<span>{('0' + Math.floor((session.currentTime / 1000) % 60)).slice(-2)}</span>
					</Typography>
					<Typography variant='h6' gutterBottom>
						Your Pomodoro Sessions:
						<ul>
							{study_times.map((time, id) => (
								<li key={id}>
									start: {('0' + time.start.hours).slice(-2)}:{('0' + time.start.minutes).slice(-2)}:{('0' + time.start.seconds).slice(-2)}, end: {('0' + time.end.hours).slice(-2)}:
									{('0' + time.end.minutes).slice(-2)}:{('0' + time.end.seconds).slice(-2)} study time: {('0' + time.timeSpent.hour).slice(-2)}:{('0' + time.timeSpent.min).slice(-2)}:
									{('0' + time.timeSpent.sec).slice(-2)}
								</li>
							))}
						</ul>
					</Typography>
				</div>
				<Button onClick={toDataPage} color='primary'>
					{ready || inSession === 0 ? <>Data Page</> : <>End Session to go to Data Page</>}
				</Button>
			</Box>
		</Dialog>
	);
}

export default DataPopup;
