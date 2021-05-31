import React from 'react';
import { Fab, useMediaQuery, useTheme } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import './styles/ScrollToTop.scss';

export default function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('xs'));

  function toggleVisibility() {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  React.useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`scroll-to-top ${visible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
    >
      <Fab
        color="primary"
        className="button"
        size={mobile ? 'medium' : 'large'}
      >
        <KeyboardArrowUp className="icon" />
      </Fab>
    </div>
  );
}
