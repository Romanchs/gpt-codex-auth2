import propTypes from 'prop-types';
import { createContext, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

export const FormContext = createContext(null);

const Form = ({ forms, children, name, errors, onChange }) => {
  const { activeField } = useSelector(({ forms }) => forms);
  useEffect(() => {
    if (onChange && forms[name]) onChange(forms[name], activeField);
  }, [forms]);

  return <FormContext.Provider value={{ formName: name, errors }}>{children}</FormContext.Provider>;
};

Form.propTypes = {
  name: propTypes.string.isRequired,
  onChange: propTypes.func,
  errors: propTypes.object
};

const mapStateToProps = ({ forms }) => {
  return {
    forms: forms
  };
};

export default connect(mapStateToProps)(Form);
