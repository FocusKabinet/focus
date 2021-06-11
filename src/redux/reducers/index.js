import userReducer from './user';
import studyReducer from './studyData';
import timerReducer from './timer';
import taskReducer from './task';
import loadingReducer from './loading';
import notificationReducer from './notification';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
	user: userReducer,
	studyData: studyReducer,
	timer: timerReducer,
	task: taskReducer,
	loading: loadingReducer,
	notification: notificationReducer,
});

export default allReducers;
