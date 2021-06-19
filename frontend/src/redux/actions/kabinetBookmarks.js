export const Types = {
  SET_BOOKMARKS: 'SET_BOOKMARKS',
  INIT_BOOKMARKS: 'INIT_BOOKMARKS',
};

export const setBookmarks = (cardId) => ({
  type: Types.SET_BOOKMARKS,
  payload: cardId,
});

export const initBookmarks = (bookmarks) => ({
  type: Types.INIT_BOOKMARKS,
  payload: bookmarks,
});
