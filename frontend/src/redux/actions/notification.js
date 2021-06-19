export const notificationTypes = {
  SET_NOTIFICATION_STATE: 'SET_NOTIFICATION_STATE',
};

export const setNotificationState = (newState) => {
  return {
    type: notificationTypes.SET_NOTIFICATION_STATE,
    payload: newState,
  };
};
