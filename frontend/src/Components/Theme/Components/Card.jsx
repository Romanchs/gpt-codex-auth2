import { Card as CardMUI, CardContent, CardHeader } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

import { ReactComponent as NoResult } from '../../../images/no-results.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '24px',
    background: 'none',
    overflow: 'visible'
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '8px 8px 0 0',

    '& .MuiTypography-h5': {
      fontWeight: 500,
      fontSize: '12px'
    }
  },
  content: {
    padding: '20px 24px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.25)',
    borderRadius: '0 0 8px 8px',

    '&.noPadding': {
      padding: 0
    }
  },
  noResult: {
    padding: 30,
    '& p': {
      fontSize: 13,
      paddingTop: 12,
      color: '#567691',
      fontWeight: 700
    },
    '& svg': {
      width: 120,
      transform: 'translateX(-20px)'
    }
  },
  small: {
    padding: 8,
    '& p': {
      fontSize: 12,
      paddingTop: 4
    },
    '& svg': {
      width: 80,
      transform: 'translateX(-10px)'
    }
  }
}));

export const Card = ({ children, title, noPadding }) => {
  const classes = useStyles();

  return (
    <CardMUI className={classes.root} elevation={0}>
      <CardHeader className={classes.header} title={title} />
      <CardContent className={`${classes.content} ${noPadding && 'noPadding'}`}>{children}</CardContent>
    </CardMUI>
  );
};

export const CardNoResult = ({ small, text }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.noResult, small && classes.small)} style={{ textAlign: 'center' }}>
      <NoResult />
      <p>{text}...</p>
    </div>
  );
};
