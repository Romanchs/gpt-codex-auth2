import Paper from '@material-ui/core/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: '100%',
    backgroundColor: 'transparent'
  },
  inner: {
    '& .MuiTableHead-root .MuiTableCell-root': {
      background: 'rgb(34, 59, 130)',
      borderBottom: 'none',
      color: '#fff',
      padding: '12px 8px',
      verticalAlign: 'bottom',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        paddingLeft: 16
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        paddingRight: 16
      },
      '&>p': {
        fontSize: 12,
        color: '#fff'
      },
      '& input': {
        marginTop: 5,
        borderRadius: 4,
        border: '1px solid #D1EDF3',
        width: '100%',
        padding: '5px 7px',
        fontSize: 12,
        outline: 'none',
        color: '#555',
        fontWeight: 700,
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          WebkitAppearance: 'none'
        }
      },
      '& .filter': {
        backgroundColor: '#fff',
        marginLeft: 'auto',
        color: '#000',
        width: 32,
        height: 32,
        minHeight: 32
      },
      '& .MuiBadge-badge': {
        fontSize: 10,
        color: 'rgb(34, 59, 130)',
        backgroundColor: '#D1EDF3'
      }
    },
    '& .MuiTableBody-root .MuiTableRow-root': {
      '& .MuiTableHead-root .MuiTableCell-root': {
        background: '#fff',
        color: '#567691',
        paddingBottom: 12
      },
      '&>.MuiTableCell-root.styled': {
        position: 'relative',
        fontSize: 12,
        paddingTop: 15,
        paddingBottom: 15,
        color: '#4A5B7A',
        backgroundColor: '#fff',
        borderBottom: '1px solid #D1EDF3',
        borderTop: '1px solid #D1EDF3',
        '&:first-child': {
          borderRadius: '10px 0 0 10px',
          borderLeft: '1px solid #D1EDF3'
        },
        '&:last-child': {
          borderRadius: '0 10px 10px 0',
          borderRight: '1px solid #D1EDF3'
        }
      },
      '&>.MuiTableCell-root.styled.spacer': {
        opacity: 0,
        backgroundColor: 'transparent',
        borderBottom: 'none'
      }
    },
    '& .calendar__main-style': {
      position: 'relative',
      '& input': {
        minWidth: 77,
        border: '1px solid #D1EDF3',
        padding: '5px 24px 5px 7px',
        fontSize: 12,
        borderRadius: 4,
        color: '#555',
        fontWeight: 700,
        backgroundColor: '#fff',
        minHeight: '32px',
        boxSizing: 'border-box'
      },

      '& .MuiInput-underline': {
        '&:before': {
          display: 'none'
        },
        '&:after': {
          display: 'none'
        }
      }
    }
  }
});

export const StyledTable = ({ children, styles, spacing = 2, fullHeight = false }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={0} style={styles}>
      <TableContainer
        className={classes.inner}
        style={{ maxHeight: fullHeight ? 'auto' : 'calc(100vh - 140px)', minHeight: 380 }}
      >
        <Table
          aria-label="sticky table"
          style={{
            borderCollapse: 'separate',
            borderSpacing: `0 ${spacing * 4}px`,
            marginTop: -spacing * 4
          }}
        >
          {children}
        </Table>
      </TableContainer>
    </Paper>
  );
};
