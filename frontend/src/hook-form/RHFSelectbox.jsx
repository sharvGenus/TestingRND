import * as React from 'react';
import { Typography, TextField, FormControl, Stack, FormHelperText, Chip } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useFormContext, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { getReccurssiveObjectKeys } from '../utils';

RHFSelectbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  languageDropdown: PropTypes.bool,
  disable: PropTypes.bool,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  allowClear: PropTypes.bool,
  showHelperText: PropTypes.bool
};

const disabledSx = {
  '& .MuiAutocomplete-root-MuiOutlinedInput-root.Mui-disabled': {
    color: '#000000'
  },
  '& .MuiAutocomplete-root, & .MuiAutocomplete-root[disabled]': {
    color: '#000000'
  },
  '& .MuiAutocomplete-root, & .MuiOutlinedInput-root[disabled]': {
    background: '#f2f2f2'
  }
};

const Item = styled(FormControl)(({ theme, languagedropdown }) => ({
  color: languagedropdown ? `${theme.palette.common.white} !important` : null,
  width: languagedropdown ? '110px' : null,
  height: languagedropdown ? '42px' : null,
  '& svg': {
    fill: languagedropdown ? `${theme.palette.common.white} !important` : null
  },
  '& fieldset': {
    borderColor: languagedropdown ? `${theme.palette.common.white} !important` : null,
    borderWidth: languagedropdown ? '1px !important' : null
  }
}));

export default function RHFSelectbox({
  name,
  label,
  menus,
  onChange,
  languageDropdown,
  disable,
  required = false,
  placeholder,
  allowClear = false,
  defaultValue = '',
  showHelperText = true
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <>
          <Item
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: getReccurssiveObjectKeys(errors, name)?.message ? '#ff4d4f' : ''
                }
              },
              ...(disable && disabledSx)
            }}
          >
            <Stack spacing={1}>
              <Typography id="demo-simple-select-label">
                {label}
                {required && label && !label.includes(' *') && ' *'}
              </Typography>
              <Autocomplete
                {...field}
                onChange={(event, value) => {
                  if (onChange && typeof onChange === 'function') {
                    onChange(
                      value
                        ? {
                            target: { value: value.id, name: value.name, rank: value.rank, type: value.default_attribute?.name, row: value }
                          }
                        : ''
                    );
                  }
                  field.onChange(value ? value.id : '');
                }}
                value={(menus && menus.find((option) => option.id === field.value)) || null}
                options={menus || []}
                disabled={disable}
                disableClearable={!allowClear}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...(languageDropdown && { languagedropdown: languageDropdown.toString() })}
                    placeholder={placeholder}
                    name={name}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip key={option.id} label={option.name} {...getTagProps({ index })} />)
                }
              />
              {showHelperText && (
                <FormHelperText
                  sx={{
                    position: 'absolute',
                    top: 60,
                    left: 3,
                    color: '#ff4d4f'
                  }}
                >
                  {!!getReccurssiveObjectKeys(errors, name)?.message && getReccurssiveObjectKeys(errors, name)?.message}
                </FormHelperText>
              )}
            </Stack>
          </Item>
        </>
      )}
    />
  );
}
