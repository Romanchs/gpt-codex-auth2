import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

import { ReactComponent as NoResult } from '../../../images/no-results.svg';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  root: {
    '&>*': {
      borderBottom: 'none !important',
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
    }
  },
  small: {
    '&>*': {
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
  }
}));

export const NotResult = ({ text, small }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container justifyContent={'center'} className={clsx(classes.root, small && classes.small)}>
        <Grid item>
          <NoResult />
          <p>{text}...</p>
        </Grid>
      </Grid>
    </>
  );
};
