import StyledInput from './StyledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  btn: {
    width: 36,
    height: 36,
    '& svg': {
      color: '#6C7D9A'
    }
  }
}));

const StyledInputClear = ({ value, onClear, ...props }) => {
  const classes = useStyles();
  return (
    <StyledInput
      {...props}
      value={value}
      endAdornment={
        value && (
          <InputAdornment position="end">
            <IconButton
              className={classes.btn}
              aria-label="toggle password visibility"
              onClick={onClear}
              edge="end"
              onMouseDown={(e) => e.preventDefault()}
            >
              <CloseRounded />
            </IconButton>
          </InputAdornment>
        )
      }
    />
  );
};

export default StyledInputClear;
