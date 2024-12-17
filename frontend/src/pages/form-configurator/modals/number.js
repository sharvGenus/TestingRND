/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSelectbox, RHFToggleButton } from 'hook-form';

export const NumberColumn = ({ modalId, mode, item, isPublished, setOpen, attributesArray, setAttributesArray }) => {
  const [commaCheckbox, setCommaCheckbox] = useState(false);
  const [currencyCheckbox, setCurrencyCheckbox] = useState(false);
  const [decimalCheckbox, setDecimalCheckbox] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const txtBox = (name, label, type, req, placeholder = false) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          disabled={isPublished && !mode && modalId && item.id && name == 'columnName' ? true : false}
          placeholder={placeholder}
          {...(req && { required: true })}
          onBlur={(e) => {
            e.target.value = e.target.value.trim();
            methods.setValue(name, e.target.value);
            if ((!item.id || (item.id && !isPublished)) && name === 'name') {
              const columnNameValue = e.target.value
                .replace(/[^A-Za-z ]/g, '')
                .replace(/ +/g, '_')
                .replace(/_+/g, '_')
                .slice(0, 16)
                .toLowerCase();
              methods.setValue('columnName', columnNameValue);
              clearErrors('columnName');
            }
            const existItem = attributesArray.some((element) => {
              if (name === e.target.name && element?.[name] === e.target.value && element?.['columnName'] !== item?.columnName) {
                return true;
              }
              return false;
            });
            if (existItem) {
              setError(name, { message: label + ' already exists' }, { shouldFocus: true });
            }
          }}
        />
      </Stack>
    );
  };

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.attributeTitle,
        columnName: Validations.dbColumn,
        attributeName: Validations.required
      })
    ),
    defaultValues: { commaType: 'Indian', currencyType: '₹', decimalPoints: 2 },
    mode: 'all'
  });
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;

  const onFormSubmit = async (values) => {
    values.type = 'Number';
    values.defaultAttributeId = modalId;
    if (!values.commaType) {
      values.commaType = 'Indian';
    }
    if (!values.currencyType) {
      values.currencyType = '₹';
    }
    if (!values.decimalPoints) {
      values.decimalPoints = 2;
    }
    const { name, defaultAttributeId, columnName, mappingColumn, required, unique, type, ...otherKeys } = values;
    const newItem = {
      name: name,
      type: type,
      columnName: columnName,
      columnType: 'text',
      mappingColumn: mappingColumn,
      isRequired: required,
      isUnique: unique,
      defaultAttributeId: defaultAttributeId,
      properties: otherKeys
    };
    const existingItem =
      newItem?.columnName && newItem?.columnName !== item?.columnName
        ? attributesArray.findIndex((element) => element.columnName === newItem?.columnName)
        : -1;
    if (existingItem !== -1) {
      setError('columnName', { message: 'Column Name already exists' }, { shouldFocus: true });
    } else {
      const existingItemIndex = newItem?.properties?.fieldId
        ? attributesArray.findIndex((element) => element.id === newItem?.properties?.fieldId)
        : item?.name
        ? attributesArray.findIndex((element) => element.name === item?.name)
        : -1;
      if (existingItemIndex !== -1) {
        attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
      } else {
        setAttributesArray([...attributesArray, newItem]);
      }
      methods.reset();
      setOpen(false);
    }
  };
  useEffect(() => {
    if (!mode) {
      setValue('fieldId', item?.id);
      setValue('name', item?.name);
      setValue('columnName', item?.columnName);
      setValue('required', Boolean(item?.isRequired === 'true' || item?.isRequired === true));
      setValue('unique', Boolean(item?.isUnique === 'true' || item?.isUnique === true));
      Object.keys(item?.properties || {}).forEach((key) => {
        setValue(key, item?.properties[key]);
      });
      if (item?.properties?.comma) {
        setCommaCheckbox(item?.properties?.comma);
      }
      if (item?.properties?.currency) {
        setCurrencyCheckbox(item?.properties?.currency);
      }
      if (item?.properties?.decimal) {
        setDecimalCheckbox(item?.properties?.decimal);
      }
    }
  }, [item, mode, setValue]);

  const selectBox = (name, label, menus, req, placeholder) => {
    return (
      <Stack>
        <RHFSelectbox name={name} placeholder={placeholder} label={label} menus={menus} {...(req && { required: true })} />
      </Stack>
    );
  };

  const selectCurrenctData = [
    { name: '₹ - Rupee Symbol', id: '₹' },
    { name: '$ - Dollar Symbol', id: '$' },
    { name: '€ - Euro Symbol', id: '€' },
    { name: '£ - Pound Symbol', id: '£' }
  ];

  const selectCommaData = [
    { name: 'Indian Numeration (eg. 52,74,859)', id: 'Indian' },
    { name: 'International Numeration (eg. 5,274,859)', id: 'Other' }
  ];

  const checkBox = (name, label, onChange, req, value) => {
    return (
      <RHFCheckbox
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        {...(req && { required: true })}
        sx={{ ml: -0.5 }}
      />
    );
  };
  const handleCheck = (name, e) => {
    if (name === 'comma') {
      setCommaCheckbox(e);
    } else if (name === 'currency') {
      setCurrencyCheckbox(e);
    } else if (name === 'decimal') {
      setDecimalCheckbox(e);
    }
  };
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleToggleOptions();
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          {mode ? 'Add' : 'Edit'} Number Field
        </Grid>
        <Grid item md={12}>
          {txtBox('name', 'Display Name', 'text', true, 'Enter Display Name')}
        </Grid>
        <Grid item md={6}>
          {txtBox('attributeName', 'Attribute Name', 'text', true, 'Enter Attribute Name')}
        </Grid>
        <Grid item md={6}>
          {txtBox('columnName', 'DB Column Name', 'text', true, 'Enter DB Column')}
        </Grid>
        <Grid item md={6}>
          {txtBox('defaultValue', 'Default Value', 'number', false, 'Enter Default value')}
        </Grid>
        <Grid item md={12}>
          {checkBox('decimal', 'Decimal Place', handleCheck.bind(this, 'decimal'), false, decimalCheckbox)}
          {decimalCheckbox && txtBox('decimalPoints', '', 'text', false, 'Round to 2 decimal places (Default)')}
        </Grid>
        <Grid item md={12} sx={{ ml: 1 }}>
          <RHFToggleButton name="required" label="Required" value={Boolean(item?.isRequired === 'true' || item?.isRequired === true)} />
          <RHFToggleButton name="unique" label="Unique" value={Boolean(item?.isUnique === 'true' || item?.isUnique === true)} />
          <RHFToggleButton name="editable" label="Editable" value={item?.properties?.editable} />
          <RHFToggleButton name="disableOnSearch" label="Disable On Search" value={item?.properties?.disableOnSearch} />
        </Grid>
        {/* <Grid item md={12}>
          <Typography color="primary">
            <span
              onClick={handleToggleOptions}
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onKeyPress={handleKeyPress}
              role="button"
              tabIndex={0}
            >
              Advance Options
            </span>
          </Typography>
        </Grid>
        {showOptions && (
          <Grid container justifyContent="space-between" spacing={3} sx={{ pl: 2, mt: 0.5 }}>
            <Grid item md={6}>
              {txtBox('minValue', 'Min Value', 'number', false, 'Enter min value')}
            </Grid>
            <Grid item md={6}>
              {txtBox('maxValue', 'Max Value', 'number', false, 'Enter max value')}
            </Grid>
            <Grid item md={6}>
              {txtBox('minLength', 'Min Length', 'number', false, 'Enter min length')}
            </Grid>
            <Grid item md={6}>
              {txtBox('maxLength', 'Max Length', 'number', false, 'Enter max length')}
            </Grid>
            <Grid item md={6}>
              {txtBox('prefix', 'Prefix', 'text', false, 'Enter prefix')}
            </Grid>
            <Grid item md={6}>
              {txtBox('suffix', 'Suffix', 'text', false, 'Enter suffix')}
            </Grid>
            <Grid item md={12} sx={{ ml: 1 }}>
              {checkBox('comma', 'Comma Seperator', handleCheck.bind(this, 'comma'), false, commaCheckbox)}
              {commaCheckbox && selectBox('commaType', '', selectCommaData, false, 'Select format')}
            </Grid>
            <Grid item md={12} sx={{ ml: 1 }}>
              {checkBox('currency', 'Currency Sign', handleCheck.bind(this, 'currency'), false, currencyCheckbox)}
              {currencyCheckbox && selectBox('currencyType', '', selectCurrenctData, false, 'Select currency')}
            </Grid>
            <Grid item md={12} sx={{ ml: 1 }}>
              {checkBox('decimal', 'Decimal Place', handleCheck.bind(this, 'decimal'), false, decimalCheckbox)}
              {decimalCheckbox && txtBox('decimalPoints', '', 'text', false, 'Round to 2 decimal places (Default)')}
            </Grid>
            <Grid item md={12} sx={{ ml: 1 }}>
              {checkBox('percentage', 'Percentage Value', handleCheck.bind(this, 'percentage'), false)}
            </Grid>
          </Grid>
        )} */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" type="submit" variant="contained" disabled={Object.keys(errors).length > 0}>
            {mode ? 'Save' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

NumberColumn.propTypes = {
  modalId: PropTypes.string,
  mode: PropTypes.string,
  item: PropTypes.object,
  isPublished: PropTypes.bool,
  setOpen: PropTypes.func,
  attributesArray: PropTypes.array,
  setAttributesArray: PropTypes.func
};
