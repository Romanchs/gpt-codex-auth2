import React, { useRef, useState } from 'react';
import { isIntegerOrNull } from '../../util/helpers';

const SearchField = ({ type = 'text', initValue = '', name = '', onSearch, isInt, minSymbols = 3 }) => {
  const [value, setValue] = useState(initValue);
  const timeout = useRef(null);

  const handleChange = ({ target: { value } }) => {
    if (isInt && !isIntegerOrNull(value)) return;
    setValue(value);
    if (!value) {
      onSearch({ [name]: undefined });
    }
    clearTimeout(timeout.current);
    if (value.length >= (minSymbols ?? 3)) {
      timeout.current = setTimeout(() => {
        onSearch({ [name]: value });
      }, 500);
    }
  };

  return <input type={type} value={value} name={name} onChange={handleChange} />;
};

export default SearchField;
