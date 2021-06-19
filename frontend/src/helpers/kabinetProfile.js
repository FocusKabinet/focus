import { firestore, auth, authObject } from '../app/firebase';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';
import { setProfile } from '../redux/actions/kabinetUser';

export const login = async (email, password) => {
  let res = false;
  store.dispatch(setLoadingState(true));
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Logged in successfully!',
          severity: 'success',
        })
      );
      store.dispatch(setProfile(res.user));
    })
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
      res = { error: true, ...err };
    });
  store.dispatch(setLoadingState(false));
  return res;
};

export const register = async ({
  displayName,
  email,
  password,
  confirmPassword,
}) => {
  let res = false;
  if (confirmPassword !== password) {
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Passwords do not match!',
        severity: 'error',
      })
    );
    return true;
  }
  store.dispatch(setLoadingState(true));

  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (res) => {
      await checkDisplayName(displayName);
      await auth.currentUser.updateProfile({ displayName });
      storeUserInfo();
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Registered in successfully. Welcome to Kabinet!',
          severity: 'success',
        })
      );
    })
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
      res = { error: true, ...err };
    });
  store.dispatch(setLoadingState(false));
  return res;
};

export const logout = async () => {
  let res = false;
  store.dispatch(setLoadingState(true));
  await auth
    .signOut()
    .then((res) => {
      store.dispatch(setProfile(null));
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Logged out successfully!',
          severity: 'success',
        })
      );
    })
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
      store.dispatch(setLoadingState(false));
      res = { error: true, ...err };
    });
  store.dispatch(setLoadingState(false));
  return res;
};

export const updatePassword = async (
  currentPassword,
  password,
  confirmPassword
) => {
  let res = false;
  if (confirmPassword !== password) {
    store.dispatch(
      setNotificationState({
        open: true,
        message: 'Passwords do not match!',
        severity: 'error',
      })
    );
    return true;
  }
  store.dispatch(setLoadingState(true));

  const user = auth.currentUser;
  const credential = authObject.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );
  try {
    await auth.currentUser
      .reauthenticateWithCredential(credential)
      .then((res) =>
        auth.currentUser.updatePassword(password).then((res) => {
          store.dispatch(
            setNotificationState({
              open: true,
              message: 'Password updated successfully!',
              severity: 'success',
            })
          );
        })
      )
      .catch((err) => {
        store.dispatch(
          setNotificationState({
            open: true,
            message: err.message,
            severity: 'error',
          })
        );
        res = { error: true, ...err };
      });
  } catch (err) {
    store.dispatch(
      setNotificationState({
        open: true,
        message: err.message,
        severity: 'error',
      })
    );
    res = { error: true, ...err };
  }

  store.dispatch(setLoadingState(false));
  return res;
};

export const updateDetails = async (currentPassword, displayName, email) => {
  let res = false;
  store.dispatch(setLoadingState(true));

  const user = auth.currentUser;
  const credential = authObject.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  try {
    await auth.currentUser
      .reauthenticateWithCredential(credential)
      .then(async (res) => {
        if (displayName) {
          await checkDisplayName(displayName);
          await auth.currentUser.updateProfile({ displayName });
        }
        if (email) {
          await auth.currentUser.updateEmail(email);
        }
        storeUserInfo();
        store.dispatch(
          setNotificationState({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success',
          })
        );
      })
      .catch((err) => {
        store.dispatch(
          setNotificationState({
            open: true,
            message: err.message,
            severity: 'error',
          })
        );
        res = { error: true, ...err };
      });
  } catch (err) {
    store.dispatch(
      setNotificationState({
        open: true,
        message: err.message,
        severity: 'error',
      })
    );
    res = { error: true, ...err };
  }
  store.dispatch(setLoadingState(false));
  return res;
};

const checkDisplayName = async (displayName) => {
  let queryData = [];
  const query = await firestore
    .collection('kabinet-users')
    .where('displayName', '==', displayName)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
    });
  if (queryData.length) {
    throw new Error('Display name already exists! Please try again!');
  }
};

const storeUserInfo = () => {
  const user = auth.currentUser;
  const {
    displayName,
    email,
    phoneNumber,
    photoURL,
    providerId,
    uid,
    providerData,
    bookmarks = [],
  } = user;

  const data = {
    displayName,
    email,
    phoneNumber,
    photoURL,
    providerId,
    uid,
    providerData: { ...providerData[0] },
    bookmarks,
  };
  const res = firestore.collection('kabinet-users').doc(uid).set(data);
};

export const getPublicUser = async (uid) => {
  let userObj = {};
  store.dispatch(setLoadingState(true));
  const res = await firestore
    .collection('kabinet-users')
    .doc(uid)
    .get()
    .then((data) => (userObj = data.data()))
    .catch((err) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: err.message,
          severity: 'error',
        })
      );
    });
  store.dispatch(setLoadingState(false));
  return userObj;
};
