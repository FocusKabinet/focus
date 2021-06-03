import data from './kabinetMockData';
import { firestore, storageRef } from '../app/firebase';
import axios from 'axios';
import { projectStore as store } from '../redux/store';
import { setLoadingState } from '../redux/actions/loading';

export async function fetchCards() {
  store.dispatch(setLoadingState(true));
  let cards = [];
  const cardsRef = firestore.collection('kabinet');
  const cardsSnapshot = await cardsRef.orderBy('createdAt', 'desc').get();
  cardsSnapshot.forEach((doc) => {
    cards.push({ ...doc.data(), id: doc.id });
  });
  store.dispatch(setLoadingState(false));

  return cards;
}

export async function fetchCard(id) {
  store.dispatch(setLoadingState(true));
  let card = {};
  const cardRef = firestore.collection('kabinet').doc(id);
  const cardSnapshot = await cardRef.get();
  card = cardSnapshot.data();
  store.dispatch(setLoadingState(false));
  return card;
}

export async function addCard(data, img) {
  store.dispatch(setLoadingState(true));
  const snapshot = await firestore.collection('kabinet').add(data);
  const id = snapshot.id;

  if (img) {
    const url = await uploadImage(id, img);
    const res = await snapshot.update({ imageURL: url });
    console.log(url);
  }
  store.dispatch(setLoadingState(false));
  return snapshot;
}

export async function updateCard(id, data, img) {
  store.dispatch(setLoadingState(true));
  const cardsRef = firestore.collection('kabinet').doc(id);
  const url = await uploadImage(id, img);
  const res = url
    ? await cardsRef.update({ ...data, imageURL: url })
    : await cardsRef.update(data);
  store.dispatch(setLoadingState(false));
  return res;
}

export async function deleteCard(id) {
  store.dispatch(setLoadingState(true));
  deleteImage(id);
  await firestore.collection('kabinet').doc(id).delete();
  store.dispatch(setLoadingState(false));
  return;
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
      console.log('image uploaded successfully');
      await snapshot.ref.getDownloadURL().then((url) => {
        imageURL = url;
        console.log(imageURL);
      });
    });
  return imageURL;
}

async function deleteImage(id) {
  const imgRef = await storageRef
    .child(`kabinet-img/${id}`)
    .delete()
    .then(() => console.log('image overwritten successfuly'))
    .catch((e) => {
      console.warn(e);
    });
}

export async function getCurrentCountry() {
  store.dispatch(setLoadingState(true));

  let code = { countryCode: 'CA', country: 'Canada' };
  await axios
    .get('http://ip-api.com/json/?fields=countryCode,country')
    .then((res) => {
      const { countryCode, country } = res.data;
      code = { countryCode, country };
    })
    .catch((e) =>
      console.warn(
        'Cannot get location. Most likely due to AdBlock. Defaulted to US\n',
        e
      )
    );
  store.dispatch(setLoadingState(false));
  return code;
}

export async function getGoogleTrends(countryCode) {
  store.dispatch(setLoadingState(true));
  let data = {};
  await axios('http://localhost:5000/api/' + countryCode)
    .then((response) => (data = response.data[0]))
    .catch((e) => console.error(e));
  store.dispatch(setLoadingState(false));
  return data;
}

export async function getHeadLines(countryCode, page = 1, pageSize = 20) {
  store.dispatch(setLoadingState(true));
  let data = {};
  await axios(
    `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  )
    .then((res) => (data = res.data))
    .catch((e) => console.error('News API error occured', e));
  data['hasMore'] = data.totalResults - page * pageSize > 0;
  data['page'] = page;
  data['pageSize'] = pageSize;

  store.dispatch(setLoadingState(false));
  return data;
}
