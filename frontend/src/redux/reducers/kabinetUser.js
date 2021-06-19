import { UserTypes as Types } from '../actions/kabinetUser';

const kabinetUserReducer = (state = null, action) => {
  switch (action.type) {
    case Types.SET_PROFILE:
      return action.payload;
    default:
      return state;
  }
};

export default kabinetUserReducer;
