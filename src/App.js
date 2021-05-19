import { Switch, Route, useHistory } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {fireHandleLogin, fireHandleRegister, firehandleLogout} from './helpers/firebaseHelpers';
import Navbar from './components/Navbar/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Datapage from './pages/Datapage';
import KabinetDashboard from './pages/KabinetDashboard';
import {fire} from './app/firebase';

function App() {
  const history = useHistory();

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  const clearAllInputs = ()=>{
    setEmail('');
    setPassword('');
  }

  const clearAllErr = () =>{
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () =>{
    clearAllErr();
    const res = fireHandleLogin(email,password);
    res
      .then(()=>{
        handleHistory("home");
      }) 
      .catch(e=>{
        switch(e.code){
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
              setEmailError(e.message)
              break;
            case "auth/wrong-password":
              setPasswordError(e.message)
              break;
            }
      })
  }

  const handleRegister = () =>{
    clearAllErr();
    const res = fireHandleRegister(email,password);
    res
      .then(()=>{
        handleHistory("home");
      }) 
      .catch(e=>{
        switch(e.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(e.message);
            break;
          case "auth/weak-password":
            setPasswordError(e.message);
            break;
        }
      });
  }

  const handleLogout = () =>{
    const res = firehandleLogout();
    res
      .then(()=>handleHistory("login"))
      .catch(e=>{
        alert("There was an error logging out")
        console.log(e.message);
      });
  }

  const authListener = () =>{
    fire.auth().onAuthStateChanged(user =>{
      if(user){
        clearAllInputs();
        setUser(user);
      }else{
        setUser('');
      }
    })
  }

  useEffect(()=>{
    authListener();
  },[])

  const handleHistory = (path) =>{
    history.push(`/${path}`);
  }

  return (
      <div className="App">
        <Switch>
          <Route exact path="/">
              <Navbar loggedIn={false}/>
              <Landing />
          </Route>
          <Route path="/login">
              <Navbar loggedIn={false}/>
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
          </Route>
          <Route path="/register">
              <Navbar loggedIn={false} />
              <Register 
                email={email}   
                setEmail={setEmail}   
                password={password}   
                setPassword={setPassword} 
                handleLogin={handleLogin}
                handleRegister={handleRegister}
                hasAccount={hasAccount}
                setHasAccount={setHasAccount}
                emailError={emailError}
                passwordError={passwordError}
              />
          </Route>
          {user ?
            <>
              <Route path="/home" >
                  <Navbar title={"Home"} loggedIn={true}/>
                  <Home handleLogout={handleLogout} />
              </Route>
              <Route path="/profile:id">
                  <Navbar title={"Profile"} loggedIn={true}/>
                  <Profile />
              </Route>
              <Route path="/settings:id">
                  <Navbar title={"Settings"} loggedIn={true}/>
                  <Settings />
              </Route>
              <Route path="/datapage:id">
                  <Navbar title={"Data"} loggedIn={true}/>
                  <Datapage />
              </Route>
            </>
            :
            <>
            <div> 
              please log in
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
          }
        </Switch>
      </div>
  );
}

export default App;
