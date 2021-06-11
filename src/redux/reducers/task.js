import { taskDataType as Types } from '../actions/task';

const initialState = {
	taskList: [],
	doneTasks: [],
	favoriteTask: '',
};

const taskReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.ADD_TASK:
			return {
				...state,
				taskList: [...state.taskList, action.payload.task],
			};

		case Types.ADD_DONE_TASK:
			return {
				...state,
				doneTasks: [...state.doneTasks, action.payload.task],
			};

		case Types.SET_FAVORITE:
			return {
				...state,
				favoriteTask: action.payload,
			};

		case Types.DELETE_TASK:
			return {
				...state,
				taskList: state.taskList.filter(
					(task) => task.task !== action.payload.task.task
				),
			};

		case Types.DELETE_DONE_TASK:
			return {
				...state,
				doneTasks: state.doneTasks.filter(
					(task) => task.task !== action.payload.task.task
				),
			};

		case Types.CLEAR_STATE:
			return initialState;

		default:
			return state;
	}
};

export default taskReducer;
