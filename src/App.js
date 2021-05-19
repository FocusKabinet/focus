import { Switch, Route, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  fireHandleLogin,
  fireHandleRegister,
  firehandleLogout,
} from './helpers/firebaseHelpers';
import Navbar from './components/generic/Navbar/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Datapage from './pages/Datapage';
import BlockedLogin from './components/generic/BlockedLogin';
import KabinetDashboard from './pages/KabinetDashboard';
import Page from './components/kabinet/Page';
import KabinetNewIdea from './pages/KabinetNewIdea';
import Breakthrough from './pages/Breakthrough';
import { fire } from './app/firebase';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UserActionCreators } from './redux/actions/user';
import KabinetEditIdea from './pages/KabinetNewIdea';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  const isLogged = useSelector((state) => state.user.profile.loggedIn);

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
        handleHistory('breakthrough');
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
        dispatch(
          UserActionCreators.logout({
            user,
            email,
            password,
            loggedIn: false,
          })
        );
        handleHistory('login');
      })
      .catch((e) => {
        alert('There was an error logging out');
        console.log(e.message);
      });
  };

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

  useEffect(() => {
    authListener();
  }, []);

  const handleHistory = (path) => {
    history.push(`/${path}`);
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Navbar loggedIn={isLogged} />
          <Landing />
        </Route>
        <Route path="/login">
          <Navbar loggedIn={isLogged} />
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
        <Route path="/register">
          <Navbar loggedIn={isLogged} />
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
        <Route
          path="/kabinet-home"
          render={(routeProps) => (
            <Page>
              <KabinetDashboard {...routeProps} />
            </Page>
          )}
        />
        <Route
          path="/kabinet-new"
          render={(routeProps) => (
            <Page>
              <KabinetNewIdea {...routeProps} />
            </Page>
          )}
        />
        <Route
          path="/kabinet-edit/:id"
          render={(routeProps) => (
            <Page>
              <KabinetEditIdea {...routeProps} />
            </Page>
          )}
        />
        {isLogged ? (
          <>
            <Route path="/home">
              <Navbar title={'Home'} loggedIn={isLogged} />
              <Home handleLogout={handleLogout} />
            </Route>
            <Route path="/profile:id">
              <Navbar title={'Profile'} loggedIn={isLogged} />
              <Profile />
            </Route>
            <Route path="/settings:id">
              <Navbar title={'Settings'} loggedIn={isLogged} />
              <Settings />
            </Route>
            <Route path="/datapage:id">
              <Navbar title={'Data'} loggedIn={isLogged} />
              <Datapage />
            </Route>
            <Route path="/breakthrough">
              <Navbar title={'Breakthrough'} loggedIn={isLogged} />
              <Breakthrough handleLogout={handleLogout} />
            </Route>
          </>
        ) : (
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
        )}
      </Switch>
    </div>
  );
}

export default App;
