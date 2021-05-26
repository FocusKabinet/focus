import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Collapse,
  Grid,
  Divider,
} from '@material-ui/core';
import { MoreVert, ExpandMore, Share, Favorite } from '@material-ui/icons';
import empty from '../../assets/empty-state-photo.png';
import { format } from 'date-fns';
import { KeywordTags } from './KeywordTags';
import { CheckList } from './Checklist';
import './styles/IdeaCard.scss';

export default function IdeaCard(props) {
  const {
    title,
    description,
    imageURL,
    imageUpload,
    subheader,
    createdAt,
    id,
    history,
    emojiObject,
    deleteCard,
  } = props;
  const [menu, menuToggle] = React.useState(null);
  const [expanded, expandToggle] = React.useState(false);

  const handleToggle = (e) => {
    menuToggle(Boolean(menu) ? false : e.currentTarget);
  };

  return (
    <Card className="card-idea">
      <CardHeader
        title={`${emojiObject ? emojiObject.emoji : ''} ${title}`}
        subheader={format(new Date(createdAt), 'MMM do, yyyy')}
        action={
          <>
            <IconButton
              aria-label="settings"
              className="header-settings"
              onClick={handleToggle}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={menu}
              id="simple-menu"
              keepMounted
              open={Boolean(menu)}
              onClose={handleToggle}
            >
              <MenuItem onClick={() => history.push(`/kabinet-edit/${id}`)}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deleteCard(id);
                  menuToggle(null);
                }}
                className="menu-item-delete"
                disabled={id < 5}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardMedia
        className="card-img"
        src={imageURL || imageUpload}
        component="img"
        onError={(e) => (e.target.src = empty)}
      />
      <CardActions disableSpacing>
        <IconButton disabled>
          <Favorite />
        </IconButton>
        <IconButton disabled>
          <Share />
        </IconButton>
        <IconButton
          onClick={() => expandToggle(!expanded)}
          className="expand-button"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent className="card-content">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography paragraph>{description}</Typography>
            </Grid>
            <Grid item>
              <Typography>Keywords: </Typography>
              <KeywordTags readOnly keywords={props.keywords} />
            </Grid>
            <Grid item>
              <Typography>Checklist: </Typography>
              <CheckList list={props.checklist} readOnly />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
