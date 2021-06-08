import { Types } from '../actions/kabinetBookmarks';

const kabinetBookmarksReducer = (state = [], action) => {
  switch (action.type) {
    case Types.INIT_BOOKMARKS:
      return action.payload || state;
    case Types.SET_BOOKMARKS:
      const cardId = action.payload;
      if (state.includes(cardId)) {
        return state.filter((item) => item !== cardId);
      } else {
        return [...state, cardId];
      }
    default:
      return state;
  }
};

export default kabinetBookmarksReducer;
