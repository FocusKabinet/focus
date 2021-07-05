import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import './styles/TopBar.scss';
import {
  AccountBox,
  AccountCircle,
  Cancel,
  CollectionsBookmark,
  ExitToApp,
  Language,
  GitHub,
} from '@material-ui/icons';
import { logout } from '../../helpers/kabinetProfile';
import GoBackButton from './GoBackButton';

export default function TopBar(props) {
  const {
    user,
    history,
    match: { path },
  } = props;
  const [showDrawer, setDrawer] = React.useState(false);

  return (
    <div className="top-bar">
      <AppBar color="inherit" className="app-bar">
        <Toolbar variant="dense">
          <div className="top-bar-content">
            {isChildrenPath(path) ? (
              <GoBackButton {...props} />
            ) : (
              <div
                className="top-bar-title"
                onClick={() => history.push('/kabinet-world')}
              >
                <Language />
                <Typography variant="h6">kabinet</Typography>
              </div>
            )}
            <div className="top-bar-buttons">
              {user ? (
                <>
                  <IconButton
                    className="profile-button"
                    onClick={() => setDrawer(true)}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Drawer
                    anchor="bottom"
                    open={showDrawer}
                    onClose={() => setDrawer(false)}
                  >
                    <List>
                      <ListItem
                        button
                        onClick={() => history.push('/kabinet-bookmarked')}
                      >
                        <ListItemIcon>
                          <CollectionsBookmark className="bookmarks-icon" />
                        </ListItemIcon>
                        <ListItemText>Bookmarks</ListItemText>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          setDrawer(false);
                          history.push('/kabinet-profile');
                        }}
                      >
                        <ListItemIcon>
                          <AccountBox color="primary" />
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          logout();
                          history.push('/kabinet-login');
                        }}
                      >
                        <ListItemIcon>
                          <ExitToApp color="secondary" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          window.open(
                            'https://github.com/FocusKabinet/focus/tree/kabinet-beta-v2',
                            '_blank'
                          );
                        }}
                      >
                        <ListItemIcon>
                          <GitHub fontSize="small" style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText>Learn More (GitHub)</ListItemText>
                      </ListItem>
                      <Divider />
                      <ListItem button onClick={() => setDrawer(false)}>
                        <ListItemIcon>
                          <Cancel />
                        </ListItemIcon>
                        <ListItemText>Cancel</ListItemText>
                      </ListItem>
                    </List>
                  </Drawer>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => history.push('/kabinet-register')}
                    disabled={path === '/kabinet-register'}
                  >
                    Register
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => history.push('/kabinet-login')}
                    disabled={path === '/kabinet-login'}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function isChildrenPath(currentPath) {
  const childrenPaths = [
    'kabinet-post',
    'kabinet-user',
    'kabinet-bookmarked',
    'kabinet-profile',
  ];
  let isChildren = childrenPaths.includes(currentPath.split('/')[1]);
  return isChildren;
}
