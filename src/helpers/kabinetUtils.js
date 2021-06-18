import axios from 'axios';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';
import publicIP from 'public-ip';

export async function getCurrentCountry() {
  store.dispatch(setLoadingState(true));

  let code = { countryCode: 'CA', country: 'Canada' };
  const ip = await publicIP.v4();
  await axios
    .get('/api/lookup', { params: { ip } })
    .then((res) => {
      code = res.data;
    })
    .catch((e) => {
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Failed to get location! Defaulted to Canada.',
          severity: 'warning',
        })
      );
    });
  store.dispatch(setLoadingState(false));
  return code;
}

export async function getGoogleTrends(countryCode) {
  store.dispatch(setLoadingState(true));
  let data = {};
  await axios('/api/trends/' + countryCode)
    .then((response) => (data = response.data[0]))
    .catch((e) => {
      console.error(e);
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Failed to fetch Google Trends!',
          severity: 'warning',
        })
      );
    });
  store.dispatch(setLoadingState(false));
  return data;
}

export async function getHeadLines(countryCode, page = 1, pageSize = 20) {
  store.dispatch(setLoadingState(true));
  let data = {};
  await axios
    .get('/api/headlines', {
      params: {
        countryCode,
        page,
        pageSize,
      },
    })
    .then((res) => {
      data = res.data;
      data['hasMore'] = data.totalResults - page * pageSize > 0;
      data['page'] = page;
      data['pageSize'] = pageSize;
    })
    .catch((e) => {
      console.error('News API error occured', e);
      store.dispatch(
        setNotificationState({
          open: true,
          message: 'Failed to fetch headlines!',
          severity: 'warning',
        })
      );
    });
  store.dispatch(setLoadingState(false));
  return data;
}
