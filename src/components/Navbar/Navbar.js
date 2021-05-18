import '../styles/navbar.scss';
import Nav from './Nav';

function NavBar(props) {
  if(props.loggedIn){
    return (
      <header className="navbar">
        <Nav title={props.title}/>
        <h1>{props.title}</h1>
      </header>
    );
  }else{return("");}
}

export default NavBar;
