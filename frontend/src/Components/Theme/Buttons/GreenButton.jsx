import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

export const GreenButton = withStyles({
  root: {
    textTransform: 'none',
    fontSize: 14,
    padding: '7px 28px',
    border: '1px solid',
    lineHeight: '18px',
    fontWeight: 400,
    backgroundColor: '#008C0C',
    borderColor: '#008C0C',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#008C0C',
      borderColor: '#008C0C',
      boxShadow: 'none'
    },
    '&:disabled': {
      color: '#fff',
      backgroundColor: '#008C0C',
      borderColor: '#008C0C',
      boxShadow: 'none',
      opacity: 0.5
    },
    '& svg': {
      fontSize: 18,
      marginRight: 8
    }
  }
})(Button);
