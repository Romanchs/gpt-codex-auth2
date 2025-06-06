import { useMemo } from 'react';
import AutocompleteUI from '../../../../Components/Theme/Fields/Autocomplete';
import propTypes from 'prop-types';

const list = [];

const Autocomplete = ({ label, value, onChange, error, ...props }) => {
  const innerList = useMemo(() => {
    const inputValue = value?.trim().toLocaleLowerCase();
    return !inputValue ? [] : list.filter((i) => i.label.toLocaleLowerCase().includes(inputValue));
  }, [value]);

  const handleReasonChange = (item) => {
    onChange(item?.value ?? '');
  };

  const handleReasonInput = (event) => {
    if (event) onChange(event.target.value);
  };

  return (
    <AutocompleteUI
      label={label}
      value={value}
      list={innerList}
      onChange={handleReasonChange}
      onInput={handleReasonInput}
      filterOptions={(options) => options}
      error={error}
      open={Boolean(innerList.length)}
      {...props}
    />
  );
};

Autocomplete.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  error: propTypes.string,
  props: propTypes.object
};

export default Autocomplete;
