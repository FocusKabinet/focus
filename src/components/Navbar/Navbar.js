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
<<<<<<< HEAD
  }else{return(
    <header className="navbar">
        <h1>Focus</h1>
    </header>
  );}
=======
  }else{return("");}
>>>>>>> a6b8198fa7a4f7a08c45e9b8ef2dc8f72ff5858c
}

export default NavBar;
