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
	Switch,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TaskActionCreators } from '../../redux/actions/task';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import TaskList from './TaskList';
import DoneTasks from './DoneTasks';

function TaskPopup({ session, open, handleClose }) {
	const dispatch = useDispatch();

	const rxTaskList = useSelector((state) => state.task.taskList);
	const rxDoneTasks = useSelector((state) => state.task.doneTasks);
	const rxFavTask = useSelector((state) => state.task.favoriteTask);

	const [input, setInput] = useState('');
	const [showDoneTask, setShowTask] = useState(false);
	const [openWarning, setOpenWarning] = useState(false);

	function Alert(props) {
		return <MuiAlert elevation={6} variant='filled' {...props} />;
	}

	const handleCloseData = () => {
		handleClose();
	};

	function handleSubmit(e) {
		let found = false;
		for (var i = 0; i < rxTaskList.length; i++) {
			if (rxTaskList[i].task.trim() === input.trim()) {
				found = true;
			}
		}
		if (!found) {
			let d = new Date();
			let time = {
				hours: d.getHours(),
				minutes: d.getMinutes(),
				seconds: d.getSeconds(),
			};
			dispatch(
				TaskActionCreators.addTask({
					task: input,
					time: time,
					finished: false,
				})
			);
			setInput('');
		} else {
			setOpenWarning(true);
		}
		e.preventDefault();
	}

	function handleCheckChange(e) {
		let d = new Date();
		let time = {
			hours: d.getHours(),
			minutes: d.getMinutes(),
			seconds: d.getSeconds(),
		};
		rxTaskList.forEach((task) => {
			if (task.task === e.target.name) {
				if (e.target.name === rxFavTask) {
					dispatch(TaskActionCreators.setFavorite(''));
				}
				dispatch(TaskActionCreators.deleteDoneTask(task));
				task['timeFinished'] = time;
				task['finished'] = true;
				dispatch(TaskActionCreators.addDoneTask(task));
				dispatch(TaskActionCreators.deleteTask(task));
			}
		});
	}

	function handleDoneChange(e) {
		let d = new Date();
		let time = {
			hours: d.getHours(),
			minutes: d.getMinutes(),
			seconds: d.getSeconds(),
		};
		rxDoneTasks.forEach((task) => {
			if (task.task === e.target.name) {
				dispatch(TaskActionCreators.deleteTask(task));
				task['timeReopened'] = time;
				task['finished'] = false;
				dispatch(TaskActionCreators.addTask(task));
				dispatch(TaskActionCreators.deleteDoneTask(task));
			}
		});
	}

	function deleteTask(list, taskDel) {
		if (list === 0) {
			if (taskDel.task === rxFavTask) {
				dispatch(TaskActionCreators.setFavorite(''));
			}
			dispatch(TaskActionCreators.deleteTask(taskDel));
		} else {
			dispatch(TaskActionCreators.deleteDoneTask(taskDel));
		}
	}

	const handleSwitchChange = () => {
		setShowTask(!showDoneTask);
	};

	const favoredTask = (task) => {
		if (rxFavTask && rxFavTask === task) {
			dispatch(TaskActionCreators.setFavorite(''));
		} else {
			dispatch(TaskActionCreators.setFavorite(task));
		}
	};

	const handleWarningClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenWarning(false);
	};

	return (
		<Dialog
			onClose={handleCloseData}
			aria-labelledby='customized-dialog-title'
			open={open}
			className='task-popup'
			fullScreen
			fullWidth
		>
			<Grid container className='container'>
				{!showDoneTask ? (
					<Grid item container direction='column'>
						<Grid item>
							<Typography
								variant='h4'
								gutterBottom
								style={{ height: 'fit-content' }}
							>
								Your Tasks
								<Switch
									checked={showDoneTask}
									onChange={handleSwitchChange}
									name='showTask'
									inputProps={{ 'aria-label': 'checkbox with default color' }}
									style={{ color: '#52d869' }}
									disabled={!(rxDoneTasks.length > 0)}
								/>
							</Typography>
							<IconButton
								className='close-btn'
								aria-label='close'
								onClick={handleCloseData}
							>
								<CloseIcon />
							</IconButton>
						</Grid>
						<Grid item className='checkbox-container'>
							{rxTaskList.length > 0 ? (
								<TaskList
									{...{
										handleCheckChange,
										favoredTask,
										deleteTask,
									}}
								/>
							) : (
								<Typography
									variant='subtitle1'
									gutterBottom
									className='marginMd'
								>
									Create some tasks and they'll show up here
								</Typography>
							)}
						</Grid>
						<Grid item className='form-grid'>
							<form
								noValidate
								autoComplete='off'
								className='task-input'
								onSubmit={handleSubmit}
							>
								<Grid container justify='center' alignItems='center'>
									<Grid item xs={11}>
										<Snackbar
											open={openWarning}
											autoHideDuration={5000}
											onClose={handleWarningClose}
										>
											<Alert onClose={handleWarningClose} severity='warning'>
												You already have that task!
											</Alert>
										</Snackbar>
										<TextField
											required
											fullWidth
											value={input}
											label='Add a task'
											onChange={(e) => setInput(e.target.value)}
										/>
									</Grid>
									<Button
										type='submit'
										disabled={!input}
										className='submit-form'
									>
										<FontAwesomeIcon icon={faPen} />
									</Button>
								</Grid>
							</form>
						</Grid>
					</Grid>
				) : (
					<Grid item container>
						<Grid item>
							<Typography variant='h4' gutterBottom>
								Your Finished Tasks
								<Switch
									checked={showDoneTask}
									onChange={handleSwitchChange}
									name='showTask'
									inputProps={{ 'aria-label': 'checkbox with default color' }}
								/>
							</Typography>
							<IconButton
								className='close-btn'
								aria-label='close'
								onClick={handleCloseData}
							>
								<CloseIcon />
							</IconButton>
						</Grid>
						<Grid item className='checkbox-container'>
							{rxDoneTasks.length > 0 && (
								<DoneTasks
									{...{
										handleDoneChange,
										deleteTask,
									}}
								/>
							)}
						</Grid>
					</Grid>
				)}
			</Grid>
		</Dialog>
	);
}

export default TaskPopup;
