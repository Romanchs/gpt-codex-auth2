import { makeStyles } from '@material-ui/core';

export const useDisputeRowStyles = makeStyles({
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
      color: '#4A5B7A',
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
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: '10px 10px 0 0',
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0',
        borderRight: '1px solid #D1EDF3'
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
    padding: '8px 16px',
    border: 'none',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative',
    '& .MuiTableCell-root': {
      border: 'none'
    }
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 12,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '10px !important',
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  body: {
    '& > *': {
      color: '#4A5B7A',
      fontSize: 12,
      fontWeight: 400,
      padding: '18px 10px 8px'
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 11
      },
      '& svg': {
        fontSize: 12
      }
    }
  }
});

export const useDisputeStyles = makeStyles({
  formGroup: {
    position: 'relative',

    '& > .MuiFormControl-root input': {
      maxWidth: '85%'
    }
  },
  download_file: {
    background: 'none !important',
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: 'translateY(-50%)',

    '& .MuiTouchRipple-root': {
      display: 'none'
    }
  },
  radioButton: {
    '& .MuiFormControlLabel-label': {
      fontSize: 12
    }
  }
});
