import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function DoneTasks({ handleDoneChange, deleteTask }) {
	const rxDoneTasks = useSelector((state) => state.task.doneTasks);

	return (
		<List>
			{rxDoneTasks.map((task, id) => (
				<ListItem key={id} role={undefined} dense button>
					<ListItemIcon>
						<Checkbox
							edge='start'
							onChange={handleDoneChange}
							name={task.task}
							color='primary'
							checked={false}
						/>
					</ListItemIcon>
					<ListItemText id={id} primary={task.task} />
					<IconButton
						color='secondary'
						component='span'
						className='add-des'
						edge='end'
						aria-label='delete'
						style={{ color: '#FF0000' }}
						onClick={() => deleteTask(1, task)}
					>
						<FontAwesomeIcon icon={faTrashAlt} />
					</IconButton>
				</ListItem>
			))}
		</List>
	);
}

export default DoneTasks;
