import makeStyles from '@material-ui/core/styles/makeStyles';

export const useTableStyles = makeStyles(() => ({
  table: {
    marginBottom: 16,
    borderRadius: 8,
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden'
  },
  tableHeader: {
    backgroundColor: '#223B82',
    color: '#fff',
    padding: '17px 24px',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4
  },
  tableBody: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px 24px 18px'
  },
  preText: {
    whiteSpace: 'pre'
  },
  cellDelete: {
    '&>span>button': {
      padding: 4
    }
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center'
  }
}));

export const useRegTabStyles = makeStyles((theme) => ({
  picker: {
    marginTop: 5,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',

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
  },
  timePicker: {
    position: 'relative'
  },
  clearTimeButton: {
    position: 'absolute',
    top: 6,
    right: 6
  },
  checkedField: {
    textAlign: 'center',
    '&>p': {
      textTransform: 'uppercase'
    },
    '&>button': {
      marginTop: 5,
      padding: '3.8px 3px',
      '&>span svg': {
        color: '#FFFFFF',
        fontSize: 24
      }
    },
    '&--checked>button>.MuiIconButton-label svg': {
      color: '#F28C60'
    }
  },
  chip: {
    minWidth: 100,
    borderRadius: 20,
    padding: '5px 12px',
    color: '#fff',
    fontSize: 12,
    lineHeight: 1.1,
    textAlign: 'center',
    backgroundColor: '#6C7D9A',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      minWidth: 50,
      padding: '4px 12px',
      fontSize: 10
    }
  },
  warning: {
    backgroundColor: '#F28C60'
  },
  tooltip: {
    textAlign: 'center'
  }
}));

export const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      padding: '12px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3',
        paddingLeft: '16px'
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
      padding: '12px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3',
        paddingLeft: '16px'
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
  collapse: {
    border: '1px solid #223B82',
    '& svg': {
      color: '#223B82',
      fontSize: 21
    }
  },
  selectIcon: {
    border: 'none',
    '& svg': {
      fontSize: 24
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
    padding: '8px 15px 0',
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
      fontWeight: 700,
      padding: '8px 1px 16px !important',
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
      padding: 12,
      border: 'none'
    }
  },
  splitter: {
    borderBottom: '1px solid #4A5B7A !important'
  },
  innerTableRow: {
    '& > td': {
      padding: '12px 1px'
    }
  },
  deleteButton: {
    width: 128,
    height: 32,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
    borderRadius: 4,
    backgroundColor: '#FF4850',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: '#ff2934',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
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
