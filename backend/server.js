const express = require('express');
const googleTrends = require('google-trends-api');
var cors = require('cors');
const app = express();
const path = require('path');
const axios = require('axios');

app.use(cors());

app.get('/api/headlines', (req, res) => {
  let data = {};
  const { page, pageSize, countryCode, apiKey } = req.query;
  axios
    .get(
      `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`
    )
    .then((response) => {
      data = response.data;
      res.send(data);
    })
    .catch((e) => {
      res
        .status(400)
        .send({ status: 'error', message: 'Headlines API failure!' });
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
