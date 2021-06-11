export const taskDataType = {
	ADD_TASK: 'ADD_TASK',
	ADD_DONE_TASK: 'ADD_DONE_TASK',
	SET_FAVORITE: 'SET_FAVORITE',
	DELETE_TASK: 'DELETE_TASK',
	DELETE_DONE_TASK: 'DELETE_DONE_TASK',
	CLEAR_STATE: 'CLEAR_STATE',
};

export const TaskActionCreators = {
	addTask: (task) => ({
		type: 'ADD_TASK',
		payload: { task },
	}),

	addDoneTask: (task) => ({
		type: 'ADD_DONE_TASK',
		payload: { task },
	}),

	setFavorite: (task) => ({
		type: 'SET_FAVORITE',
		payload: task,
	}),

	deleteTask: (task) => ({
		type: 'DELETE_TASK',
		payload: { task },
	}),

	deleteDoneTask: (task) => ({
		type: 'DELETE_DONE_TASK',
		payload: { task },
	}),

	clearState: () => ({
		type: 'CLEAR_STATE',
	}),
};
