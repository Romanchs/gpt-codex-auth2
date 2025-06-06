export const tablesSx = {
  '.body__table-head': {
    marginTop: '16px'
  },
  '.body__table-row': {
    borderRadius: '10px',
    '& td': {
      color: '#4a5b7a',
      fontSize: '12px',
      padding: '12px 8px',
      '&:first-of-type': {
        paddingLeft: '16px'
      },
      '&:last-child': {
        paddingRight: '16px'
      }
    },
    '& > *': {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #d1edf3',
      borderTop: '1px solid #d1edf3',
      backgroundColor: '#fff',
      fontSize: '12px',
      color: '#4a5b7a',
      '&:first-of-type': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #d1edf3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #d1edf3'
      }
    },
    '&.MuiTableRow-hover:hover > *': {
      backgroundColor: '#D1EDF3',
      cursor: 'pointer'
    }
  },
  '.body__calendar': {
    position: 'relative',
    '& .clear-button': {
      position: 'absolute',
      right: '0',
      top: '9px',
      '& svg': {
        fontSize: '17px'
      }
    }
  }
};
