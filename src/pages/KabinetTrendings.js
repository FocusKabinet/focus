import GoogleTrends from '../components/kabinet/GoogleTrends';
import React from 'react';
import {
  getCurrentCountry,
  getGoogleTrends,
  getHeadLines,
} from '../helpers/kabinetUtils';
import News from '../components/kabinet/News';
import ScrollToTop from '../components/kabinet/ScrollToTop';
import { Typography } from '@material-ui/core';

export default function KabinetTrendings(props) {
  const [trends, updateTrends] = React.useState({});
  const [headlinesData, updateHeadlines] = React.useState({});
  const [countryObj, updateCountryObj] = React.useState({});

  async function fetchData() {
    const countryObjData = await getCurrentCountry();
    updateCountryObj(countryObjData);
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
  }

  React.useEffect(() => {
    fetchData();
  }, [props]);

  return (
    <>
      <Typography
        className="list-title"
        align="center"
        variant="h5"
        gutterBottom
      >
        {`Here is what's trending on ${trends.formattedDate}`}
      </Typography>
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
