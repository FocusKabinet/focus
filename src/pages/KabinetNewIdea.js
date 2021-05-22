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
  IconButton,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Collapse,
} from "@material-ui/core";
import { AddCircle, Delete, RemoveCircle } from "@material-ui/icons";
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
  const [todoField, changeTodoField] = React.useState("");

  const [form, updateForm] = React.useState({
    title: "",
    emoji: defaultEmoji,
    keywords: [],
    description: "",
    reminder: null,
    imageUpload: null,
    imageURL: "",
    checklist: [],
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

  const addToChecklist = (e) => {
    if (e === "add" || (e.keyCode === 13 && !!todoField)) {
      changeTodoField("");

      return updateForm({
        ...form,
        checklist: [...form.checklist, { label: todoField, checked: false }],
      });
    }
  };

  const handleUpdateCheckList = (arr) => {
    return updateForm({
      ...form,
      checklist: [...arr],
    });
  };

  const handleChangeKeywords = (e) => {
    if ((e === "add" || e.keyCode === 13) && !!keywordField) {
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
      checklist: [],
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
        <Grid container spacing={2} direction="column">
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
                    <IconButton
                      onClick={handleTogglePicker}
                      color="primary"
                      size="small"
                      variant="contained"
                    >
                      {form.emoji.emoji}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <EmojiPicker
            id="emoji"
            open={pickerDialog}
            onEmojiClick={onEmojiClick}
            handleClose={handleTogglePicker}
          />
          <Grid item>
            <TextField
              fullWidth
              id="description"
              multiline
              rows={3}
              className="title-field"
              placeholder="Describe your idea"
              variant="outlined"
              size="small"
              value={form.description}
              onChange={handleUpdateForm}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1" gutterBottom>
              Create a checklist for this idea
            </Typography>
            <TextField
              fullWidth
              className="title-field"
              label="Add a to-do"
              variant="outlined"
              size="small"
              value={todoField}
              onKeyDown={addToChecklist}
              onChange={(e) => changeTodoField(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) => addToChecklist("add")}
                      color="primary"
                      disabled={!todoField}
                    >
                      <AddCircle />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!!form.checklist.length && (
              <CheckList
                list={form.checklist}
                handleUpdate={handleUpdateCheckList}
              />
            )}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleChangeKeywords("add")}
                      color="primary"
                      disabled={!keywordField}
                    >
                      <AddCircle />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!!form.keywords.length && (
              <KeywordTags
                id="keywords"
                keywords={form.keywords}
                handleChange={handleChangeKeywords}
              />
            )}
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

function CheckList(props) {
  const { handleUpdate, list } = props;
  const [checkListExpanded, updateChecklistExpanded] = React.useState([]);

  const handleUpdateCheckList = (e) => {
    let newList = list;
    const itemId = Number(e.target.id);
    if (e.target.name === "checkbox") {
      newList[itemId].checked = !list[itemId].checked;
    }
    if (e.target.name === "delete") {
      newList = newList.filter((item, idx) => {
        return idx !== itemId;
      });
    }

    handleUpdate([...newList]);
  };

  const handleToggleExpand = (e, key) => {
    if (e.target.name !== "checkbox") {
      checkListExpanded.indexOf(key) > -1
        ? updateChecklistExpanded(
            checkListExpanded.filter((item) => item !== key)
          )
        : updateChecklistExpanded([...checkListExpanded, key]);
    }
  };

  return (
    <Box className="keyword-container">
      <List>
        {list.map((todo, idx) => {
          return (
            <Paper
              className="checklist-item"
              onClick={(e) => {
                e.target.id = idx;
                handleToggleExpand(e, todo.label);
              }}
            >
              <ListItem key={todo.label} dense button>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={todo.checked}
                    // tabIndex={-1}
                    disableRipple
                    id={String(idx)}
                    name="checkbox"
                    onChange={handleUpdateCheckList}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography noWrap>{todo.label}</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.target.id = idx;
                      e.target.name = "delete";
                      handleToggleExpand(e, todo.label);
                      handleUpdateCheckList(e);
                    }}
                    size="small"
                  >
                    <RemoveCircle className="delete-list-item" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse
                in={checkListExpanded.includes(todo.label)}
                timeout="auto"
                unmountOnExit
              >
                <ListItem style={{ "overflow-wrap": "break-word" }}>
                  <ListItemText>{todo.label}</ListItemText>
                </ListItem>
              </Collapse>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
}
