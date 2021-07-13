import React from 'react';
import {
  Card,
  IconButton,
  Typography,
  Link,
  TextField,
  Grid,
  Button,
  Drawer,
  ListItem,
  Divider,
  Collapse,
  ListItemText,
  ListItemIcon,
  List,
} from '@material-ui/core';
import {
  Send,
  Forum,
  Favorite,
  FavoriteBorder,
  Delete,
  MoreVert,
  AccountCircle,
} from '@material-ui/icons';
import './styles/Conversation.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  deleteComment,
  getReplies,
  loadComments,
  postComment,
  postReply,
  toggleCommentLike,
} from '../../helpers/kabinetUserInteractions';
import { formatDistance } from 'date-fns';

function Conversation(props) {
  const { user, cardId } = props;
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    const updateData = async (data) => {
      if (data) setComments(data);
    };
    const unsubscribe = loadComments(cardId, updateData);
    return () => {
      unsubscribe();
    };
  }, [cardId]);

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    const commentObj = {
      createdAt: Date.now(),
      content: comment,
      authorId: user.uid,
      authorDisplayName: user.displayName,
      likes: [],
      children: false,
    };
    const res = await postComment(cardId, commentObj);
    if (!res) setComment('');
  };
  return (
    <div className="conversation">
      <Typography variant="h6" gutterBottom color="inherit" className="title">
        <div className="title-content">
          <Forum />
          Conversations
        </div>
      </Typography>
      <Card className="comments-container">
        <div className="comment-action">
          <TextField
            variant="filled"
            label="Enter your comment"
            size="small"
            value={comment}
            onChange={handleComment}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  color="primary"
                  size="small"
                  disabled={!comment.length}
                  onClick={handleSubmit}
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </div>
      </Card>
      <div className="comments-area">
        <Grid container direction="column" spacing={1}>
          {comments.map((item) => (
            <Grid item key={item.id}>
              <Comment key={item.id} {...item} {...props} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

function Comment(props) {
  const {
    history,
    match,
    content,
    user,
    createdAt,
    authorId,
    authorDisplayName,
    likes,
    children,
    cardId,
    id: commentId,
  } = props;

  const [showDrawer, setDrawer] = React.useState(false);
  const [reply, setReply] = React.useState('');
  const [replies, setReplies] = React.useState([]);
  const [showOptions, setOptions] = React.useState(false);

  const handlePostReply = async (e) => {
    const replyObj = {
      createdAt: Date.now(),
      content: reply,
      authorId: user.uid,
      authorDisplayName: user.displayName,
      likes: [],
      commentId,
      children: true,
      cardId,
    };
    const res = await postReply(replyObj);
    if (!res) {
      setReply('');
      setDrawer(false);
    }
  };

  React.useEffect(() => {
    const updateData = async (data) => {
      if (data) setReplies(data);
    };
    if (!children) {
      const unsubscribe = getReplies(props, updateData);
      return () => {
        unsubscribe();
      };
    }
  }, [props, children]);

  const handleOptions = () => {
    setOptions(false);
  };

  const handleDelete = () => {
    deleteComment(props);
    handleOptions();
  };

  const handleToggleLike = () => {
    if (likes.includes(user.uid)) toggleCommentLike(user.uid, props, true);
    else toggleCommentLike(user.uid, props, false);
  };
  const isOwner = user && authorDisplayName === user.displayName;
  const commentCard = (
    <Card className="comment-container">
      <div className="comment-top">
        <Typography variant="subtitle1">
          <Link
            color="primary"
            className="publisher-link"
            underline="none"
            onClick={(e) => {
              authorDisplayName !== match.params.displayName &&
                history.push(`/kabinet-user/${authorDisplayName}`);
              e.stopPropagation();
            }}
          >
            <AccountCircle fontSize="small" />
            <Typography color={isOwner ? 'secondary' : 'primary'}>
              {authorDisplayName}
            </Typography>
          </Link>
        </Typography>
        {isOwner && (
          <IconButton
            className="menu-button"
            onClick={() => setOptions(true)}
            size="small"
          >
            <MoreVert />
          </IconButton>
        )}
      </div>
      <Typography variant="body1">{content}</Typography>
      <div className="comment-info">
        <div className="comment-actions">
          <div className="likes">
            <IconButton
              size="small"
              className="like-button"
              disabled={!user}
              onClick={handleToggleLike}
            >
              {user && likes.includes(user.uid) ? (
                <Favorite />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            {!!likes.length && (
              <Typography variant="body2">{likes.length}</Typography>
            )}
          </div>
          {!children && user && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => setDrawer(!showDrawer)}
              >
                Reply
              </Button>
            </>
          )}
        </div>
        <Typography variant="subtitle2" className="comment-date">
          {formatDistance(new Date(createdAt), new Date(), {
            addSuffix: true,
          })}
        </Typography>
      </div>
      <Collapse in={showDrawer} timeout="auto" unmountOnExit>
        <Divider />
        <div className="reply-container">
          <TextField
            autoFocus
            variant="filled"
            label="Enter your reply"
            size="small"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  color="primary"
                  size="small"
                  disabled={!reply.length}
                  onClick={handlePostReply}
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </div>
      </Collapse>
    </Card>
  );
  return (
    <>
      {children ? (
        <div className="indented-container">
          <Divider orientation="vertical" className="divider" />
          <div className="indented">{commentCard}</div>
        </div>
      ) : (
        <>
          {commentCard}
          <div style={{ marginTop: '0.5rem' }}>
            <Grid container direction="column" spacing={1}>
              {replies.map((item) => (
                <Grid item key={item.id}>
                  <Reply key={item.id} {...item} user={user} />
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}
      <Options
        open={showOptions}
        handleOptions={handleOptions}
        handleDelete={handleDelete}
      />
    </>
  );
}

function Reply(props) {
  return <Comment {...props} children />;
}
const mapStateToProps = (state) => {
  return {
    user: state.kabinet_user,
  };
};

export default connect(mapStateToProps)(withRouter(Conversation));

function Options(props) {
  return (
    <Drawer anchor="bottom" open={props.open} onClose={props.handleOptions}>
      <List>
        <ListItem button onClick={props.handleDelete}>
          <ListItemIcon>
            <Delete color="secondary" />
          </ListItemIcon>
          <ListItemText>Remove comment</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}
