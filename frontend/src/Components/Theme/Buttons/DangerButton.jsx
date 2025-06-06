import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

export const DangerButton = withStyles({
  root: {
    textTransform: 'none',
    fontSize: 14,
    padding: '7px 28px',
    border: '1px solid',
    lineHeight: '18px',
    fontWeight: 400,
    backgroundColor: '#f90000',
    borderColor: '#f90000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#f90000',
      borderColor: '#f90000',
      boxShadow: 'none'
    },
    '&:disabled, &.Mui-disabled': {
      backgroundColor: '#f90000',
      borderColor: '#f90000',
      color: '#fff',
      boxShadow: 'none',
      opacity: 0.5
    },
    '& svg': {
      fontSize: 18,
      marginRight: 8
    }
  }
})(Button);
