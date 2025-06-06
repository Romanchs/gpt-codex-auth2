import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import propTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: 32,
    minWidth: 104,
    padding: '5px 8px',
    '&.short': {
      minWidth: 63
    },
    '&>span': {
      fontSize: 12,
      lineHeight: 1.2,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '0 4px'
    }
  },
  all: {
    color: '#4A5B7A'
  },
  success: {
    color: '#008C0C'
  },
  failure: {
    color: '#FF4850'
  },
  dot: {
    color: '#4A5B7A'
  }
}));

const Summary = ({ all, success, failure }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, !all && 'short')}>
      {all && (
        <>
          <span className={classes.all}>{all || 0}</span>
          <span className={classes.dot}>•</span>
        </>
      )}
      <span className={classes.success}>{success || 0}</span>
      <span className={classes.dot}>•</span>
      <span className={classes.failure}>{failure || 0}</span>
    </div>
  );
};

Summary.propTypes = {
  all: propTypes.number,
  success: propTypes.number,
  failure: propTypes.number
};

export default Summary;
