import React from 'react';
import './styles/DataPopup.scss';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid, Box, Typography, createMuiTheme, ThemeProvider, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
		console.log(session);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toData]);

	return (
		<Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open} className='data-popup' fullScreen fullWidth>
			<Box className='container'>
				<Grid container justify='center' alignItems='baseline' className='title'>
					<Typography variant='h4' gutterBottom style={{ height: 'fit-content' }}>
						This Session's Data
					</Typography>
					<IconButton aria-label='close' onClick={handleClose} className='close-btn'>
						<CloseIcon />
					</IconButton>
				</Grid>
				{studies || short_breaks || long_breaks || session.currentTime !== 0 || study_times.length > 0 ? (
					<div>
						{session.currentTime > 0 && (
							<Typography variant='h6' gutterBottom className='space-around'>
								Session Time: <span>{('0' + Math.floor((session.currentTime / (1000 * 60 * 60)) % 24)).slice(-2)}</span>:<span>{('0' + Math.floor((session.currentTime / 60000) % 60)).slice(-2)}</span>
								:<span>{('0' + Math.floor((session.currentTime / 1000) % 60)).slice(-2)}</span>
							</Typography>
						)}
						{short_breaks > 0 && (
							<Typography variant='h6' gutterBottom className='space-around'>
								Short Breaks: {short_breaks}
							</Typography>
						)}
						{long_breaks > 0 && (
							<Typography variant='h6' gutterBottom className='space-around'>
								Long Breaks: {long_breaks}
							</Typography>
						)}
						{studies > 0 && (
							<Typography variant='h6' gutterBottom className='space-around'>
								Study Sessions: {studies}
							</Typography>
						)}
						{study_times.length > 0 && (
							<Accordion className='space-around study-ses'>
								<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-actions1-content' id='additional-actions1-header'>
									<Typography variant='h6' gutterBottom>
										Your Study Sessions:
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<ol>
										{study_times.map((time, id) => (
											<li key={id}>
												<Typography variant='h6' gutterBottom>
													{('0' + time.start.hours).slice(-2)}:{('0' + time.start.minutes).slice(-2)}:{('0' + time.start.seconds).slice(-2)} - {('0' + time.end.hours).slice(-2)}:
													{('0' + time.end.minutes).slice(-2)}:{('0' + time.end.seconds).slice(-2)}{' '}
												</Typography>
												<Typography variant='h6' gutterBottom>
													study time: {('0' + time.timeSpent.hour).slice(-2)}:{('0' + time.timeSpent.min).slice(-2)}:{('0' + time.timeSpent.sec).slice(-2)}
												</Typography>
											</li>
										))}
									</ol>
								</AccordionDetails>
							</Accordion>
						)}
					</div>
				) : (
					<Typography gutterBottom>Complete Some Sessions and they'll show up here!</Typography>
				)}
				<Button onClick={toDataPage} color='primary' className='space-around data-btn'>
					<Typography variant='h6'>{ready || inSession === 0 ? <>Data Page</> : <>End Session to go to Data Page</>}</Typography>
				</Button>
			</Box>
		</Dialog>
	);
}

export default DataPopup;
