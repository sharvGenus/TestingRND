import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFSelectbox, RHFTextField, RHFToggleButton } from 'hook-form';

export const SequenceColumn = ({ modalId, mode, item, isPublished, setOpen, attributesArray, setAttributesArray, columnData }) => {
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
        number: Validations.allowedColumns,
        attributeName: Validations.required
      })
    ),
    mode: 'all'
  });

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;

  const onFormSubmit = async (processedValues) => {
    const values = Object.fromEntries(
      Object.entries(processedValues).map(([key, value]) => {
        if (key.startsWith('separator') && processedValues[key] === undefined) {
          return [key, ''];
        }
        return [key, value];
      })
    );
    values.type = 'Key Generator';
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
      setValue('columnName', item?.columnName);
      setValue('required', Boolean(item?.isRequired === 'true' || item?.isRequired === true));
      setValue('unique', Boolean(item?.isUnique === 'true' || item?.isUnique === true));
      Object.keys(item?.properties || {}).forEach((key) => {
        setValue(key, item?.properties[key]);
      });
    }
  }, [item, mode, setValue]);

  const arrayLength = methods.watch('number');

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          {mode ? 'Add' : 'Edit'} Key Generator Field
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
          {txtBox('number', 'Number of Columns', 'number', true, 'Enter Number')}
        </Grid>
        {arrayLength >= 1 && arrayLength <= 5 && (
          <>
            <Grid item md={12}>
              <Typography>Key Format *</Typography>
            </Grid>
            <Grid container item spacing={2} sx={{ marginTop: -3 }}>
              <Grid item md={6}>
                {txtBox('prefix', '', 'text', false, 'Enter Prefix')}
              </Grid>
              <Grid item md={2}>
                {txtBox('separator0', '', 'text', false, 'Separator')}
              </Grid>
            </Grid>
          </>
        )}
        {arrayLength >= 1 && arrayLength <= 5
          ? Array.from({ length: arrayLength }, (_, index) => (
              <Grid container item spacing={2} key={index}>
                <Grid item md={6}>
                  <RHFSelectbox name={`column${index + 1}`} placeholder="Select Column" menus={columnData} required />
                </Grid>
                <Grid item md={2}>
                  {txtBox(`separator${index + 1}`, '', 'text', false, 'Separator')}
                </Grid>
              </Grid>
            ))
          : null}
        {arrayLength >= 1 && arrayLength <= 5 && (
          <Grid container item spacing={2}>
            <Grid item md={6}>
              {txtBox('suffix', '', 'text', false, 'Enter suffix')}
            </Grid>
          </Grid>
        )}
        <Grid item md={12} sx={{ ml: 1 }}>
          {/* <RHFToggleButton name="required" label="Required" value={Boolean(item?.isRequired === 'true' || item?.isRequired === true)} /> */}
          {/* <RHFToggleButton name="editable" label="Editable" value={item?.properties?.editable} /> */}
          <RHFToggleButton name="unique" label="Unique" value={Boolean(item?.isUnique === 'true' || item?.isUnique === true)} />
          <RHFToggleButton name="defaultHide" label="Default Hide" value={item?.properties?.defaultHide} />
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

SequenceColumn.propTypes = {
  modalId: PropTypes.string,
  mode: PropTypes.string,
  item: PropTypes.object,
  isPublished: PropTypes.bool,
  setOpen: PropTypes.func,
  attributesArray: PropTypes.array,
  setAttributesArray: PropTypes.func,
  columnData: PropTypes.array
};
