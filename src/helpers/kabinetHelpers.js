import data from './kabinetMockData';
import { firestore, storageRef } from '../app/firebase';
// import googleTrendsAPI from 'google-trends-api';
import axios from 'axios';

export async function fetchCards() {
  let cards = [];
  const cardsRef = firestore.collection('kabinet');
  const cardsSnapshot = await cardsRef.orderBy('createdAt', 'desc').get();
  cardsSnapshot.forEach((doc) => {
    cards.push({ ...doc.data(), id: doc.id });
  });
  return cards;
}

export async function fetchCard(id) {
  let card = {};
  const cardRef = firestore.collection('kabinet').doc(id);
  const cardSnapshot = await cardRef.get();
  card = cardSnapshot.data();
  return card;
}

export async function addCard(data, img) {
  const snapshot = await firestore.collection('kabinet').add(data);
  const id = snapshot.id;

  if (img) {
    const url = await uploadImage(id, img);
    const res = await snapshot.update({ imageURL: url });
    console.log(url);
  }
  return snapshot;
}

export async function updateCard(id, data, img) {
  const cardsRef = firestore.collection('kabinet').doc(id);
  const url = await uploadImage(id, img);
  const res = url
    ? await cardsRef.update({ ...data, imageURL: url })
    : await cardsRef.update(data);
  return res;
}

export async function deleteCard(id) {
  deleteImage(id);
  return await firestore.collection('kabinet').doc(id).delete();
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
  return code;
}

export async function getGoogleTrends(countryCode) {
  let data = {};
  await axios('http://localhost:5000/api/' + countryCode)
    .then((response) => (data = response.data[0]))
    .catch((e) => console.error(e));
  return data;
}

export async function getHeadLines(countryCode, page = 1, pageSize = 20) {
  let data = {};
  await axios(
    `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  )
    .then((res) => (data = res.data))
    .catch((e) => console.error('News API error occured', e));
  data['hasMore'] = data.totalResults - page * pageSize > 0;
  data['page'] = page;
  data['pageSize'] = pageSize;

  return data;
}
