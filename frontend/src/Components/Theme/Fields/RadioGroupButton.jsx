import { FormControlLabel, withStyles, Radio } from '@material-ui/core';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';

const StyledCheckbox = withStyles({
  root: {
    padding: 4
  }
})(FormControlLabel);

const RadioGroupButton = (props) => {
  return <StyledCheckbox {...props} control={<Radio />} icon={<RadioButtonUncheckedRounded />} />;
};

export default RadioGroupButton;
