import { notificationTypes as Types } from '../actions/notification';

const notificationReducer = (
  state = {
    severity: 'info',
    message: 'notification message unset',
    status: '',
    open: false,
  },
  action
) => {
  switch (action.type) {
    case Types.SET_NOTIFICATION_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default notificationReducer;
