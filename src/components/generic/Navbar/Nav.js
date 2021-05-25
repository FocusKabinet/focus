import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/nav.scss';
import menu from '../../../assets/menu.svg';

function Nav({ title, ...props }) {
	const [open, setOpen] = React.useState(false);

	const onClick = (event) => {
		setOpen(!open);
	};

	return (
		<div className='nav'>
			<button className='nav_toggle' onClick={onClick}>
				<img src={menu} alt='Menu Icon' />
			</button>
			<nav
				className='nav_menu'
				style={open ? { display: 'block' } : { display: 'none' }}
			>
				<Link to={'/'} disabled={title === 'Landing'}>
					<h6>Landing</h6>
				</Link>
				<Link to={'/login'} disabled={title === 'Login'}>
					<h6>Login</h6>
				</Link>
				<Link to={'/register'} disabled={title === 'Register'}>
					<h6>Register</h6>
				</Link>
				<Link to={'/home'} disabled={title === 'Home'}>
					<h6>Home</h6>
				</Link>
				<Link to={'/profile:id'} disabled={title === 'Profile'}>
					<h6>Profile</h6>
				</Link>
				<Link to={'/settings:id'} disabled={title === 'Settings'}>
					<h6>Settings</h6>
				</Link>
				<Link to={'/datapage:id'} disabled={title === 'Data'}>
					<h6>Data</h6>
				</Link>
			</nav>
		</div>
	);
}

export default Nav;
