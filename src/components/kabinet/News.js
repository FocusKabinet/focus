import React from 'react';
import empty from '../../assets/empty-state-photo.png';
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  CardHeader,
  CardMedia,
} from '@material-ui/core';
import { CheckCircle, OpenInNew } from '@material-ui/icons';
import './styles/GoogleTrends.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import HE from 'he';
import './styles/News.scss';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function News(props) {
  const {
    articles = [],
    totalResults,
    country,
    fetchMoreData,
    hasMore,
  } = props;
  const theme = useTheme();

  if (!articles.length) return null;
  return (
    <div className="news-container">
      <Typography className="title" align="left" variant="h6" gutterBottom>
        {`Headlines in ${country}: ${totalResults} articles.`}
      </Typography>
      <InfiniteScroll
        dataLength={articles.length}
        next={() => fetchMoreData()}
        hasMore={hasMore}
        endMessage={
          <span className="eof-scroll">
            <CheckCircle fontSize="small" />
            End of news feed!
          </span>
        }
        style={{ overflow: 'visible' }}
      >
        <Grid
          spacing={2}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          {articles.map((article, id) => (
            <ArticleItem article={article} key={id} id={id} />
          ))}
        </Grid>
      </InfiniteScroll>
    </div>
  );
}

function ArticleItem(props) {
  const { article, id } = props;
  const {
    title,
    urlToImage,
    description,
    publishedAt,
    url,
    author,
    source: { name },
    content,
  } = article;

  return (
    <Grid item key={id + '-article'}>
      <Card>
        <CardHeader title={`${name}`} />
        {urlToImage && (
          <CardMedia
            component="img"
            height="250"
            image={urlToImage}
            onError={(e) => (e.target.src = empty)}
          />
        )}
        <CardActionArea onClick={() => window.open(url, '_blank')}>
          <CardContent>
            <Typography gutterBottom variant="h6">
              {HE.decode(title)}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              paragraph
              gutterBottom
            >
              {description}
            </Typography>
            <div className="dialog-content-bottom">
              <Typography variant="body2" color="textPrimary" component="p">
                {new Date(publishedAt).toLocaleString()}
              </Typography>
              <OpenInNew fontSize="small" />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
