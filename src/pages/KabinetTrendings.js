import GoogleTrends from '../components/kabinet/GoogleTrends';
import React from 'react';
import {
  getCurrentCountry,
  getGoogleTrends,
  getHeadLines,
} from '../helpers/kabinetHelpers';
import News from '../components/kabinet/News';
import ScrollToTop from '../components/kabinet/ScrollToTop';

export default function KabinetTrendings(props) {
  const [trends, updateTrends] = React.useState({});
  const [headlinesData, updateHeadlines] = React.useState({});
  const [countryObj, updateCountryObj] = React.useState({});

  async function fetchData() {
    const countryObjData = await getCurrentCountry();
    updateCountryObj(countryObjData);
    console.log(countryObjData);
    const trendsData = await getGoogleTrends(countryObjData.countryCode);
    updateTrends(trendsData);
    const headlinesRes = await getHeadLines(countryObjData.countryCode);
    updateHeadlines(headlinesRes);
  }

  async function getNextPageHeadlines() {
    const nextPage = headlinesData.page + 1;
    const headlinesRes = await getHeadLines(countryObj.countryCode, nextPage);
    headlinesRes.articles = [
      ...headlinesData.articles,
      ...headlinesRes.articles,
    ];
    updateHeadlines(headlinesRes);

    console.log(headlinesRes);
  }

  React.useEffect(() => {
    fetchData();
  }, [props]);

  return (
    <>
      <ScrollToTop />
      <GoogleTrends {...trends} countryCode={countryObj.countryCode} />
      <News
        {...headlinesData}
        country={countryObj.country}
        fetchMoreData={getNextPageHeadlines}
      />
    </>
  );
}
