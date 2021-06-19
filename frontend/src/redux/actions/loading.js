export const loadingTypes = {
  SET_LOADING_STATE: 'SET_LOADING_STATE',
};

export const setLoadingState = (newState) => {
  return {
    type: loadingTypes.SET_LOADING_STATE,
    payload: newState,
  };
};
