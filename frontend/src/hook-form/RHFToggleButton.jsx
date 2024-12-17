import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';

RHFToggleButton.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool
};

export default function RHFToggleButton({ name, label, disabled, value }) {
  const { control } = useFormContext();

  let shouldAutoCheck = false;
  if (name === 'editable' && typeof value !== 'boolean') {
    shouldAutoCheck = true;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={shouldAutoCheck ? true : false}
      render={({ field }) => (
        <>
          <FormControlLabel
            control={<Switch {...field} disabled={disabled} defaultChecked={shouldAutoCheck ? true : value} />}
            label={label}
            labelPlacement="end"
          />
        </>
      )}
    />
  );
}
