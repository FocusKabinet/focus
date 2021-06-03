import React from 'react';
import './styles/Page.scss';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from './LoadingOverlay';
import Notification from './Notification';

function Page(props) {
  const width = useWidth();
  return (
    <div className="page">
      <LoadingOverlay open={props.loading || false} />
      <Notification />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={`page-content ${width}`}>{props.children}</div>
      </MuiPickersUtilsProvider>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(Page);

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}
