import { useContext, useEffect, useState } from 'react';

import { store } from '../store/store';
import { FormContext } from './Form';
import { updateForm } from './formActions';

function fieldControl(Field) {
  return function (props) {
    const { name } = props;
    const { formName, errors } = useContext(FormContext);
    const { forms } = store.getState();
    const [value, setValue] = useState('');

    useEffect(() => {
      const currentField = forms[formName]?.[name];
      setValue(currentField);
    }, [forms]);

    const onChange = (data) => {
      if (data?.target) {
        store.dispatch(updateForm(formName, name, data.target.value));
        setValue(data.target.value);
      } else {
        store.dispatch(updateForm(formName, name, data));
        setValue(data);
      }
    };

    useEffect(() => {
      if (props.value) {
        onChange(props.value);
      }
    }, [props.value]);

    return <Field {...{ ...props, value: value }} error={errors && errors[name]} onChange={onChange} />;
  };
}

export default fieldControl;
