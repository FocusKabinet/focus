import loadingReducer from './loading';
import notificationReducer from './notification';
import { combineReducers } from 'redux';
import kabinetUserReducer from './kabinetUser';
import kabinetBookmarksReducer from './kabinetBookmarks';

const allReducers = combineReducers({
  loading: loadingReducer,
  notification: notificationReducer,
  kabinet_user: kabinetUserReducer,
  kabinet_bookmarks: kabinetBookmarksReducer,
});

export default allReducers;
