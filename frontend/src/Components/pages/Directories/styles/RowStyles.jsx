import { makeStyles } from '@material-ui/core';

export const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rootOpen: {
    borderRadius: '10px 10px 0 0',
    '& > *': {
      backgroundColor: '#D1EDF3',
      '&:first-child': {
        borderRadius: '10px 0 0 0'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0'
      }
    }
  },
  expand: {
    border: '1px solid #F28C60',

    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },
  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: '0 16px',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > .MuiTableCell-root': {
      color: '#567691',
      fontSize: 11,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '12px !important',
      '&:first-child': {
        paddingLeft: '0 !important'
      },
      '&:last-child': {
        paddingRight: '0 !important'
      }
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 10,
      padding: 12,
      fontWeight: 400,
      borderBottom: 'none',
      '&>div': {
        color: '#567691',
        fontSize: 10,
        fontWeight: 400,
        padding: 0
      },
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  }
});
