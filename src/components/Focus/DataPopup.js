import React, { useState } from 'react';
import './styles/DataPopup.scss';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Grid, Box } from '@material-ui/core';
import { useSelector } from 'react-redux';

function DataPopup({ open, handleClose }) {
	const studies = useSelector((state) => state.studyData.studies);
	const study_times = useSelector((state) => state.studyData.study_times);

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby='customized-dialog-title'
			open={open}
		>
			<Box className='container'>
				<Grid container justify='space-between' alignItems='baseline'>
					<Typography variant='h4' gutterBottom>
						Your Data
					</Typography>
					<IconButton aria-label='close' onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Grid>
				<div>
					<Typography gutterBottom>{studies}</Typography>
					<Typography gutterBottom>
						{/* <ul>
							{study_times.map((time) => {
								<li>{time}</li>;
							})}
						</ul> */}
					</Typography>
					<Typography gutterBottom>
						Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
						cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
						dui. Donec ullamcorper nulla non metus auctor fringilla.
					</Typography>
				</div>
				<Button autoFocus onClick={handleClose} color='primary'>
					Data Page
				</Button>
			</Box>
		</Dialog>
	);
}

export default DataPopup;
