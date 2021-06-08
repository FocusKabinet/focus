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
  Grid,
  CardMedia,
} from '@material-ui/core';
import {
  Close,
  ExpandMore,
  Public,
  Schedule,
  TrendingUp,
} from '@material-ui/icons';
import './styles/GoogleTrends.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import HE from 'he';
import empty from '../../assets/empty-state-photo.png';

export default function GoogleTrends(props) {
  const { trendingSearches = [], countryCode } = props;
  return (
    <Paper className="trends-container">
      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Public color="primary" className="whatshot-icon" />
          <Typography>{`Trending on Google ${
            countryCode ? '(' + countryCode + ')' : ''
          }`}</Typography>
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
            const props = { article, id };
            return <NewArticleCard {...props} key={id} />;
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function NewArticleCard(props) {
  const { article, id } = props;
  const { title, image, timeAgo, url, source } = article;
  return (
    <Grid item key={id + '-article'}>
      <Paper
        variant="outlined"
        onClick={() => window.open(url, '_blank')}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-container">
          <div className="article-content">
            <Typography variant="subtitle2" color="textPrimary">
              {source}
            </Typography>
            <Typography gutterBottom className="article-title">
              {HE.decode(title)}
            </Typography>
            <div className="dialog-content-bottom">
              <Typography variant="body2" color="textSecondary" className="ago">
                <Schedule fontSize="small" />
                {timeAgo}
              </Typography>
            </div>
          </div>
          <div className="article-media">
            <CardMedia
              className="article-thumbnail"
              component="img"
              height="80"
              image={image && image.imageUrl}
              onError={(e) => (e.target.src = empty)}
            />
            {/* <OpenInNew fontSize="small" /> */}
          </div>
        </div>
      </Paper>
    </Grid>
  );
}

// function ArticleCard(props) {
//   const { article, id } = props;
//   const { title, image, snippet, timeAgo, url } = article;
//   return (
//     <Grid item key={id + '-article'}>
//       <Card>
//         <CardHeader title={image && image.source} />
//         <CardActionArea onClick={() => window.open(url, '_blank')}>
//           <CardContent>
//             <Typography gutterBottom variant="h6">
//               {/* <CardMedia
//                           component="img"
//                           height="100"
//                           image={image && image.imageUrl}
//                         /> */}
//               {HE.decode(title)}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="textSecondary"
//               component="p"
//               gutterBottom
//             >
//               {HE.decode(snippet)}
//             </Typography>
//             <div className="dialog-content-bottom">
//               <Typography variant="body2" color="textSecondary" component="p">
//                 {timeAgo}
//               </Typography>
//               <OpenInNew fontSize="small" />
//             </div>
//           </CardContent>
//         </CardActionArea>
//       </Card>
//     </Grid>
//   );
// }
