import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField, RHFSelectbox, RHFToggleButton, RHFSelectTags } from 'hook-form';

export const QRCodeColumn = ({ modalId, mode, item, isPublished, setOpen, attributesArray, setAttributesArray, columnData }) => {
  const [qrType, setQRType] = useState();

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
    defaultValues: { qrType: 'scanner', separatorType: 'noSeparator' },
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
    values.type = 'QR/Bar Code';
    values.defaultAttributeId = modalId;
    const { name, defaultAttributeId, columnName, required, unique, type, ...otherKeys } = values;
    const newItem = {
      name: name,
      type: type,
      columnName: columnName,
      columnType: 'text',
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
      setQRType(item?.properties?.qrType);
      setValue('separatorType', item?.properties?.separatorType);
      setValue('columnName', item?.columnName);
      setValue('required', Boolean(item?.isRequired === 'true' || item?.isRequired === true));
      setValue('unique', Boolean(item?.isUnique === 'true' || item?.isUnique === true));
      Object.keys(item?.properties || {}).forEach((key) => {
        setValue(key, item?.properties[key]);
      });
    }
  }, [item, mode, setValue]);

  // const handleQRType = (e) => {
  //   setQRType(e.target?.value);
  //   setValue('columnList', '');
  //   setValue('qrDataType', '');
  // };

  const handleSeparatorType = (e) => {
    setValue('separatorType', e.target?.value);
  };

  const selectBox = (name, label, menus, req, placeholder, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          label={label}
          menus={menus}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  // const typeData = [
  //   { id: 'scanner', name: 'Scanner' }
  // { id: 'generator', name: 'Generator' }
  // ];
  // const dataTypeData = [
  //   { id: 'text', name: 'Text' },
  //   { id: 'url', name: 'URL' }
  // ];

  const separatorTypeData = [
    { id: 'noSeparator', name: 'None' },
    { id: 'space', name: 'Space ( )' },
    { id: 'comma', name: 'Comma (,)' },
    { id: 'hyphen', name: 'Hyphen (-)' },
    { id: 'underscore', name: 'Underscore (_)' },
    { id: 'hash', name: 'Hash (#)' },
    { id: 'colon', name: 'Colon (:)' },
    { id: 'semiColon', name: 'Semi-Colon (;)' },
    { id: 'slash', name: 'Slash (/)' }
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          {mode ? 'Add' : 'Edit'} QR/Bar Code Field
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
        {/* <Grid item md={6}>
          {selectBox('qrType', 'Select Type', typeData, false, 'Select Type', handleQRType)}
        </Grid> */}
        {qrType == 'generator' && (
          <Grid item md={12}>
            <RHFSelectTags name="columnList" label="Select Columns" menus={columnData} required />
          </Grid>
        )}
        {/* {qrType == 'scanner' && (
          <Grid item md={12}>
            {selectBox('qrDataType', 'Select Data Type', dataTypeData, false, 'Select data type')}
          </Grid>
        )} */}
        <Grid item md={6}>
          {selectBox('separatorType', 'Select Seperator', separatorTypeData, false, 'Select Seperator', handleSeparatorType)}
        </Grid>
        <Grid container item md={12} sx={{ ml: 1, flexDirection: 'row' }}>
          <Grid item md={12}>
            <RHFToggleButton name="required" label="Required" value={Boolean(item?.isRequired === 'true' || item?.isRequired === true)} />
            <RHFToggleButton name="editable" label="Editable" value={item?.properties?.editable} />
            <RHFToggleButton name="unique" label="Unique" value={Boolean(item?.isUnique === 'true' || item?.isUnique === true)} />
            <RHFToggleButton name="isMaterial" label="Material Field" value={item?.properties?.isMaterial} />
          </Grid>
        </Grid>
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

QRCodeColumn.propTypes = {
  modalId: PropTypes.string,
  mode: PropTypes.string,
  item: PropTypes.object,
  isPublished: PropTypes.bool,
  setOpen: PropTypes.func,
  attributesArray: PropTypes.array,
  setAttributesArray: PropTypes.func,
  columnData: PropTypes.array
};
