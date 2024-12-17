import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Typography, TextField, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const ONLY_NUMBER_WITH_PLUS = /^\+\d{12}$/;
const IS_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

RHFTextField.propTypes = {
  name: PropTypes.string,
  handleChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  multiline: PropTypes.bool,
  rows: PropTypes.number
};

const disabledSx = {
  '& .MuiInputBase-input, & .MuiInputBase-input[disabled]': {
    color: '#000000'
  },
  '& .MuiInputLabel-root, & .MuiInputLabel-root[disabled]': {
    color: '#000000'
  },
  '& .MuiInputBase-root, & .MuiInputBase-root[disabled]': {
    background: '#f2f2f2'
  }
};

export default function RHFTextField({ name, label, handleChange, disabled, placeholder, multiline, rows, ...other }) {
  const { control } = useFormContext();
  const {
    fieldType,
    maxLength,
    minLength,
    minValue,
    maxValue,
    onKeyDown,
    decimal,
    decimalPoint,
    handleBlur: _hanleBlur,
    allcaps,
    required,
    type,
    allSmall,
    errorMessage,
    setInsideErrors,
    topError,
    ...rest
  } = other;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    if (onKeyDown && typeof onKeyDown === 'function') {
      return onKeyDown.call(null, e);
    }
    return e;
  };

  const checkDecimalPoints = (value, dPoint) => {
    const valueStr = typeof value === 'number' ? value.toString() : value;
    const decimalParts = valueStr.split('.');
    if (decimalParts?.length === 2 && decimalParts[1]?.length > parseInt(dPoint)) {
      return false;
    } else {
      return true;
    }
  };

  const checkValueConditions = useCallback(
    (value) => {
      let errorMessage2 = '';
      if (maxLength && maxLength < value.length) {
        errorMessage2 = `Maximum lengthen is ${maxLength} characters.`;
      } else if (minLength && minLength > value.length) {
        errorMessage2 = `Minimum length is ${minLength} characters.`;
      } else if (type === 'number' && maxValue && parseInt(maxValue) < parseInt(value)) {
        errorMessage2 = `Maximum value should be ${maxValue}`;
      } else if (type === 'number' && minValue && parseInt(minValue) > parseInt(value)) {
        errorMessage2 = `Minimum value should be ${minValue}`;
      } else if (type === 'number' && decimal && !checkDecimalPoints(value, decimalPoint)) {
        errorMessage2 = `Values upto ${decimalPoint} decimal point are allowed only.`;
      } else if (fieldType === 'phone' && !ONLY_NUMBER_WITH_PLUS.test(value)) {
        errorMessage2 = `Please enter valid phone number.`;
      } else if (fieldType === 'email' && !IS_EMAIL.test(value)) {
        errorMessage2 = `Please enter valid email address.`;
      }
      return errorMessage2;
    },
    [maxLength, minLength, minValue, maxValue, type, decimalPoint, decimal, fieldType]
  );

  const firstRender = useRef();
  useEffect(() => {
    if (!firstRender.current) {
      if (control?._fields?.[name]?._f?.value) {
        let warningData = checkValueConditions(control?._fields?.[name]?._f?.value);
        if (warningData) {
          setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
        }
      }
      firstRender.current = true;
    } else {
      firstRender.current = false;
    }
  }, [name, control, checkValueConditions, setInsideErrors]);

  const handleOnChange = (onChange, event) => {
    const { value } = event.target;
    const checkValid = /^[0-9]+(\.[0-9]*)?$/;
    if (type === 'number' && value && !checkValid.test(value)) {
      return event.preventDefault();
    }
    if (value) {
      let warningData = checkValueConditions(value);
      setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
    } else {
      setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (allcaps && value) {
      event.target.value = value.toUpperCase();
    } else if (allSmall && value) {
      event.target.value = value.toLowerCase();
    }
    if (handleChange && typeof handleChange === 'function') {
      handleChange(event);
    }
    return onChange(event);
  };
  const handleBlur = (onBlur, onChange, event) => {
    let { value } = event.target;
    value = value.trim();
    event.target.value = value;
    onChange(event);
    if (type === 'number') {
      const valueStr2 = typeof value === 'number' ? value.toString() : value;
      const decParts = valueStr2.split('.');
      if (decParts.length === 2 && decParts[1]?.length === 0) {
        event.target.value = value.replace('.', '');
      }
    }
    if (_hanleBlur && typeof _hanleBlur === 'function') {
      _hanleBlur.call(this, event);
    }
    return onBlur(event);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onBlur, onChange, ...field }, fieldState: { error } }) => (
        <>
          <Stack spacing={1}>
            <Typography noWrap>
              {label}
              {required && !label.includes(' *') && ' *'}
            </Typography>
            <TextField
              {...field}
              // type={type}
              disabled={disabled}
              onKeyDown={handleKeyDown.bind(this)}
              onChange={handleOnChange.bind(this, onChange)}
              fullWidth
              placeholder={placeholder === false ? undefined : placeholder}
              autoComplete="off"
              value={typeof value === 'string' || (typeof value === 'number' && !isNaN(value)) ? value : ''}
              error={!!error || !!errorMessage}
              helperText={error?.message || errorMessage}
              sx={{
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  top: topError ? -25 : 37,
                  [topError ? 'right' : 'left']: -10
                },
                ...(disabled && disabledSx)
              }}
              onBlur={handleBlur.bind(this, onBlur, onChange)}
              {...rest}
              multiline={multiline}
              rows={rows}
              {...(!['text', 'number'].includes(type) && { type })}
            />
          </Stack>
        </>
      )}
    />
  );
}
