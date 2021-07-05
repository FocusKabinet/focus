import { Button, Dialog, Typography, Grid } from '@material-ui/core';
import React from 'react';
import { loadState, saveState } from '../../utils/localStorage';
import './styles/Landing.scss';

export default function Landing(props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const localState = loadState('kabinet');
    if (!localState) setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    saveState('kabinet', 'initialized');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
    >
      <div className="landing">
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5">Welcome to Kabinet 🌐</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              This is a early version of a light-weight social media web
              application. Here you can share your ideas 💡 to users across the
              globe 🌎, or keep it to yourself.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              You can view ideas published by other users, visit a user's
              collection, bookmark 🔖 any post to your own and of course you can
              appreciate an idea by dropping a like 💖.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Besides users' contents, you can view what's trending across the
              media: Google trending 🚀 queries plus articles and headlines 📰
              tailored to the country of your residence.
            </Typography>
          </Grid>
          <Grid item xs>
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              fullWidth
            >
              Get started
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}
