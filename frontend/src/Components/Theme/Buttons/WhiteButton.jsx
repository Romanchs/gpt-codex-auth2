import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

export const WhiteButton = withStyles({
  root: {
    textTransform: 'none',
    fontSize: 14,
    padding: '7px 28px',
    border: '1px solid',
    lineHeight: '18px',
    fontWeight: 400,
    backgroundColor: 'transparent',
    borderColor: '#30478A',
    color: '#30478A',
    '&:hover': {
      borderColor: '#30478A',
      boxShadow: 'none'
    },
    '& svg': {
      fontSize: 18,
      marginRight: 8
    }
  }
})(Button);
