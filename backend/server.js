const express = require('express');
const googleTrends = require('google-trends-api');
var cors = require('cors');
const app = express();
const path = require('path');
const axios = require('axios');
require('dotenv').config();

app.use(cors());

app.get('/api/lookup', async (req, res) => {
  const { ip } = req.params;
  await axios
    .get(
      `https://api.ipgeolocation.io/ipgeo?fields=country_code2,country_name`,
      {
        params: {
          apiKey: process.env.REACT_APP_IP_LOOKUP_API_KEY,
          ip,
        },
      }
    )
    .then((response) => {
      const { country_code2, country_name } = response.data;
      res.send({ countryCode: country_code2, country: country_name });
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/api/headlines', async (req, res) => {
  let data = {};
  const { page, pageSize, countryCode: country } = req.query;
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;
  await axios
    .get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country,
        pageSize,
        page,
        apiKey,
      },
    })
    .then((response) => {
      data = response.data;
      res.send(data);
    })
    .catch((e) => {
      res
        .status(400)
        .send({ status: 'error', message: 'Headlines API failure!', data: {} });
    });
});

app.get('/api/trends/:countryCode', async (req, res) => {
  await googleTrends
    .dailyTrends({
      geo: req.params.countryCode,
    })
    .then((result) => {
      res.send(JSON.parse(result).default.trendingSearchesDays);
    })
    .catch((e) =>
      res
        .status(400)
        .send({ status: 'error', message: 'Google trends API failure!' })
    );
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
