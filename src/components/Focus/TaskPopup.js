import React, { useState } from 'react';
import './styles/TaskPopup.scss';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import {
	Grid,
	Button,
	Typography,
	IconButton,
	Checkbox,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function TaskPopup({ session, open, handleClose }) {
	const [taskList, setTaskList] = useState([]);
	const [doneTasks, setDoneTasks] = useState([]);
	const [input, setInput] = useState('');

	const handleCloseData = () => {
		handleClose();
	};

	function handleSubmit(e) {
		e.preventDefault();
		setTaskList((prev) => {
			return [...prev, { task: input, des: '' }];
		});
		setInput('');
	}

	function handleChange(e) {
		setTaskList(
			taskList.filter((task) => {
				if (task.task === e.target.name) {
					setDoneTasks((prev) => {
						return [...prev, task];
					});
				}
				return task.task !== e.target.name;
			})
		);
	}

	return (
		<Dialog
			onClose={handleCloseData}
			aria-labelledby='customized-dialog-title'
			open={open}
			className='task-popup'
		>
			<Grid container className='container'>
				<Grid item container justify='space-between' alignItems='baseline'>
					<Typography variant='h4' gutterBottom>
						Your Tasks
					</Typography>
					<IconButton aria-label='close' onClick={handleCloseData}>
						<CloseIcon />
					</IconButton>
				</Grid>
				<Grid item>
					{taskList.length > 0 ? (
						<ul>
							{taskList.map((task, id) => (
								<Typography key={id}>
									<Checkbox
										onChange={handleChange}
										name={task.task}
										color='primary'
										checked={false}
									/>
									<label>{task.task}</label>
								</Typography>
							))}
						</ul>
					) : (
						<Typography gutterBottom>
							Create some tasks and they'll show up here
						</Typography>
					)}
				</Grid>
				<form
					noValidate
					autoComplete='off'
					className='task-input'
					onSubmit={handleSubmit}
				>
					<Grid
						container
						justify='space-around'
						alignItems='flex-end'
						spacing={3}
					>
						<Grid item xs={10}>
							<TextField
								required
								fullWidth
								value={input}
								label='Add a task'
								onChange={(e) => setInput(e.target.value)}
							/>
						</Grid>
						<Grid item xs={2}>
							<Button type='submit' disabled={!input}>
								<FontAwesomeIcon icon={faPen} className='submit-form' />
							</Button>
						</Grid>
					</Grid>
				</form>
				<Grid item container direction='column'>
					<Typography variant='h6'>Finished Tasks</Typography>
					{doneTasks.length > 0 && (
						<ul>
							{doneTasks.map((task, id) => (
								<li key={id}>
									<label>done: {task.task}</label>
								</li>
							))}
						</ul>
					)}
				</Grid>
			</Grid>
		</Dialog>
	);
}

export default TaskPopup;
