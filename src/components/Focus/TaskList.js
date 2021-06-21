import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function TaskList({ handleCheckChange, favoredTask, deleteTask }) {
	const rxFavTask = useSelector((state) => state.task.favoriteTask);
	const rxTaskList = useSelector((state) => state.task.taskList);

	return (
		<List>
			{rxTaskList.map((task, id) => (
				<ListItem key={id} role={undefined} dense button>
					<ListItemIcon>
						<Checkbox edge='start' onChange={handleCheckChange} name={task.task} color='primary' checked={false} />
					</ListItemIcon>
					<ListItemText id={id} primary={task.task} />
					<IconButton color='secondary' component='span' className='add-des' style={{ color: '#FF0000' }} onClick={() => deleteTask(0, task)} edge='end' aria-label='delete'>
						<FontAwesomeIcon icon={faTrashAlt} />
					</IconButton>
					<IconButton
						component='span'
						className='add-des'
						style={rxFavTask === task.task ? { color: '#FFD700' } : { color: '#7E7E7E' }}
						onClick={() => favoredTask(task.task)}
						edge='end'
						aria-label='pin'
					>
						<FontAwesomeIcon icon={faThumbtack} />
					</IconButton>
				</ListItem>
			))}
		</List>
	);
}

export default TaskList;
