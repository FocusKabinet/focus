import { Switch, Route, useHistory } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {fire} from './app/firebase';
import Navbar from './components/Navbar/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Datapage from './components/Datapage';

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
    fire
      .auth()
      .signInWithEmailAndPassword(email,password)
      .then(result=>{
        handleHistory("home");
      })
      .catch(err=>{
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
    if(user)
      handleHistory("home");    
  }

  const handleRegister = () =>{
    clearAllErr();
    fire
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .then(result=>{
        handleHistory("home");
      })
      .catch(err=>{
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      })    
  }

  const handleLogout = () =>{
    fire.auth().signOut();
    handleHistory("login")
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
