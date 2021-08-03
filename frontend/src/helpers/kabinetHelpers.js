import { firestore, storageRef, auth, authObject } from '../app/firebase';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';

export async function fetchCards() {
  let cards = [];
  try {
    store.dispatch(setLoadingState(true));
    const cardsRef = firestore.collection('kabinet');
    const cardsSnapshot = await cardsRef
      .where('private', '==', false)
      .orderBy('createdAt', 'desc')
      .get();
    cardsSnapshot.forEach((doc) => {
      cards.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setLoadingState(false));
  } catch (e) {
    store.dispatch(setLoadingState(false));
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to load feed!',
        severity: 'error',
      })
    );
  }
  return cards;
}

export async function fetchCard(id) {
  let card = {};
  try {
    store.dispatch(setLoadingState(true));
    const cardRef = firestore.collection('kabinet').doc(id);
    const cardSnapshot = await cardRef.get();
    card = cardSnapshot.data();
    store.dispatch(setLoadingState(false));
  } catch (e) {
    store.dispatch(setLoadingState(false));
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to load item!',
        severity: 'error',
      })
    );
  }

  return card;
}

export async function fetchUserCards(uid) {
  let cards = [];
  try {
    store.dispatch(setLoadingState(true));
    const userId = uid ? uid : store.getState().kabinet_user.uid;
    const cardsRef = !uid
      ? firestore
          .collection('kabinet')
          .orderBy('createdAt', 'desc')
          .where('ownerId', '==', userId)
      : firestore
          .collection('kabinet')
          .where('private', '==', false)
          .where('ownerId', '==', userId)
          .orderBy('createdAt', 'desc');

    const cardsSnapshot = await cardsRef.get();
    cardsSnapshot.forEach((doc) => {
      cards.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setLoadingState(false));
  } catch (e) {
    store.dispatch(setLoadingState(false));
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to load feed!',
        severity: 'error',
      })
    );
  }
  return cards;
}

export async function fetchBookmarkedCards() {
  let cards = [];
  const { kabinet_bookmarks: bookmarks } = store.getState();

  if (!!bookmarks.length) {
    try {
      store.dispatch(setLoadingState(true));
      const cardsRef = firestore.collection('kabinet');
      const cardsSnapshot = await cardsRef
        .where('private', '==', false)
        .where('id', 'in', bookmarks)
        .orderBy('createdAt', 'desc')
        .get();
      cardsSnapshot.forEach((doc) => {
        cards.push({ ...doc.data() });
      });
      store.dispatch(setLoadingState(false));
    } catch (e) {
      store.dispatch(setLoadingState(false));
      console.error(e);
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Failed to load feed!',
          severity: 'error',
        })
      );
    }
  }

  return cards;
}

export async function addCard(data, img) {
  store.dispatch(setLoadingState(true));
  try {
    const user = store.getState().kabinet_user;

    data.ownerId = user.uid;
    data.ownerName = user.displayName;
    data.likes = [];
    const snapshot = await firestore.collection('kabinet').add(data);
    const id = snapshot.id;
    await snapshot.update({ id: snapshot.id });

    if (img) {
      const url = await uploadImage(id, img);
      const res = await snapshot.update({ imageURL: url });
    }
    store.dispatch(setLoadingState(false));
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'New card added successfully!',
        severity: 'success',
      })
    );
  } catch (e) {
    store.dispatch(setLoadingState(false));
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to add new card!',
        severity: 'error',
      })
    );
    return 'error';
  }
}

export async function updateCard(id, data, img) {
  try {
    store.dispatch(setLoadingState(true));
    const cardsRef = firestore.collection('kabinet').doc(id);
    const url = img && (await uploadImage(id, img));

    if (url) {
      await cardsRef.update({ ...data, imageURL: url });
    } else {
      await cardsRef.update(data);
      const shouldDelete = (await doesImageExist(id)) !== data.imageURL;
      shouldDelete && deleteImage(id);
    }
    store.dispatch(setLoadingState(false));
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Card updated successfully!',
        severity: 'success',
      })
    );
  } catch (e) {
    store.dispatch(setLoadingState(false));
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to update card!',
        severity: 'error',
      })
    );
    return 'error';
  }
}

export async function deleteCard(id) {
  store.dispatch(setLoadingState(true));
  try {
    deleteImage(id);
    await firestore.collection('kabinet').doc(id).delete();
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Card deleted successfully!',
        severity: 'success',
      })
    );
  } catch (e) {
    console.error(e);
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Failed to delete card!',
        severity: 'error',
      })
    );
  }
  store.dispatch(setLoadingState(false));
}

async function uploadImage(id, img) {
  deleteImage(id);
  if (!img) return;
  let imageURL = '';
  const metadata = {
    name: id,
  };
  await storageRef
    .child(`kabinet-img/${id}`)
    .put(img, metadata)
    .then(async (snapshot) => {
      await snapshot.ref.getDownloadURL().then((url) => {
        imageURL = url;
      });
    })
    .catch((e) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Failed to upload image!',
          severity: 'error',
        })
      );
    });
  return imageURL;
}

async function deleteImage(id) {
  const shouldDelete = await doesImageExist(id);
  try {
    shouldDelete &&
      (await storageRef
        .child(`kabinet-img/${id}`)
        .delete()
        .then()
        .catch((e) => {}));
  } catch {
    return;
  }
}

async function doesImageExist(id) {
  let url = '';
  try {
    await storageRef
      .child(`kabinet-img/${id}`)
      .getDownloadURL()
      .then((resUrl) => (url = resUrl))
      .catch();
  } catch {}
  return url;
}
