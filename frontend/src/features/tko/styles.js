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
    margin: '0 !import',
    padding: '8px 16px 16px',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
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
      color: '#567691',
      fontSize: 10,
      fontWeight: 400,
      padding: 10
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

export const useDatePickerStyles = makeStyles(() => ({
  picker: {
    marginTop: 5,
    borderRadius: 1,

    '& .MuiFormControl-root .MuiInputBase-root': {
      padding: '3px 0px 3px 4px',
      borderRadius: 4,
      backgroundColor: '#FFFFFF',

      '&>input': {
        fontSize: 12,
        padding: 5
      },

      '&.Mui-focused': {
        borderColor: 'transparent'
      },

      '& input': {
        marginTop: 0,
        border: 'none'
      }
    }
  }
}));

export const useTimelineStyles = makeStyles({
  root: {
    margin: '10px 0',
    padding: '16px 8px'
  },
  yearButton: {
    backgroundColor: '#E5EAEE',
    color: '#567691',
    borderRadius: '32px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
    gap: '5px',
    width: '100%'
  },
  circleButton: {
    width: '32px',
    height: '32px',
    background: '#D1EDF3',
    borderRadius: '16px',
    color: '#4A5B7A',
    fontSize: 12,
    '&:hover': {
      backgroundColor: '#D1EDF3',
      borderColor: '#D1EDF3'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#D1EDF3',
      color: '#4A5B7A'
    }
  },
  blueButton: {
    backgroundColor: '#223B82',
    color: '#fff',
    borderRadius: '32px',
    width: '100%',
    '&:hover': {
      backgroundColor: '#223B82',
      borderColor: '#223B82'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#223B82',
      color: '#fff'
    }
  },
  orangeBorder: {
    border: '2px solid #F28C60'
  },
  geenButton: {
    backgroundColor: '#008C0C',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#008C0C',
      borderColor: '#008C0C'
    },
    '&.Mui-disabled': {
      opacity: 0.25,
      backgroundColor: '#008C0C',
      color: '#fff'
    }
  }
});
