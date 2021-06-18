import axios from 'axios';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';
import { setNotificationState } from '../redux/actions/notification';

export async function getCurrentCountry() {
  store.dispatch(setLoadingState(true));

  let code = { countryCode: 'CA', country: 'Canada' };
  await axios
    .get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_LOOKUP_API_KEY}&fields=country_code2,country_name`
    )
    .then((res) => {
      const { country_code2, country_name } = res.data;
      code = { countryCode: country_code2, country: country_name };
    })
    .catch((e) => {
      console.warn(
        'Cannot get location. Most likely due to AdBlock. Defaulted to CA\n',
        e
      );
      store.dispatch(
        setNotificationState({
          open: true,
          message:
            'Failed to get location! Most likely due to AdBlock. Defaulted to Canada.',
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
        apiKey: process.env.REACT_APP_NEWS_API_KEY,
      },
    })
    .then((res) => (data = res.data))
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
  data['hasMore'] = data.totalResults - page * pageSize > 0;
  data['page'] = page;
  data['pageSize'] = pageSize;
  store.dispatch(setLoadingState(false));
  return data;
}
