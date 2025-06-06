import { themeV5 as theme } from '../../../../../theme/themeV5';

export const styles = {
  picker: {
    marginTop: 0.625,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',

    '& .MuiFormControl-root .MuiInputBase-root': {
      padding: '3px 0px 3px 4px',
      borderRadius: 1,
      backgroundColor: '#FFFFFF',

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
  },
  tooltip: {
    textAlign: 'center'
  },
  chip: {
    minWidth: 100,
    borderRadius: 5,
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
};
