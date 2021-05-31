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
  let code = 'CA';
  await axios
    .get('http://ip-api.com/json/?fields=countryCode')
    .then((res) => {
      code = res.data.countryCode;
    })
    .catch((e) =>
      console.warn(
        'Cannot get location. Most likely due to AdBlock. Defaulted to CA\n',
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
