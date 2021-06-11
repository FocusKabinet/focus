import React, { useState } from 'react';
import './styles/TaskPopup.scss';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
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
import { TaskActionCreators } from '../../redux/actions/task';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';

function TaskPopup({ session, open, handleClose }) {
	const dispatch = useDispatch();

	const [taskList, setTaskList] = useState([]);
	const [doneTasks, setDoneTasks] = useState([]);
	const [input, setInput] = useState('');
	const [showDoneTask, setShowTask] = useState(false);
	const [favTask, setFavTask] = useState({});

	const handleCloseData = () => {
		handleClose();
	};

	function handleSubmit(e) {
		let found = false;
		for (var i = 0; i < taskList.length; i++) {
			if (taskList[i].task.trim() === input.trim()) {
				found = true;
			} else {
				console.log(taskList[i]);
			}
		}
		if (!found) {
			let d = new Date();
			let time = {
				hours: d.getHours(),
				minutes: d.getMinutes(),
				seconds: d.getSeconds(),
			};
			setTaskList((prev) => {
				dispatch(
					TaskActionCreators.addTask({
						task: input,
						time: time,
						finished: false,
					})
				);
				return [...prev, { task: input }];
			});
			setInput('');
		} else {
			alert('Youve already entered that task');
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
		setTaskList(
			taskList.filter((task) => {
				if (task.task === e.target.name) {
					if (e.target.name === favTask) {
						setFavTask('');
						dispatch(TaskActionCreators.setFavorite(''));
					}
					dispatch(TaskActionCreators.deleteDoneTask(task));
					setDoneTasks((prev) => {
						task['timeFinished'] = time;
						task['finished'] = true;
						dispatch(TaskActionCreators.addDoneTask(task));
						return [...prev, task];
					});
					dispatch(TaskActionCreators.deleteTask(task));
				}
				return task.task !== e.target.name;
			})
		);
	}

	function handleDoneChange(e) {
		let d = new Date();
		let time = {
			hours: d.getHours(),
			minutes: d.getMinutes(),
			seconds: d.getSeconds(),
		};
		setDoneTasks(
			doneTasks.filter((task) => {
				if (task.task === e.target.name) {
					dispatch(TaskActionCreators.deleteTask(task));
					setTaskList((prev) => {
						task['timeReopened'] = time;
						task['finished'] = false;
						dispatch(TaskActionCreators.addTask(task));
						return [...prev, task];
					});
					dispatch(TaskActionCreators.deleteDoneTask(task));
				}
				return task.task !== e.target.name;
			})
		);
	}

	function deleteTask(list, taskDel) {
		if (list === 0) {
			setTaskList(
				taskList.filter((task) => {
					return task.task !== taskDel;
				})
			);
			if (taskDel === favTask) {
				setFavTask('');
				dispatch(TaskActionCreators.setFavorite(''));
			}
			dispatch(TaskActionCreators.deleteTask(taskDel));
		} else {
			setDoneTasks(
				doneTasks.filter((task) => {
					return task.task !== taskDel;
				})
			);
			dispatch(TaskActionCreators.deleteDoneTask(taskDel));
		}
	}

	const handleSwitchChange = () => {
		setShowTask(!showDoneTask);
	};

	const favoredTask = (task) => {
		if (favTask && favTask === task) {
			setFavTask('');
			dispatch(TaskActionCreators.setFavorite(''));
		} else {
			setFavTask(task);
			dispatch(TaskActionCreators.setFavorite(task));
		}
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
									disabled={!(doneTasks.length > 0)}
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
							{taskList.length > 0 ? (
								taskList.map((task, id) => (
									<Typography key={id}>
										<Checkbox
											onChange={handleCheckChange}
											name={task.task}
											color='primary'
											checked={false}
										/>
										<label>
											{task.task}
											<IconButton
												color='secondary'
												component='span'
												className='add-des'
												style={{ color: '#FF0000' }}
												onClick={() => deleteTask(0, task.task)}
											>
												<FontAwesomeIcon icon={faTrashAlt} />
											</IconButton>
											<IconButton
												component='span'
												className='add-des'
												style={
													favTask === task.task
														? { color: '#FFD700' }
														: { color: '#7E7E7E' }
												}
												onClick={() => favoredTask(task.task)}
											>
												<FontAwesomeIcon icon={faStar} />
											</IconButton>
										</label>
									</Typography>
								))
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
							{doneTasks.length > 0 &&
								doneTasks.map((task, id) => (
									<Typography key={id}>
										<Checkbox
											onChange={handleDoneChange}
											name={task.task}
											color='primary'
											checked={false}
										/>
										<label>
											{task.task}
											<IconButton
												color='secondary'
												component='span'
												className='add-des'
												style={{ color: '#FF0000' }}
												onClick={() => deleteTask(1, task.task)}
											>
												<FontAwesomeIcon icon={faTrashAlt} />
											</IconButton>
										</label>
									</Typography>
								))}
						</Grid>
					</Grid>
				)}
			</Grid>
		</Dialog>
	);
}

export default TaskPopup;
