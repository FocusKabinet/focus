import userReducer from './user';
import studyReducer from './studyData';
import timerReducer from './timer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
	user: userReducer,
	studyData: studyReducer,
	timer: timerReducer,
});

export default allReducers;
