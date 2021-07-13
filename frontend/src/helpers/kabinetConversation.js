import { firestore, storageRef, auth, authObject } from '../app/firebase';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';
