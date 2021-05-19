import React from 'react';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Dialog,
  Chip,
  Box,
} from '@material-ui/core';
import './styles/KabinetNewIdea.scss';
import { DateTimePicker } from '@material-ui/pickers';
import Picker from 'emoji-picker-react';

export default function KabinetNewIdea(props) {
  const defaultEmoji = {
    activeSkinTone: 'neutral',
    emoji: '💡',
    names: (2)[('electric light bulb', 'bulb')],
    originalUnified: '1f4a1',
    unified: '1f4a1',
  };
  const [chosenEmoji, setChosenEmoji] = React.useState(defaultEmoji);
  const [pickerDialog, pickerDialogToggle] = React.useState(false);
  const [keywords, editKeywords] = React.useState([]);
  const [keywordField, changeKeywordField] = React.useState('');

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
  };

  const handleTogglePicker = () => {
    pickerDialogToggle(!pickerDialog);
  };

  const handleChangeKeywords = (e) => {
    if (e.keyCode === 13 && !!keywordField) {
      if (!keywords.find((item) => item === keywordField)) {
        editKeywords([...keywords, keywordField]);
      }
      changeKeywordField('');
      return;
    } else {
      editKeywords(keywords.filter((key, idx) => idx !== e));
    }
  };
  return (
    <div>
      <Typography className="list-title" align="left" variant="h5" gutterBottom>
        What are you thinking about?
      </Typography>

      <Paper className="new-idea-form">
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              fullWidth
              className="title-field"
              label="A short title for your idea"
              variant="outlined"
              size="small"
              // value={search}
              // onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <span>{chosenEmoji.emoji}</span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              className="emoji-selector"
              onClick={handleTogglePicker}
            >
              select emoji
            </Button>
            <EmojiPicker
              open={pickerDialog}
              onEmojiClick={onEmojiClick}
              handleClose={handleTogglePicker}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              className="title-field"
              label="Any keyword?"
              variant="outlined"
              size="small"
              value={keywordField}
              onKeyDown={handleChangeKeywords}
              // value={search}
              onChange={(e) => changeKeywordField(e.target.value)}
            />
          </Grid>
          {!!keywords.length && (
            <Grid item>
              <KeywordTags
                keywords={keywords}
                handleChange={handleChangeKeywords}
              />
            </Grid>
          )}
          <Grid item>
            <TextField
              fullWidth
              multiline
              rows={5}
              className="title-field"
              placeholder="Describe your idea, set goals, to-do list, more details, etc"
              variant="outlined"
              size="small"
              // value={search}
              // onChange={handleSearch}
            />
          </Grid>
          <Grid item>
            <DateTimePicker label="Set reminder ?" />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

function EmojiPicker(props) {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <Picker onEmojiClick={props.onEmojiClick} />
    </Dialog>
  );
}

function KeywordTags(props) {
  return (
    <Box className="keyword-container">
      {props.keywords.map((key, idx) => (
        <Chip
          className="tag"
          label={key}
          onDelete={() => props.handleChange(idx)}
          color="primary"
        />
      ))}
    </Box>
  );
}
