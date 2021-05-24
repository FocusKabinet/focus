import data from './kabinetMockData';

export function fetchCards() {
  return data;
}

export function fetchCard(id) {
  return data.find((item) => item.id === id);
}
