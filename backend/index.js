const express = require('express');
const googleTrends = require('google-trends-api');
var cors = require('cors');
const app = express();
const path = require('path');
const axios = require('axios');
const env = require('dotenv');
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  const result = env.config({
    path: path.join(__dirname, '..', 'frontend', '.env'),
  });
  if (result.error) throw result.error;
}

app.get('/api/lookup', async (req, res) => {
  const { ip } = req.query;
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
    .catch((e) =>
      res.status(400).send({
        status: 'error',
        message: 'Location API failure!',
        data: {},
        error: e,
      })
    );
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
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
