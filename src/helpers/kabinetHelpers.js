import data from './kabinetMockData';
import { firestore } from '../app/firebase';

export async function fetchCards() {
  let cards = [];
  const cardsRef = firestore.collection('kabinet');
  const cardsSnapshot = await cardsRef.get();
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

export async function addCard(data) {
  const cardsRef = firestore.collection('kabinet').doc();
  const res = await cardsRef.set(data);
  return res;
}

export async function updateCard(id, data) {
  const cardsRef = firestore.collection('kabinet').doc(id);
  const res = await cardsRef.update(data);
  return res;
}

export async function deleteCard(id) {
  return await firestore.collection('kabinet').doc(id).delete();
}
