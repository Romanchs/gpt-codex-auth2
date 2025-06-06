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
  saveButton: {
    borderRadius: 24,
    padding: '8px 36px',
    textTransform: 'uppercase',
    boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.08), 0px 4px 5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.08)',
    '&>span>svg': {
      marginRight: 7,
      fontSize: 16
    }
  },
  picker: {
    marginTop: 5,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',

    '& .MuiFormControl-root .MuiInputBase-root': {
      padding: '3px 0px 3px 4px',

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
