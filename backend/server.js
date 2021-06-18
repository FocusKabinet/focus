const express = require('express');
const googleTrends = require('google-trends-api');
var cors = require('cors');
const app = express();
const path = require('path');
app.use(cors());

app.get('/api/:countryCode', async (req, res) => {
  await googleTrends
    .dailyTrends({
      geo: req.params.countryCode,
    })
    .then((result) => {
      res.send(JSON.parse(result).default.trendingSearchesDays);
    })
    .catch((e) => res.send({ status: 'error', message: 'API failure' }));
});

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
