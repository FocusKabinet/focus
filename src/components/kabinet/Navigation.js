import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core';
import { AllInbox, Public, Whatshot } from '@material-ui/icons';
import { connect } from 'react-redux';
import './styles/Navigation.scss';

function Navigation(props) {
  const {
    match: { path },
    history,
    user,
  } = props;
  const routes = ['/kabinet-world', '/kabinet-trends', '/kabinet-home'];
  const tab = routes.indexOf(path);

  return (
    <div className="menu-navigation">
      <AppBar position="sticky" elevation={24}>
        <BottomNavigation
          value={tab}
          onChange={(event, newValue) => {
            if (user || newValue === 0) history.push(routes[newValue]);
            else history.push('/kabinet-login');
          }}
          showLabels
          className="content"
        >
          <BottomNavigationAction
            label="World"
            icon={<Public className="world-icon" />}
          />
          <BottomNavigationAction
            label="Trendings"
            icon={<Whatshot className="trend-icon" />}
          />
          <BottomNavigationAction
            label="Home"
            icon={<AllInbox className="inbox-icon" />}
          />
        </BottomNavigation>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.kabinet_user,
  };
};

export default connect(mapStateToProps)(Navigation);
