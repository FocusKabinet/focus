import userReducer from './user';
import studyReducer from './studyData';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
	user: userReducer,
	studyData: studyReducer,
});

export default allReducers;
