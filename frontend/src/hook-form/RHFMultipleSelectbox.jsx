import * as React from 'react';
import { Typography, TextField, FormControl, Stack, FormHelperText, Checkbox, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles'; // Import useTheme hook
import { useFormContext, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { getReccurssiveObjectKeys } from '../utils';

RHFMultiSelectbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
  languageDropdown: PropTypes.bool,
  onChange: PropTypes.func,
  disable: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  allowClear: PropTypes.bool
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

const EllipsisContainer = styled('div')({
  width: '60%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export default function RHFMultiSelectbox({
  name,
  label,
  menus,
  onChange,
  languageDropdown,
  disable,
  required = false,
  placeholder,
  allowClear = false
}) {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
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
            theme={theme} // Pass down the theme object
          >
            <Stack spacing={1}>
              <Typography id="demo-simple-select-label">
                {label}
                {required && label && !label.includes(' *') && ' *'}
              </Typography>
              <Autocomplete
                {...field}
                multiple // Enable multiple selections
                disableCloseOnSelect
                onChange={(event, value) => {
                  if (onChange && typeof onChange === 'function') {
                    onChange(value || []);
                  }
                  field.onChange(value || []);
                }}
                value={field.value || []}
                options={menus || []}
                disabled={disable}
                disableClearable={!allowClear}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      onChange={(e, v) => {
                        let fVal = field.value !== null ? [...(typeof field.value === 'string' ? field.value.split('') : field.value)] : [];
                        if (!v) fVal = fVal.filter((fv) => fv.id !== option.id);
                        else fVal.push(option);
                        if (onChange && typeof onChange === 'function') {
                          onChange(fVal || []);
                        }
                        field.onChange(fVal || []);
                      }}
                      checked={
                        field.value
                          ? [...(typeof field.value === 'string' ? field.value.split('') : field.value)].some(
                              (item) => item.id === option.id
                            )
                          : false
                      }
                    />
                    <ListItemText primary={option.name} />
                  </li>
                )}
                renderTags={(value, getTagProps) => (
                  <EllipsisContainer>
                    {value.map((option, index) => (
                      <span key={option.id} {...getTagProps({ index })}>
                        {option.name + (index < value.length - 1 ? ', ' : '')}
                      </span>
                    ))}
                  </EllipsisContainer>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...(languageDropdown && { languagedropdown: languageDropdown.toString() })}
                    placeholder={placeholder}
                    name={name}
                  />
                )}
              />

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
            </Stack>
          </Item>
        </>
      )}
    />
  );
}
