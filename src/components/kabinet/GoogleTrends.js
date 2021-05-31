import React from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  CardHeader,
} from '@material-ui/core';
import {
  Close,
  ExpandMore,
  OpenInNew,
  Public,
  TrendingUp,
  Whatshot,
} from '@material-ui/icons';
import './styles/GoogleTrends.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import HE from 'he';

export default function GoogleTrends(props) {
  const { formattedDate, trendingSearches = [], countryCode } = props;
  return (
    <Paper className="trends-container">
      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Public color="primary" className="whatshot-icon" />
          <Typography>{`Trending on Google (${countryCode})`}</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <List className="list-container" disablePadding>
            {trendingSearches.length &&
              trendingSearches.map((item, idx) => (
                <TrendItem
                  key={idx}
                  id={idx}
                  title={item.title.query}
                  articles={item.articles}
                />
              ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}

function TrendItem(props) {
  const { id, title, articles } = props;
  const [dialogOpen, toggleDialog] = React.useState(false);

  return (
    <>
      <ListItem dense button key={id} onClick={() => toggleDialog(true)}>
        <ListItemIcon>
          <TrendingUp className="trendup-icon" />
        </ListItemIcon>
        <ListItemText className="trend-title">{title}</ListItemText>
      </ListItem>
      <ArticleDialog
        articles={articles}
        open={dialogOpen}
        handleClose={() => toggleDialog(false)}
        trendTitle={title}
      />
    </>
  );
}

function ArticleDialog(props) {
  const { trendTitle, articles, handleClose, open } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle className="dialog-title">
        Latest news for {trendTitle}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Grid
          spacing={2}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          {articles.map((article, id) => {
            const { title, image, snippet, timeAgo, url } = article;
            return (
              <Grid item key={id + '-article'}>
                <Card>
                  <CardHeader title={image && image.source} />
                  <CardActionArea onClick={() => window.open(url, '_blank')}>
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {/* <CardMedia
                          component="img"
                          height="100"
                          image={image && image.imageUrl}
                        /> */}
                        {HE.decode(title)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        gutterBottom
                      >
                        {HE.decode(snippet)}
                      </Typography>
                      <div className="dialog-content-bottom">
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {timeAgo}
                        </Typography>
                        <OpenInNew fontSize="small" />
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function sortArticles(articles) {
  return articles.sort((a, b) => {
    if (a.timeAgo > b.timeAgo) return -1;
    if (a.timeAgo < b.timeAgo) return 1;
    return 0;
  });
}
