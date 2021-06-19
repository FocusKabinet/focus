import React from 'react';
import './styles/Page.scss';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from './LoadingOverlay';
import Notification from './Notification';
import TopBar from './TopBar';
import { auth } from '../../app/firebase';
import { setProfile } from '../../redux/actions/kabinetUser';
import { setLoadingState } from '../../redux/actions/loading';
import { getUserBookmark } from '../../helpers/kabinetUserInteractions';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
});

function Page(props) {
  const width = useWidth();

  React.useEffect(() => {
    async function getUser() {
      auth.onAuthStateChanged((userAuth) => {
        props.dispatch(setProfile(userAuth));
        if (userAuth) getUserBookmark(userAuth.uid);
      });
    }
    if (!props.user) getUser();
  }, [props]);

  return (
    <div className='page'>
      <ThemeProvider theme={theme}>
        <LoadingOverlay open={props.loading || false} />
        <Notification />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TopBar {...props} />
          <div className={`page-content ${width}`}>{props.children}</div>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    user: state.kabinet_user,
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
