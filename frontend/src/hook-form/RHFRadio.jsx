import * as React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormLabel, Tooltip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useFormContext, Controller } from 'react-hook-form';
import { Help as HelpIcon } from '@mui/icons-material';
import { getReccurssiveObjectKeys } from '../utils';

RHFRadio.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  singleLineRadio: PropTypes.bool,
  showTooltip: PropTypes.bool,
  tooltipText: PropTypes.object,
  tooltipOpen: PropTypes.bool,
  onChange: PropTypes.func,
  setShowTooltip: PropTypes.func,
  tooltipPlacement: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  mini: PropTypes.bool,
  style: PropTypes.object,
  defaultValue: PropTypes.string
};

const RadioStyle = styled(RadioGroup)(({ theme, singlelineradio, mini }) => ({
  flexDirection: 'row',
  marginTop: '0 !important',
  '& > label': {
    marginRight: 0,
    alignItems: 'center',
    color: theme.palette.common.black,
    marginLeft: 0,
    marginTop: 12,
    width: mini ? '25%' : '35%'
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: singlelineradio === 'true' ? 'row' : 'column',
    '& > label': {
      width: singlelineradio === 'true' ? '25%' : '100%'
    }
  },
  [theme.breakpoints.between('sm', 'md')]: {
    '& > label': {
      width: '33%',
      paddingRight: 20
    }
  }
}));

export default function RHFRadio({
  name,
  title,
  labels,
  singleLineRadio,
  showTooltip,
  tooltipText,
  tooltipOpen,
  onChange,
  setShowTooltip,
  tooltipPlacement,
  required,
  disabled,
  mini,
  style,
  defaultValue = ''
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={(theme) => ({
              color: theme.palette.common.black,
              display: 'flex',
              alignItems: 'center',
              [theme.breakpoints.down('sm')]: {
                alignItems: 'flex-start'
              }
            })}
          >
            {title}
            {required && !title.includes(' *') && ' *'}
            {showTooltip && tooltipText && (
              <Tooltip
                title={tooltipText}
                aria-label="add"
                placement={tooltipPlacement || 'right'}
                arrow
                enterTouchDelay={0}
                {...{
                  open: tooltipOpen,
                  ...(setShowTooltip && {
                    onMouseEnter: setShowTooltip.bind(null, true),
                    onMouseLeave: setShowTooltip.bind(null, false)
                  })
                }}
              >
                <HelpIcon sx={(theme) => ({ marginLeft: '10px', fill: theme.palette.common.black })} />
              </Tooltip>
            )}
          </FormLabel>
          <RadioStyle
            {...field}
            sx={style}
            singlelineradio={(singleLineRadio || '').toString()}
            onChange={(e) => {
              field.onChange(e);
              if (onChange && typeof onChange === 'function') {
                onChange(e);
              }
            }}
            mini={mini}
          >
            {labels.map((item) => (
              <>
                <FormControlLabel
                  key={item.name + item.value}
                  value={item.value}
                  control={<Radio {...((disabled || item.disabled) && { disabled: true })} />}
                  label={item.name}
                />
                {item?.children || <></>}
              </>
            ))}
          </RadioStyle>
          <Box sx={() => ({ color: '#FF4842', fontSize: '0.75rem', fontWeight: 400, marginTop: '6px !important' })}>
            {!!getReccurssiveObjectKeys(errors, name)?.message && getReccurssiveObjectKeys(errors, name)?.message}
          </Box>
        </>
      )}
    />
  );
}
