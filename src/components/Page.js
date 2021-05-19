import React from 'react';
import './styles/Page.scss';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

function Page(props) {
  return (
    <div className="page">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {props.children}
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default Page;
