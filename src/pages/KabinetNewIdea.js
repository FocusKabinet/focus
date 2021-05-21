import React, { useEffect } from "react";
import empty from "../assets/empty-state-photo.png";
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
  Tabs,
  Tab,
  CardMedia,
} from "@material-ui/core";
import "./styles/KabinetNewIdea.scss";
import { DateTimePicker } from "@material-ui/pickers";
import Picker from "emoji-picker-react";
import ImageUploader from "react-images-upload";

export default function KabinetNewIdea(props) {
  const defaultEmoji = {
    activeSkinTone: "neutral",
    emoji: "💡",
    names: (2)[("electric light bulb", "bulb")],
    originalUnified: "1f4a1",
    unified: "1f4a1",
  };
  const [pickerDialog, pickerDialogToggle] = React.useState(false);
  const [keywordField, changeKeywordField] = React.useState("");
  const [form, updateForm] = React.useState({
    title: "",
    emoji: defaultEmoji,
    keywords: [],
    description: "",
    reminder: null,
    imageUpload: null,
    imageURL: "",
  });
  const [tab, setTab] = React.useState(0);
  const handleUpdateForm = (e) => {
    return updateForm({ ...form, [e.target.id]: e.target.value });
  };
  const onEmojiClick = (event, emojiObject) => {
    return updateForm({ ...form, emoji: emojiObject });
  };

  const handleTogglePicker = () => {
    pickerDialogToggle(!pickerDialog);
  };

  const handleChangeKeywords = (e) => {
    if (e.keyCode === 13 && !!keywordField) {
      if (!form.keywords.find((item) => item === keywordField)) {
        changeKeywordField("");
        return updateForm({
          ...form,
          keywords: [...form.keywords, keywordField],
        });
      }
      changeKeywordField("");
    }
    return updateForm({
      ...form,
      keywords: form.keywords.filter((key, idx) => idx !== e),
    });
  };

  const handleDateChange = (date) => {
    return updateForm({ ...form, reminder: date });
  };

  const clearForm = () => {
    return updateForm({
      title: "",
      emoji: defaultEmoji,
      keywords: [],
      description: "",
      reminder: null,
      imageUpload: null,
      imageURL: "",
    });
  };

  const handleUpload = (files) => {
    return updateForm({
      ...form,
      imageUpload: files[0],
    });
  };

  const handleSubmit = () => {
    form.createdAt = Date.now();
    tab === 0 ? (form.imageUpload = null) : (form.imageURL = "");
    console.log("Submit", form);
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
              id="title"
              value={form.title}
              onChange={handleUpdateForm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <span>{form.emoji.emoji}</span>
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
              id="emoji"
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
              onChange={(e) => changeKeywordField(e.target.value)}
            />
          </Grid>
          {!!form.keywords.length && (
            <Grid item>
              <KeywordTags
                id="keywords"
                keywords={form.keywords}
                handleChange={handleChangeKeywords}
              />
            </Grid>
          )}
          <Grid item>
            <TextField
              fullWidth
              id="description"
              multiline
              rows={5}
              className="title-field"
              placeholder="Describe your idea, set goals, to-do list, more details, etc"
              variant="outlined"
              size="small"
              value={form.description}
              onChange={handleUpdateForm}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1" gutterBottom>
              Add a photo
            </Typography>
            <Paper className="photo-tabs">
              <Tabs
                value={tab}
                onChange={(e, value) => setTab(value)}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Image URL" />
                <Tab label="Upload" />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <TextField
                  fullWidth
                  className="image_url-field"
                  placeholder="https://"
                  variant="outlined"
                  size="small"
                  id="imageURL"
                  value={form.imageURL}
                  onChange={handleUpdateForm}
                />
                {form.imageURL && (
                  <CardMedia
                    className="image-preview"
                    src={form.imageURL}
                    component="img"
                    onError={(e) => (e.target.src = empty)}
                  />
                )}
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <ImageUploader
                  withIcon={false}
                  buttonText="Browse"
                  id="imageUpload"
                  onChange={handleUpload}
                  imgExtension={[".jpg", ".gif", ".png"]}
                  maxFileSize={5242880}
                  singleImage
                  withPreview={false}
                />
                {form.imageUpload && (
                  <CardMedia
                    className="image-preview"
                    image={URL.createObjectURL(form.imageUpload)}
                  />
                )}
              </TabPanel>
            </Paper>
          </Grid>
          <Grid item>
            <DateTimePicker
              label="Set reminder ?"
              value={form.reminder}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid item>
            <div className="form-actions">
              <Button color="secondary" onClick={clearForm}>
                Clear
              </Button>
              <div className="form-actions-nav">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => props.history.goBack()}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!form.title}
                >
                  Submit
                </Button>
              </div>
            </div>
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
          key={key}
          className="tag"
          label={key}
          onDelete={() => props.handleChange(idx)}
          color="primary"
        />
      ))}
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}
