import userReducer from './user';
import studyReducer from './studyData';
import timerReducer from './timer';
import loadingReducer from './loading';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  user: userReducer,
  studyData: studyReducer,
  timer: timerReducer,
  loading: loadingReducer,
});

export default allReducers;
