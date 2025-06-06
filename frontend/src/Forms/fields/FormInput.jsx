import StyledInput from '../../Components/Theme/Fields/StyledInput';
import fieldControl from '../fieldControl';

const FormInput = StyledInput;

FormInput.propTypes = StyledInput.propTypes;

export default fieldControl(StyledInput);
