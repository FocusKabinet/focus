import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Datapage from './components/Datapage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/login">
            <Navbar title={'Login'} loggedIn={false} />
            <Login />
          </Route>
          <Route path="/register" loggedIn={false}>
            <Navbar title={'Register'} />
            <Register />
          </Route>
          <Route path="/:id" loggedIn={true}>
            <Navbar title={'Home'} />
            <Home />
          </Route>
          <Route path="/profile:id">
            <Navbar title={'Profile'} loggedIn={true} />
            <Profile />
          </Route>
          <Route path="/settings:id">
            <Navbar title={'Settings'} loggedIn={true} />
            <Settings />
          </Route>
          <Route path="/datapage:id">
            <Navbar title={'Data'} loggedIn={true} />
            <Datapage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
