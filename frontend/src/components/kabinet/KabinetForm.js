import React from 'react';
import empty from '../../assets/empty-state-photo.png';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Dialog,
  Box,
  Tabs,
  Tab,
  CardMedia,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
} from '@material-ui/core';
import {
  AddCircle,
  Cancel,
  Delete,
  Save,
  Settings,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import './styles/KabinetForm.scss';
// import { DateTimePicker } from '@material-ui/pickers';
import Picker from 'emoji-picker-react';
import ImageUploader from 'react-images-upload';
import { KeywordTags } from './KeywordTags';
import { CheckList } from './Checklist';
import { addCard, fetchCard, updateCard } from '../../helpers/kabinetHelpers';

function KabinetForm(props) {
  const {
    match: {
      params: { id },
    },
    edit,
    history,
  } = props;

  const defaultEmoji = {
    activeSkinTone: 'neutral',
    emoji: '💡',
    // names: (2)[('electric light bulb', 'bulb')],
    originalUnified: '1f4a1',
    unified: '1f4a1',
  };

  const emptyForm = {
    title: '',
    emojiObject: defaultEmoji,
    keywords: [],
    description: '',
    reminder: null,
    imageUpload: null,
    imageURL: '',
    checklist: [],
    primaryKeyword: '',
    private: false,
  };

  const [pickerDialog, pickerDialogToggle] = React.useState(false);
  const [keywordField, changeKeywordField] = React.useState('');
  const [todoField, changeTodoField] = React.useState('');
  const [isDirty, changeDirty] = React.useState(false);
  const [form, updateForm] = React.useState(emptyForm);
  const [showDrawer, setDrawer] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const data = await fetchCard(id);
      if (data && Object.keys(data).length > 0)
        updateForm({
          ...data,
          primaryKeyword: data.keywords[0],
        });
    }
    if (!isDirty && edit) fetchData();
  }, [edit, isDirty, id]);

  const defaultTab = form.imageUpload ? 1 : 0;
  const [tab, setTab] = React.useState(defaultTab);

  const handleUpdateForm = (e) => {
    changeDirty(true);
    return updateForm({ ...form, [e.target.id]: e.target.value });
  };
  const onEmojiClick = (event, emojiObject) => {
    const { names, activeSkinTone = null, ...others } = emojiObject;
    changeDirty(true);
    return updateForm({ ...form, emojiObject: { ...others, activeSkinTone } });
  };

  const handleTogglePicker = () => {
    changeDirty(true);
    pickerDialogToggle(!pickerDialog);
  };

  const addToChecklist = (e) => {
    changeDirty(true);
    if (e === 'add' || (e.keyCode === 13 && !!todoField)) {
      changeTodoField('');

      return updateForm({
        ...form,
        checklist: [...form.checklist, { label: todoField, checked: false }],
      });
    }
  };

  const handleUpdateCheckList = (arr) => {
    changeDirty(true);
    return updateForm({
      ...form,
      checklist: [...arr],
    });
  };

  const handleChangeKeywords = (e) => {
    changeDirty(true);
    if ((e === 'add' || e.keyCode === 13) && !!keywordField) {
      if (!form.keywords.find((item) => item === keywordField)) {
        changeKeywordField('');
        return updateForm({
          ...form,
          keywords: [...form.keywords, keywordField],
        });
      }
      changeKeywordField('');
    }
    const newKeywords = form.keywords.filter((key, idx) => idx !== e);
    return updateForm({
      ...form,
      keywords: newKeywords,
      primaryKeyword: newKeywords.includes(form.primaryKeyword)
        ? form.primaryKeyword
        : newKeywords[0],
    });
  };

  const handleDateChange = (date) => {
    changeDirty(true);
    return updateForm({ ...form, reminder: date });
  };

  const clearForm = () => {
    setDrawer(false);
    changeDirty(false);
    return updateForm(emptyForm);
  };

  const handleUpload = (files) => {
    changeDirty(true);
    return updateForm({
      ...form,
      imageUpload: files[0],
    });
  };

  const handleSubmit = async () => {
    if (!form.createdAt) form.createdAt = Date.now();
    const file = form.imageUpload;
    delete form.imageUpload;
    const res = !edit
      ? await addCard(form, file)
      : await updateCard(id, form, file);
    res !== 'error' && history.goBack();
  };

  const handleSetPrimary = (e) => {
    e.target.id = 'primaryKeyword';
    return handleUpdateForm(e);
  };

  const saveAsDraft = () => {
    return setDrawer(false);
  };

  const toggleVisibility = (e) => {
    changeDirty(true);
    return updateForm({ ...form, private: e.target.checked });
  };

  return (
    <div>
      <Typography
        className='list-title'
        align='center'
        variant='h4'
        gutterBottom
      >
        {props.edit ? 'Refine' : 'Publish'}
      </Typography>
      <Paper className='new-idea-form'>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <TextField
              fullWidth
              className='title-field'
              label='A short title for your idea'
              variant='outlined'
              size='small'
              id='title'
              value={form.title}
              onChange={handleUpdateForm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <IconButton
                      onClick={handleTogglePicker}
                      color='primary'
                      size='small'
                      variant='contained'
                    >
                      {form.emojiObject.emoji}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>
          <EmojiPicker
            id='emoji'
            open={pickerDialog}
            onEmojiClick={onEmojiClick}
            handleClose={handleTogglePicker}
          />
          <Grid item>
            <TextField
              fullWidth
              id='description'
              multiline
              rows={5}
              className='title-field'
              label='Description'
              placeholder='Describe your idea'
              variant='outlined'
              size='small'
              value={form.description}
              onChange={handleUpdateForm}
              required
            />
          </Grid>
          <Grid item>
            <Typography variant='body1' gutterBottom>
              Create a checklist for this idea
            </Typography>
            <TextField
              fullWidth
              className='title-field'
              label='Add a to-do'
              variant='outlined'
              size='small'
              value={todoField}
              onKeyDown={addToChecklist}
              onChange={(e) => changeTodoField(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={(e) => addToChecklist('add')}
                      color='primary'
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
              className='title-field'
              label='Any keyword?'
              variant='outlined'
              size='small'
              value={keywordField}
              onKeyDown={handleChangeKeywords}
              onChange={(e) => changeKeywordField(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleChangeKeywords('add')}
                      color='primary'
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
                id='keywords'
                keywords={form.keywords}
                handleChange={handleChangeKeywords}
                setPrimary={handleSetPrimary}
                primaryKeyword={form.primaryKeyword || form.keywords[0]}
              />
            )}
          </Grid>
          <Grid item>
            <Typography variant='body1' gutterBottom>
              Add a photo
            </Typography>
            <Paper className='photo-tabs'>
              <Tabs
                value={tab}
                onChange={(e, value) => setTab(value)}
                indicatorColor='primary'
                textColor='primary'
                centered
              >
                <Tab label='Image URL' />
                <Tab label='Upload' />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <TextField
                  fullWidth
                  className='image_url-field'
                  placeholder='https://'
                  variant='outlined'
                  size='small'
                  id='imageURL'
                  value={form.imageURL || ''}
                  onChange={handleUpdateForm}
                />
                {form.imageURL && (
                  <CardMedia
                    className='image-preview'
                    src={form.imageURL}
                    component='img'
                    onError={(e) => (e.target.src = empty)}
                  />
                )}
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <ImageUploader
                  withIcon={false}
                  buttonText='Browse'
                  id='imageUpload'
                  onChange={handleUpload}
                  imgExtension={['.jpeg', '.jpg', '.gif', '.png']}
                  maxFileSize={10485760}
                  singleImage
                  withPreview={false}
                  label='Max file size: 10MB. Supports: .JPEG .GIF .PNG'
                  fileSizeError='File size is too large!'
                  fileTypeError='File is not supported!'
                />
                {form.imageUpload && (
                  <div>
                    <CardMedia
                      className='image-preview'
                      image={URL.createObjectURL(form.imageUpload)}
                    />
                    <Button
                      size='small'
                      color='primary'
                      onClick={() => updateForm({ ...form, imageUpload: null })}
                    >
                      Discard
                    </Button>
                  </div>
                )}
              </TabPanel>
            </Paper>
          </Grid>
          <Grid item>
            <div className='set-visibility'>
              <Typography>Set visibility: </Typography>
              {!!form.private ? <VisibilityOff /> : <Visibility />}
            </div>
            <div className='set-visibility'>
              <Typography>Public</Typography>
              <Switch onChange={toggleVisibility} checked={form.private} />
              <Typography>Private</Typography>
            </div>
          </Grid>

          {/* <Grid item>
            <DateTimePicker
              label="Set reminder ?"
              value={form.reminder}
              onChange={handleDateChange}
            />
          </Grid> */}
          <Grid item>
            <div className='form-actions'>
              <IconButton
                size='small'
                color='primary'
                onClick={() => setDrawer(true)}
              >
                <Settings />
              </IconButton>
              <Drawer
                anchor='bottom'
                open={showDrawer}
                onClose={() => setDrawer(false)}
              >
                <List>
                  <ListItem button onClick={() => saveAsDraft()} disabled>
                    <ListItemIcon>
                      <Save color='primary' />
                    </ListItemIcon>
                    <ListItemText>Save As Draft</ListItemText>
                  </ListItem>
                  <ListItem button onClick={() => clearForm()}>
                    <ListItemIcon>
                      <Delete color='secondary' />
                    </ListItemIcon>
                    <ListItemText>Clear</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={() => setDrawer(false)}>
                    <ListItemIcon>
                      <Cancel />
                    </ListItemIcon>
                    <ListItemText>Cancel</ListItemText>
                  </ListItem>
                </List>
              </Drawer>
              <div className='form-actions-nav'>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={() => props.history.goBack()}
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={!form.title || !isDirty || !form.description}
                >
                  Publish
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default KabinetForm;

function EmojiPicker(props) {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <Picker onEmojiClick={props.onEmojiClick} />
    </Dialog>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}
