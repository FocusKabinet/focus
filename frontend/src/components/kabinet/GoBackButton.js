import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

export default function GoBackButton(props) {
  return (
    // <IconButton
    //   className="goback-button"
    //   variant="outlined"
    //   color="primary"
    //   onClick={() => props.history.goBack()}
    // >
    //   <KeyboardBackspace />
    // </IconButton>
    <Button
      className="goback-button"
      color="primary"
      onClick={() => props.history.goBack()}
      startIcon={<KeyboardBackspace />}
    >
      Back
    </Button>
  );
}
