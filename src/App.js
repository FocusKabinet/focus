import { Switch } from 'react-router-dom';
import KabinetRoutes from './routes/KabinetRoutes';

function App() {
	return (
		<div className='App'>
			<Switch>
				<KabinetRoutes />
			</Switch>
		</div>
	);
}

export default App;
