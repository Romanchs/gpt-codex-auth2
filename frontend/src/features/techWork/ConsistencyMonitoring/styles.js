import { themeV5 as theme } from '../../../theme/themeV5';

export const consistencyAccordion = {
  accordionHeader: { width: '100%', justifyContent: 'space-between', alignItems: 'center' },
  statusIndicator: { height: 8, width: 8, borderRadius: '50%' },
  statusIndicatorGreen: { background: '#008C0C', boxShadow: '0px 0px 4px 2px #008C0C40' },
  statusIndicatorOrange: { background: '#F28C60', boxShadow: '0px 0px 4px 2px #F28C6040' },
  statusIndicatorRed: { background: '#FF0000', boxShadow: '0px 0px 4px 2px #8C000040' },
  lastTableRowStyles: {
    '&:last-child': {
      '& td, & th': {
        borderBottom: 'none'
      }
    }
  }
};

export const accordionRowStyles = {
  nameCell: {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    fontSize: 12
  },
  statusCell: {
    fontWeight: 400,
    fontSize: 12
  },
  statusCellOk: {
    color: '#008C0C'
  },
  statusCellWarning: {
    color: '#F28C60'
  },
  statusCellError: {
    color: '#FF0000'
  }
};

export const rowStyles = {
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    pb: 1,
    '& > *': {
      paddingTop: 1.5,
      paddingBottom: 1.5,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-of-type': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  picker: {
    marginTop: 0.625,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',

    '& .MuiFormControl-root .MuiInputBase-root': {
      padding: '3px 0px 3px 4px',
      borderRadius: 1,
      '&>input': {
        fontSize: 12,
        padding: 0.625
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
};
