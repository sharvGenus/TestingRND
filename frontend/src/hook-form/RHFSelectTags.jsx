import * as React from 'react';
import { Typography, TextField, FormControl, Stack, FormHelperText, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useFormContext, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { getReccurssiveObjectKeys } from '../utils';

RHFSelectTags.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  disable: PropTypes.bool,
  required: PropTypes.bool,
  single: PropTypes.bool,
  success: PropTypes.bool,
  failure: PropTypes.bool,
  autoSelect: PropTypes.bool,
  errorMessage: PropTypes.string,
  customKeyName: PropTypes.string,
  placeholder: PropTypes.string,
  showId: PropTypes.bool
};

export default function RHFSelectTags({
  name,
  label,
  menus,
  onChange,
  disable,
  required = false,
  success = false,
  failure = false,
  single = false,
  autoSelect = false,
  errorMessage,
  customKeyName,
  placeholder,
  showId = false
}) {
  const { control } = useFormContext();
  const hasRendered = React.useRef(false);

  React.useEffect(() => {
    if (autoSelect && menus && menus.length > 0 && menus[0]?.id && !hasRendered.current && onChange && typeof onChange === 'function') {
      onChange([menus[0]?.id]);
      hasRendered.current = true;
    }
  }, [autoSelect, menus, onChange]);

  const defaultValue = React.useCallback(
    (field) => {
      return (menus || []).filter((option) => (Array.isArray(field.value) ? field.value.includes(option.id) : field.value === option.id));
    },
    [menus]
  );

  const StyledAutocomplete = styled(Autocomplete)({
    backgroundColor: disable ? '#f2f2f2' : 'none',
    '& .MuiChip-deleteIcon': {
      display: disable ? 'none' : null
    },
    '& .MuiChip-root': {
      backgroundColor: success ? '#00FF7F' : failure ? '#FA8072' : '#f2f2f2',
      color: '#000',
      opacity: 1
    },
    '& .MuiChip-root.Mui-disabled': {
      backgroundColor: success ? '#00FF7F' : failure ? '#FA8072' : '#f2f2f2',
      color: '#000',
      opacity: 1
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none'
      },
      minHeight: '40px'
    }
  });

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, formState: { errors } }) => (
        <FormControl
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: getReccurssiveObjectKeys(errors, name)?.message ? '#ff4d4f' : ''
              }
            }
          }}
        >
          <Stack spacing={1}>
            <Typography id="demo-simple-select-label">
              {label}
              {required && !label.includes(' *') && ' *'}
            </Typography>
            <Box
              style={{
                overflowY: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px'
              }}
            >
              <StyledAutocomplete
                {...field}
                multiple
                disableCloseOnSelect
                disabled={disable}
                disableClearable
                onChange={(event, value) => {
                  if (single && value?.length > 1) {
                    return;
                    // const singleValue = value.filter((x) =>
                    //   typeof field.value === 'string' ? x.id !== field.value : !field.value.includes(x.id)
                    // );
                    // if (onChange && typeof onChange === 'function') {
                    //   onChange(value ? singleValue.map((option) => option.id) : []);
                    // }
                    // field.onChange(value ? singleValue.map((option) => option.id) : []);
                  } else {
                    if (onChange && typeof onChange === 'function') {
                      onChange(value ? value.map((option) => option.id) : []);
                    }
                    field.onChange(value ? value.map((option) => option.id) : []);
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: 0
                  }
                }}
                value={defaultValue(field)}
                options={menus || []}
                getOptionLabel={(option) => option?.[customKeyName || 'name']}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={defaultValue(field)?.length ? '' : placeholder}
                    InputProps={{ ...params.InputProps, style: { minHeight: '40px' } }}
                  />
                )}
                {...(showId && {
                  renderOption: (props, option) => (
                    <Box p={1} {...props}>
                      <Typography>{option?.name}</Typography>
                      <Typography sx={{ fontSize: 12 }}>&nbsp;{'<' + option?.id + '>'}</Typography>
                    </Box>
                  )
                })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      style={{ margin: '0.2rem', padding: '10px 5px', maxWidth: '250px' }}
                      key={option?.id}
                      label={option?.[customKeyName || 'name']}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Box>
            <FormHelperText
              sx={{
                position: 'absolute',
                top: 60,
                left: 3,
                color: '#ff4d4f'
              }}
            >
              {((!!getReccurssiveObjectKeys(errors, name)?.message || !!errorMessage) && getReccurssiveObjectKeys(errors, name)?.message) ||
                errorMessage}
            </FormHelperText>
          </Stack>
        </FormControl>
      )}
    />
  );
}
