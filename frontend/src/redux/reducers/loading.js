import { loadingTypes as Types } from '../actions/loading';

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case Types.SET_LOADING_STATE:
      return action.payload;
    default:
      return state;
  }
};

export default loadingReducer;
