import React from 'react';
import './styles/TimerCard.scss';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TimerActionCreators } from '../../redux/actions/timer';

function TimerCard({ name, studySes, des }) {
	const dispatch = useDispatch();

	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const setTimer = () => {};

	return (
		<Card className='card-container'>
			<Link
				to={'/focus-timer'}
				className='link'
				onClick={() => {
					dispatch(TimerActionCreators.setType(studySes));
				}}
			>
				<CardActionArea>
					<CardMedia className='card-bck' title='Timer' image='src/assets/empty-state-photo.png' />
					<CardContent>
						<Typography gutterBottom variant='h5' component='h2'>
							{name}
						</Typography>
						<Typography variant='body2' color='textSecondary' component='p'>
							{des}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Link>
		</Card>
	);
}

export default TimerCard;
