import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';
import { setNotificationState } from '../../redux/actions/notification';
import { IconButton, Slide } from '@material-ui/core';
import {
  CheckCircleOutline,
  Close,
  ErrorOutline,
  InfoOutlined,
  WarningRounded,
} from '@material-ui/icons';
import './styles/Notification.scss';

function Snackbars(props) {
  const vertical = 'top';
  const horizontal = 'left';
  const config = { vertical, horizontal };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.close();
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={config}
        open={props.open}
        onClose={handleClose}
        message={Message(props)}
        autoHideDuration={2500}
        TransitionComponent={Transition}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        ContentProps={{
          className: props.severity,
          style: { display: 'flex', flexFlow: 'row' },
        }}
      />
    </div>
  );
}

function Message(props) {
  let icon = null;

  switch (props.severity) {
    case 'success':
      icon = <CheckCircleOutline />;
      break;
    case 'error':
      icon = <ErrorOutline />;
      break;
    case 'warning':
      icon = <WarningRounded />;
      break;
    default:
      icon = <InfoOutlined />;
  }

  return (
    <div className="noti-message">
      {icon}
      {props.message}
    </div>
  );
}
function Transition(props) {
  return <Slide {...props} direction="down" />;
}

const mapStateToProps = (state) => {
  return {
    ...state.notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(setNotificationState({ open: false })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbars);
