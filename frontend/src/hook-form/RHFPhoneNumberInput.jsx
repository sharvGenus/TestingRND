import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { styled } from '@mui/material/styles';
// form
import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

RHFPhoneNumberInput.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool
};
const PhoneInputStyle = styled(PhoneInput)(({ theme, isphonelabelshrink }) => ({
  height: 56,
  border: `1px solid ${theme.palette.grey[1000]}`,
  padding: '0 14px',
  marginTop: '0 !important',
  borderRadius: 4,
  '& .PhoneInputCountry': {
    display: 'none'
  },
  '&.PhoneInput--focus': {
    '& + .phoneLabel': {
      transform: 'translate(-50px, -27px) scale(0.75)',
      background: theme.palette.common.white,
      padding: '0 5px'
    }
  },
  '& + .phoneLabel': {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: '1rem',
    top: 17,
    left: 50,
    color: theme.palette.inputLabel,
    transition:
      'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    ...(isphonelabelshrink &&
      isphonelabelshrink !== '+91' && {
        transform: 'translate(-50px, -27px) scale(0.75)',
        background: theme.palette.common.white,
        padding: '0 5px'
      })
  },
  '&:hover': {
    borderColor: theme.palette.common.black
  },
  '& input': {
    borderWidth: 0,
    outline: 'none',
    paddingLeft: 10,
    fontSize: '1rem'
  },
  '& .PhoneInputCountrySelectArrow': {
    display: 'none'
  },
  '& select': {
    display: 'none'
  },
  '& + .phoneLabel + p': {
    color: theme.palette.inputError,
    fontSize: '0.75rem',
    fontWeight: 400,
    textAlign: 'left',
    marginTop: '3px !important',
    marginLeft: '15px !important'
  }
}));

export default function RHFPhoneNumberInput({ name, label, onChange, required, ...rest }) {
  const { control } = useFormContext();
  const handleKeyDown = (e) => {
    const value = e.target.value.toString();
    if (value && value.indexOf('0') === 0) {
      e.target.value = value.substr(1, value.length);
    }
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(+e.key) && value.length > 10) {
      return e.preventDefault();
    }
    return e;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => isValidPhoneNumber(value)
      }}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={1} sx={{ position: 'relative' }}>
          <Typography id="demo-simple-select-label">
            {label}
            {required && !label.includes(' *') && ' *'}
          </Typography>
          <PhoneInputStyle
            {...field}
            {...rest}
            isphonelabelshrink={field.value}
            onKeyDown={handleKeyDown.bind(this)}
            onChange={(args) => {
              if (args && +args) {
                if (onChange && typeof onChange === 'function') onChange(args);
              }
              field.onChange(args || '');
            }}
            country="+91"
            countries={['IN']}
            international={false}
            countryCallingCodeEditable={false}
            defaultCountry="IN"
          />
          {!!error && error?.message && <p>{error?.message}</p>}
        </Stack>
      )}
    />
  );
}
