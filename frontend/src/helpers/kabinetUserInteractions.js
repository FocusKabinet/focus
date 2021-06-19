import { firestore, auth, authObject } from '../app/firebase';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';
import { initBookmarks, setBookmarks } from '../redux/actions/kabinetBookmarks';

export const getUserBookmark = async (uid) => {
  const res = await firestore
    .collection('kabinet-users')
    .doc(uid)
    .get()
    .then((res) => {
      const bookmarks = res.data().bookmarks;
      store.dispatch(initBookmarks(bookmarks));
    })
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        }),
        initBookmarks([])
      );
    });
};

export const toggleBookmark = async (cardId) => {
  const { uid } = auth.currentUser;

  store.dispatch(setBookmarks(cardId));
  const { kabinet_bookmarks: bookmarks } = store.getState();

  const res = await firestore
    .collection('kabinet-users')
    .doc(uid)
    .update({ bookmarks })
    .then((res) => {})
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
    });
  return res;
};

export const toggleLike = async (cardId, likesArray) => {
  const res = await firestore
    .collection('kabinet')
    .doc(cardId)
    .update({ likes: likesArray })
    .then((res) => {})
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
    });
  return res;
};
