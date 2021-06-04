import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AllInbox, Whatshot } from '@material-ui/icons';
import './styles/Navigation.scss';

export default function Navigation(props) {
  const {
    match: { path },
    history,
  } = props;
  const routes = ['/kabinet-home', '/kabinet-trends'];
  const tab = routes.indexOf(path);

  return (
    <div className="menu-navigation">
      <BottomNavigation
        value={tab}
        onChange={(event, newValue) => {
          history.push(routes[newValue]);
        }}
        showLabels
        className="content"
      >
        <BottomNavigationAction
          label="Home"
          icon={<AllInbox className="inbox-icon" />}
        />
        <BottomNavigationAction
          label="Trendings"
          icon={<Whatshot className="trend-icon" />}
        />
      </BottomNavigation>
    </div>
  );
}
