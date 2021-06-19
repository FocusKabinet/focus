import React from 'react';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Drawer,
} from '@material-ui/core';
import { AlternateEmail, Face, Person, VpnKey } from '@material-ui/icons';
import { connect } from 'react-redux';
import './styles/KabinetProfile.scss';
import { updatePassword, updateDetails } from '../helpers/kabinetProfile';

function KabinetProfile(props) {
  const {
    user: { displayName, email },
  } = props;

  const [changePw, setChangePw] = React.useState(false);
  const [changeDetails, setChangeDetails] = React.useState(false);

  return (
    <div>
      <Typography className="title" align="center" variant="h5" gutterBottom>
        <div className="title-with-icon">
          <Person /> Your profile
        </div>
      </Typography>
      <Paper className="new-idea-form">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              fullWidth
              id="displayName"
              label="Your display name"
              variant="filled"
              value={displayName}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Face />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Your email"
              variant="filled"
              id="email"
              value={email}
              readOnly
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <div className="form-actions">
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.goBack()}
                size="small"
              >
                Back
              </Button>
              <div className="profile-update-buttons">
                <Button
                  color="primary"
                  onClick={() => setChangePw(true)}
                  size="small"
                >
                  Change password
                </Button>
                <Button
                  color="primary"
                  onClick={() => setChangeDetails(true)}
                  size="small"
                >
                  Update email
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
        <ChangePassword open={changePw} setClose={() => setChangePw(false)} />
        <ChangeDetails
          open={changeDetails}
          setClose={() => setChangeDetails(false)}
        />
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    user: state.kabinet_user || {},
  };
};

export default connect(mapStateToProps)(KabinetProfile);

function ChangePassword(props) {
  const { open, setClose } = props;
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = async () => {
    const res = await updatePassword(
      currentPassword,
      password,
      confirmPassword
    );
    !res && handleClose();
  };

  const clearForm = () => {
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    setClose();
    clearForm();
  };

  return (
    <Drawer anchor="top" open={open} onClose={handleClose}>
      <Paper className="change-pw-form">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography
              className="changepw-title"
              align="center"
              variant="h5"
              gutterBottom
            >
              Update password
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="current-password"
              label="Enter current password"
              variant="outlined"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="new-password"
              label="Enter new password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm new password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <div className="changepw-buttons">
              <Button color="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!currentPassword || !password || !confirmPassword}
              >
                Confirm
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Drawer>
  );
}

function ChangeDetails(props) {
  const { open, setClose } = props;
  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');

  const handleSubmit = async () => {
    const res = await updateDetails(currentPassword, displayName, email);
    if (!res) {
      handleClose();
      clearForm();
    }
  };

  const handleClose = () => {
    setClose();
    clearForm();
  };

  const clearForm = () => {
    setDisplayName('');
    setEmail('');
    setCurrentPassword('');
  };

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={handleClose}
      PaperProps={{ className: 'change-pw-form' }}
    >
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography
            className="display-name"
            align="center"
            variant="h5"
            gutterBottom
          >
            Update email
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            id="chnage-email"
            label="Enter current password"
            type="password"
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* <Grid item>
            <TextField
              fullWidth
              id="displayName"
              label="Enter new display name"
              variant="outlined"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Face />
                  </InputAdornment>
                ),
              }}
            />
          </Grid> */}
        <Grid item>
          <TextField
            fullWidth
            label="Enter new email"
            variant="outlined"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <div className="changepw-buttons">
            <Button color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={!email || !currentPassword}
            >
              Confirm
            </Button>
          </div>
        </Grid>
      </Grid>
    </Drawer>
  );
}
