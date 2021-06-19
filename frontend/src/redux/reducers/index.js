import userReducer from './user';
import studyReducer from './studyData';
import timerReducer from './timer';
import taskReducer from './task';
import loadingReducer from './loading';
import notificationReducer from './notification';
import { combineReducers } from 'redux';
import kabinetUserReducer from './kabinetUser';
import kabinetBookmarksReducer from './kabinetBookmarks';

const allReducers = combineReducers({
  user: userReducer,
  studyData: studyReducer,
  timer: timerReducer,
  task: taskReducer,
  loading: loadingReducer,
  notification: notificationReducer,
  kabinet_user: kabinetUserReducer,
  kabinet_bookmarks: kabinetBookmarksReducer,
});

export default allReducers;
