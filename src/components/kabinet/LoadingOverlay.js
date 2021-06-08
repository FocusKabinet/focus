import { Backdrop, CircularProgress } from '@material-ui/core';
import React from 'react';

export default function LoadingOverlay(props) {
  return (
    <Backdrop open={!!props.open} style={{ zIndex: 10000 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
