import '../../styles/navbar.scss';
import Nav from './Nav';

function NavBar({ title, ...props }) {
  return (
    <header className="navbar">
      <Nav title={title} />
      <h1>{title}</h1>
    </header>
  );
}

export default NavBar;
