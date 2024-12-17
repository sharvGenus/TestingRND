import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Typography, TextField, FormControl, Stack, FormHelperText } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { DatePicker, DesktopDatePicker, TimePicker } from '@mui/x-date-pickers';

const RHFDateTimePicker = ({ name, label, onChange, disabled, required = false, ...other }) => {
  const { control } = useFormContext();
  const { errorMessage, timeFormat, pickerType, minDate, maxDate, setInsideErrors } = other;

  RHFDateTimePicker.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool
  };

  const formatDate = (val) => format(new Date(val).getTime() - 330 * 60000, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  const checkValueConditions = useCallback(
    (value) => {
      let errorMessage2 = '';
      if (maxDate && value > new Date(`${maxDate}T23:59:00Z`)) {
        errorMessage2 = `Maximum date should be ${format(new Date(maxDate), 'dd/MM/yyyy')}`;
      } else if (value < new Date(`${minDate}`)) {
        errorMessage2 = `Minimum date should be ${format(new Date(minDate), 'dd/MM/yyyy')}`;
      }
      return errorMessage2;
    },
    [minDate, maxDate]
  );

  const firstRender = useRef();
  useEffect(() => {
    if (!firstRender.current) {
      if (control?._fields?.[name]?._f?.value) {
        let warningData = checkValueConditions(new Date(control?._fields?.[name]?._f?.value));
        if (warningData) {
          setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
        }
      }
      firstRender.current = true;
    } else {
      firstRender.current = false;
    }
  }, [name, control, checkValueConditions, setInsideErrors]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field, formState: { errors } }) => (
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: errors[name] ? '#ff4d4f' : ''
                }
              }
            }}
          >
            <Stack spacing={1}>
              <Typography>
                {label}
                {required && !label?.includes(' *') && ' *'}
              </Typography>
              {pickerType === 'dateTimeBoth' ? (
                <DateTimePicker
                  {...field}
                  disabled={disabled}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => {
                    if (value) {
                      let warningData = checkValueConditions(value);
                      setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
                    }
                    const formattedDate = formatDate(value);
                    if (onChange && typeof onChange === 'function') {
                      onChange(formattedDate);
                    }
                    field.onChange(formattedDate);
                  }}
                  format={timeFormat === '12hour' ? 'dd/MM/yyyy hh:mm a' : 'dd/MM/yyyy HH:mm'}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={timeFormat === '12hour' ? true : false}
                />
              ) : pickerType === 'dateOnly' ? (
                <DesktopDatePicker
                  inputFormat="dd/MM/yyyy"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => {
                    if (value) {
                      let warningData = checkValueConditions(value);
                      setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
                    }
                    const formattedDate = formatDate(value);
                    if (onChange && typeof onChange === 'function') {
                      onChange(formattedDate);
                    }
                    field.onChange(formattedDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              ) : pickerType === 'monthYearBoth' ? (
                <DatePicker
                  inputFormat="MM-yyyy"
                  views={['month', 'year']}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => {
                    if (value) {
                      let warningData = checkValueConditions(value);
                      setInsideErrors && setInsideErrors((prev) => ({ ...prev, [name]: warningData }));
                    }
                    const formattedDate = formatDate(value);
                    if (onChange && typeof onChange === 'function') {
                      onChange(formattedDate);
                    }
                    field.onChange(formattedDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              ) : (
                <TimePicker
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => {
                    const formattedDate = formatDate(value);
                    if (onChange && typeof onChange === 'function') {
                      onChange(formattedDate);
                    }
                    field.onChange(formattedDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={timeFormat === '12hour' ? true : false}
                />
              )}
              <FormHelperText
                sx={{
                  position: 'absolute',
                  top: 60,
                  left: 3,
                  color: '#ff4d4f'
                }}
              >
                {errors[name]?.message || errorMessage}
              </FormHelperText>
            </Stack>
          </FormControl>
        )}
      />
    </LocalizationProvider>
  );
};

export default RHFDateTimePicker;
