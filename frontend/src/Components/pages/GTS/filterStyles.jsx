import makeStyles from '@material-ui/core/styles/makeStyles';

export const useFilterStyles = makeStyles(() => ({
  filter: {
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16
  },
  filterHeader: {
    backgroundColor: '#223B82',
    color: '#fff',
    padding: '16px 24px',
    fontSize: 13,
    lineHeight: 1.4
  },
  filterBody: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px 24px'
  }
}));

export const useSelectIconStyles = makeStyles(() => ({
  checkedField: {
    textAlign: 'center',
    '&>p': {
      textTransform: 'uppercase'
    },
    '&>button': {
      marginTop: 5,
      transform: 'translateY(7px)',
      padding: '3.8px 3px',
      '&>span svg': {
        color: '#FFFFFF'
      }
    },
    '&--checked>button>.MuiIconButton-label svg': {
      color: '#F28C60'
    }
  },
  selectIcon: {
    border: 'none',
    '& svg': {
      color: '#223B82',
      fontSize: 24
    },
    '&--checked svg': {
      color: '#F28C60'
    }
  }
}));

export const useMultiselectStyles = makeStyles(() => ({
  multiselect: {
    '& .MuiInputBase-input': {
      height: 24,
      color: '#4A5B7A'
    },
    '& .MuiFormLabel-root': {
      top: 3,
      color: '#A9B9C6',
      fontSize: 14
    },
    '& fieldset': {
      border: '1px solid #D1EDF3 !important'
    }
  }
}));
