import { Checkbox, withStyles } from '@material-ui/core';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';

const StyledCheckbox = withStyles({
  root: {
    padding: 4
  },
  colorPrimary: {
    color: '#F28C60'
  },
  colorSecondary: {
    color: '#4A5B7A',
    '&$checked': {
      color: '#F28C60'
    }
  },
  checked: {}
})(Checkbox);

const RadioButton = (props) => {
  return (
    <StyledCheckbox {...props} icon={<RadioButtonUncheckedRounded />} checkedIcon={<CheckCircleOutlineRounded />} />
  );
};

export default RadioButton;
