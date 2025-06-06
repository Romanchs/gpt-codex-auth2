import makeStyles from '@material-ui/core/styles/makeStyles';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';

import { ReactComponent as NoResult } from '../../../images/no-results.svg';

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

const NotResultRow = ({ text, span, small }) => {
  const classes = useStyles();
  return (
    <>
      <TableRow className={clsx(classes.root, small && classes.small)}>
        <TableCell colSpan={span} align={'center'}>
          <NoResult />
          <p>{text}...</p>
        </TableCell>
      </TableRow>
    </>
  );
};

export default NotResultRow;
