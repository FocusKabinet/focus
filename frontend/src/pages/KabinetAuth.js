import React from 'react';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { Email, Face, VpnKey } from '@material-ui/icons';
import { login, register } from '../helpers/kabinetProfile';
import './styles/KabinetAuth.scss';

export default function KabinetAuth(props) {
  const {
    match: {
      params: { id },
    },
    history,
  } = props;

  const emptyForm = {
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
  };

  const [isDirty, changeDirty] = React.useState(false);
  const [form, updateForm] = React.useState(emptyForm);
  const [formError, setFormError] = React.useState('');

  const handleUpdateForm = (e) => {
    changeDirty(true);
    return updateForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    let res = false;
    if (props.register) {
      res = await register(form);
    } else {
      res = await login(form.email, form.password);
    }
    if (!res) {
      history.push('/kabinet-home');
    }
  };

  return (
    <div>
      <Typography
        className="list-title"
        align="center"
        variant="h5"
        gutterBottom
      >
        {!props.register ? 'Sign in to Kabinet' : 'Register new account'}
      </Typography>
      <Paper className="new-idea-form">
        <Grid container spacing={2} direction="column">
          {props.register && (
            <Grid item>
              <TextField
                fullWidth
                id="displayName"
                label="Enter your display name"
                variant="outlined"
                value={form.displayName}
                onChange={handleUpdateForm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Face />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          <Grid item>
            <TextField
              fullWidth
              label="Enter your email"
              variant="outlined"
              id="email"
              value={form.email}
              onChange={handleUpdateForm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="password"
              label="Enter your password"
              variant="outlined"
              type="password"
              value={form.password}
              onChange={handleUpdateForm}
              error={!!formError}
              helperText={formError ? formError : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {props.register && (
            <Grid item>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm your password"
                variant="outlined"
                type="password"
                value={form.confirmPassword}
                onChange={handleUpdateForm}
                error={!!formError}
                helperText={formError ? formError : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {/* <Grid item>
            <Typography align="center" variant="subtitle2">
              {formError}
            </Typography>
          </Grid> */}
          <Grid item>
            <div className="form-actions">
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.push('kabinet-world')}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                {props.register ? 'Create' : 'Login'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
