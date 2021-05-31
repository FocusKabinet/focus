import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import allReducers from './redux/reducers/index';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user', 'studyData', 'timer'],
};
const persistedReducer = persistReducer(persistConfig, allReducers);
const projectStore = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const persistor = persistStore(projectStore);

ReactDOM.render(
	<Provider store={projectStore}>
		<PersistGate loading={null} persistor={persistor}>
			<Router
				getUserConfirmation={(message, callback) => {
					const allowTransition = window.confirm(message);
					callback(allowTransition);
				}}
			>
				<App />
			</Router>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
