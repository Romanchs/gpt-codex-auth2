import { makeStyles } from '@material-ui/core';
import propTypes from 'prop-types';

import Img from '../../images/not-found.png';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '15vh',
    '&>img': {
      width: 300,
      maxWidth: '80vw'
    }
  },
  message: {
    color: '#607D95',
    fontSize: 19,
    fontWeight: 900
  }
}));

export const NotFoundPage = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={Img} alt="Not Found" />
      <p className={classes.message}>{message}</p>
    </div>
  );
};

NotFoundPage.propTypes = {
  message: propTypes.string.isRequired
};
