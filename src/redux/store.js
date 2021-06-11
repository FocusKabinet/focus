import { createStore } from 'redux';
import allReducers from './reducers/index';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user', 'studyData', 'timer', 'task'],
};
const persistedReducer = persistReducer(persistConfig, allReducers);
export const projectStore = createStore(
	persistedReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(projectStore);
