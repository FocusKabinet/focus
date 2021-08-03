import { firestore, auth, firestoreObj } from '../app/firebase';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';
import { initBookmarks, setBookmarks } from '../redux/actions/kabinetBookmarks';
import { v4 as uuid } from 'uuid';

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

export const toggleLike = async (cardId, userId, remove = false) => {
  let error = null;
  await firestore
    .collection('kabinet')
    .doc(cardId)
    .update({
      likes: !remove
        ? firestoreObj.FieldValue.arrayUnion(userId)
        : firestoreObj.FieldValue.arrayRemove(userId),
    })
    .then((res) => {})
    .catch((err) => {
      error = true;
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
    });
  return error;
};

export const postComment = async (cardId, commentObj) => {
  commentObj['id'] = uuid();
  let res = null;
  await firestore
    .collection('kabinet-convo')
    .doc(cardId)
    .collection('comments')
    .doc(commentObj['id'])
    .set({ ...commentObj, cardId }, { merge: true })
    .then((res) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Your comment has been posted successfully!',
          severity: 'success',
        })
      );
    })
    .catch((err) => {
      res = true;
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

export const loadComments = (cardId, callback) => {
  const unsubscribe = firestore
    .collection('kabinet-convo')
    .doc(cardId)
    .collection('comments')
    .onSnapshot(
      (snapshot) => {
        let arr = [];
        snapshot.forEach(async (doc) => {
          const data = doc.data();
          arr.push(data);
        });
        callback(arr);
      },
      (err) => {
        store.dispatch(
          setNotificationState({
            open: true,
            message: err.message,
            severity: 'error',
          })
        );
      }
    );
  return unsubscribe;
};

export const getReplies = (commentObj, callback) => {
  const { cardId, id } = commentObj;
  const unsubscribe = firestore
    .collection('kabinet-convo')
    .doc(cardId)
    .collection('comments')
    .doc(id)
    .collection('replies')
    .onSnapshot((snapshot) => {
      let arr = [];
      snapshot.forEach(async (doc) => {
        const data = doc.data();
        arr.push(data);
      });
      callback(arr);
    });
  return unsubscribe;
};

export const postReply = async (replyObj) => {
  replyObj['id'] = uuid();
  const { id, commentId, cardId } = replyObj;
  let res = null;
  await firestore
    .collection('kabinet-convo')
    .doc(cardId)
    .collection('comments')
    .doc(commentId)
    .collection('replies')
    .doc(id)
    .set({ ...replyObj, cardId }, { merge: true })
    .then((res) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Your reply has been posted successfully!',
          severity: 'success',
        })
      );
    })
    .catch((err) => {
      res = true;
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

export function deleteComment(commentObj) {
  const { cardId, id, commentId, children: reply } = commentObj;
  try {
    if (!reply) {
      firestore
        .collection('kabinet-convo')
        .doc(cardId)
        .collection('comments')
        .doc(id)
        .delete();
    } else {
      firestore
        .collection('kabinet-convo')
        .doc(cardId)
        .collection('comments')
        .doc(commentId)
        .collection('replies')
        .doc(id)
        .delete();
    }

    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Comment deleted successfully!',
        severity: 'success',
      })
    );
  } catch (e) {
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to delete comment!',
        severity: 'error',
      })
    );
  }
}

export const toggleCommentLike = async (userId, commentObj, remove = false) => {
  const { cardId, children, id, commentId } = commentObj;
  let error = null;
  if (children)
    await firestore
      .collection('kabinet-convo')
      .doc(cardId)
      .collection('comments')
      .doc(commentId)
      .collection('replies')
      .doc(id)
      .update({
        likes: !remove
          ? firestoreObj.FieldValue.arrayUnion(userId)
          : firestoreObj.FieldValue.arrayRemove(userId),
      })
      .then((res) => {})
      .catch((err) => {
        error = err;
      });
  else
    await firestore
      .collection('kabinet-convo')
      .doc(cardId)
      .collection('comments')
      .doc(id)
      .update({
        likes: !remove
          ? firestoreObj.FieldValue.arrayUnion(userId)
          : firestoreObj.FieldValue.arrayRemove(userId),
      })
      .then((res) => {})
      .catch((err) => {
        error = err;
      });
  if (error) {
    store.dispatch(
      setNotificationState({
        open: true,
        message: error.message,
        severity: 'error',
      })
    );
  }
  return error;
};
