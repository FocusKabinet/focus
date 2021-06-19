import DateFnsAdapter from '@date-io/date-fns';
const dateFns = new DateFnsAdapter();

export const getVisibleCards = (
  cards = [],
  { text, date, sortByDate, keyword }
) => {
  return cards
    .filter((card) => {
      let textMatch =
        text === '' || card.title.toLowerCase().includes(text.toLowerCase());
      // const keywordMatch = keyword === '' || card.keywords.includes(keyword);
      // if (card.description) {
      //   textMatch = card.description.toLowerCase().includes(text.toLowerCase());
      // }
      // return textMatch && keywordMatch;
      let timeMatch = true;
      if (date) {
        const period =
          dateFns.date(card.createdAt).getMonth() +
          dateFns.date(card.createdAt).getFullYear();
        const filterPeriod = date.getMonth() + date.getFullYear();
        timeMatch = period === filterPeriod;
      }

      return textMatch && timeMatch;
    })
    .sort((a, b) => {
      if (sortByDate === 'asc') return a.createdAt < b.createdAt ? 1 : -1;
      else return 0;
    });
};
