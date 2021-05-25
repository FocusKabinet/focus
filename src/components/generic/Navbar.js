import './styles/navbar.scss';
import Nav from './Nav';
import { useSelector } from 'react-redux';

function NavBar(props) {
	const email = useSelector((state) => state.user.profile.email);

	if (props.loggedIn) {
		return (
			<header className='navbar'>
				<Nav title={props.title} />
				<h1>{props.title}</h1>
				<h1 className='user'>{email}</h1>
			</header>
		);
	} else {
		return (
			<header className='navbar'>
				<h1>Focus</h1>
			</header>
		);
	}
}

export default NavBar;
