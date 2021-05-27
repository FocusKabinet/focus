import { Switch, Route, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fireHandleLogin, fireHandleRegister, firehandleLogout } from './helpers/firebaseHelpers';
import Navbar from './components/generic/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Datapage from './pages/Datapage';
import BlockedLogin from './components/generic/BlockedLogin';
import Focus from './pages/Focus';
import FocusHome from './pages/FocusHome';
import { fire } from './app/firebase';
import { useDispatch } from 'react-redux';
import { UserActionCreators } from './redux/actions/user';
import {
	createMuiTheme,
	responsiveFontSizes,
	MuiThemeProvider,
} from '@material-ui/core/styles';
import KabinetRoutes from './routes/KabinetRoutes';

function App() {
	let theme = createMuiTheme({
		typography: {
			fontSize: 20,
		},
	});

	theme = responsiveFontSizes(theme);

	const history = useHistory();
	const dispatch = useDispatch();

	// const isLogged = useSelector((state) => state.user.profile.loggedIn);

	const [user, setUser] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [hasAccount, setHasAccount] = useState(false);

	const clearAllInputs = () => {
		setEmail('');
		setPassword('');
	};

	const clearAllErr = () => {
		setEmailError('');
		setPasswordError('');
	};

	const handleLogin = () => {
		clearAllErr();
		const res = fireHandleLogin(email, password);
		res
			.then(() => {
				dispatch(
					UserActionCreators.login({
						user,
						email,
						password,
						loggedIn: true,
					})
				);
				handleHistory('focus');
			})
			.catch((e) => {
				switch (e.code) {
					case 'auth/invalid-email':
					case 'auth/user-disabled':
					case 'auth/user-not-found':
						setEmailError(e.message);
						break;
					case 'auth/wrong-password':
						setPasswordError(e.message);
						break;
					default:
						setEmailError(e.message);
						setPasswordError(e.message);
						break;
				}
			});
	};

	const handleRegister = () => {
		clearAllErr();
		const res = fireHandleRegister(email, password);
		res
			.then(() => {
				dispatch(
					UserActionCreators.addProfile({
						user,
						email,
						password,
						loggedIn: true,
					})
				);
				handleHistory('home');
			})
			.catch((e) => {
				switch (e.code) {
					case 'auth/email-already-in-use':
					case 'auth/invalid-email':
						setEmailError(e.message);
						break;
					case 'auth/weak-password':
						setPasswordError(e.message);
						break;
					default:
						setEmailError(e.message);
						setPasswordError(e.message);
						break;
				}
			});
	};

	const handleLogout = () => {
		const res = firehandleLogout();
		res
			.then(() => {
				dispatch(UserActionCreators.logout());
				handleHistory('login');
			})
			.catch((e) => {
				alert('There was an error logging out');
				console.log(e.message);
			});
	};

	useEffect(() => {
		const authListener = () => {
			fire.auth().onAuthStateChanged((user) => {
				if (user) {
					clearAllInputs();
					setUser(user);
				} else {
					setUser('');
				}
			});
		};
		authListener();
	}, []);

	const handleHistory = (path) => {
		history.push(`/${path}`);
	};

	return (
		<div className='App'>
			<Switch>
				<Route exact path='/'>
					<Navbar loggedIn={false} />
					<Landing />
				</Route>
				<Route path='/login'>
					<Navbar loggedIn={false} />
					<Login
						{...{
							email,
							setEmail,
							password,
							setPassword,
							handleLogin,
							hasAccount,
							setHasAccount,
							emailError,
							passwordError,
						}}
					/>
				</Route>
				<Route path='/register'>
					<Navbar loggedIn={false} />
					<Register
						{...{
							email,
							setEmail,
							password,
							setPassword,
							handleLogin,
							handleRegister,
							hasAccount,
							setHasAccount,
							emailError,
							passwordError,
						}}
					/>
				</Route>
				
				{/* {isLogged ? ( */}
					<Route path='/home'>
						<Navbar title={'Home'} loggedIn={false} />
						<Home handleLogout={handleLogout} />
					</Route>
					<Route path='/profile/:id'>
						<Navbar title={'Profile'} loggedIn={false} />
						<Profile />						
					</Route>
					<Route path='/settings/:id'>
						<Navbar title={'Settings'} loggedIn={false} />
						<Settings />
					</Route>
					<Route path='/datapage/:id'>
						<Navbar title={'Data'} loggedIn={false} />
						<Datapage />
					</Route>
					<Route path='/focus-timer'>
						<Navbar title={'Focus'} loggedIn={false} />
						<MuiThemeProvider theme={theme}>
							<Focus handleLogout={handleLogout} />
						</MuiThemeProvider>
					</Route>
					<Route path='/focus'>
						<Navbar title={'Focus'} loggedIn={false} />
						<MuiThemeProvider theme={theme}>
							<FocusHome handleLogout={handleLogout} />
						</MuiThemeProvider>
					</Route>
				{/* ) : (
					<>
						<div>
							<BlockedLogin />
							<Login
								email={email}
								setEmail={setEmail}
								password={password}
								setPassword={setPassword}
								handleLogin={handleLogin}
								hasAccount={hasAccount}
								setHasAccount={setHasAccount}
								emailError={emailError}
								passwordError={passwordError}
							/>
						</div>
					</>
				)} */}
				<KabinetRoutes />
			</Switch>
		</div>
	);
}

export default App;
