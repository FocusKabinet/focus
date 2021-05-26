const express = require('express');
const googleTrends = require('google-trends-api');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
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

app.listen(port, () => console.log(`Listening on port ${port}`));
