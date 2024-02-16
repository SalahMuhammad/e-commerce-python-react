import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    let value = e.target.value;
    if (typeof(initialValue) === 'number') {
      value = value.replace(/[^0-9]+(\.)+?/g, '');
    } 
    else if (typeof(initialValue) === 'boolean') {
      value = e.target.checked
    }
    setValue(value)
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
