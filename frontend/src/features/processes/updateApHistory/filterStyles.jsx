import makeStyles from '@material-ui/core/styles/makeStyles';

export const useTableStyles = makeStyles(() => ({
  table: {
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 8,
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)'
  },
  tableHeader: {
    color: '#ffffff',
    padding: '16px 32px',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4,
    borderRadius: '8px 8px 0 0',
    backgroundColor: '#223B82'
  },
  tableBody: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#ffffff',
    '& .MuiChip-deletable': {
      borderRadius: '24px'
    }
  },
  tableBody__chips: {
    '&>div>div:first-child': {
      marginBottom: 0,
      '& .MuiChip-deletable>.MuiChip-deleteIcon': {
        display: 'none'
      }
    },
    '&>div>div:last-child': {
      display: 'none'
    }
  }
}));
