import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField, RHFToggleButton } from 'hook-form';

export const PhoneColumn = ({ modalId, mode, item, isPublished, setOpen, attributesArray, setAttributesArray }) => {
  const txtBox = (name, label, type, req, placeholder = false) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          multiline={name === 'payload' ? true : false}
          topError={name === 'payload' ? true : false}
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
            if (name === 'payload') {
              const payloadData = e.target.value?.replace(/\s*(?=\{|}|,|:)\s*/g, '').replace(/\s*(?<=\}|{|,|:)\s*/g, '');
              methods.setValue('payload', payloadData);
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
        attributeName: Validations.required,
        payload: Yup.string().test('is-valid-json-object', 'Invalid JSON object', (value) => {
          if (!value) return true;
          try {
            return typeof JSON.parse(value) === 'object' && JSON.parse(value) !== null;
          } catch (e) {
            return false;
          }
        })
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

  const onFormSubmit = async (values) => {
    values.type = 'Phone';
    values.defaultAttributeId = modalId;
    values.payload = values.payload ? JSON.parse(values.payload) : values.payload;
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
    const verifyColumn = {
      name: 'Verify ' + name,
      type: 'Chip Select',
      columnName: 'v_' + columnName,
      columnType: 'text',
      isRequired: false,
      defaultAttributeId: '9f9af2b6-1113-48e0-a5c5-0a34e2226937',
      properties: {
        attributeName: 'Verify ' + name,
        values: 'Verified,Not Verified,Refused',
        defaultValue: '',
        defaultDataValueInColumn: 'Not Verified',
        editable: false,
        defaultHide: true,
        verifyAttribute: true,
        currentUser: false
      }
    };
    const verifyResponse = {
      name: 'Response ' + name,
      type: 'Text',
      columnName: 'vr_' + columnName,
      columnType: 'text',
      isRequired: false,
      isUnique: false,
      defaultAttributeId: 'd7268ee9-971a-42e5-bd23-235d86e8b0d9',
      properties: {
        attributeName: 'Response ' + name,
        editable: false,
        defaultHide: true,
        disableOnSearch: false,
        verifyAttribute: true,
        isMaterial: false
      }
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
        if (newItem.properties?.doVerify) {
          if (!newItem.properties.verifyApplied) {
            newItem.properties.verifyApplied = true;
            newItem.properties.verifyResponseApplied = true;
            attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
            setAttributesArray([...attributesArray, verifyColumn, verifyResponse]);
          } else if (!newItem.properties.verifyResponseApplied) {
            newItem.properties.verifyResponseApplied = true;
            attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
            setAttributesArray([...attributesArray, verifyResponse]);
          } else {
            attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
          }
        } else {
          attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
        }
      } else {
        if (newItem.properties?.doVerify) {
          newItem.properties.verifyApplied = true;
          newItem.properties.verifyResponseApplied = true;
          setAttributesArray([...attributesArray, newItem, verifyColumn, verifyResponse]);
        } else {
          setAttributesArray([...attributesArray, newItem]);
        }
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
      item.properties?.payload &&
        setValue(
          'payload',
          typeof item.properties.payload === 'object' ? JSON.stringify(item.properties.payload) : item.properties.payload
        );
      Object.keys(item?.properties || {}).forEach((key) => {
        if (key !== 'payload') {
          setValue(key, item.properties[key]);
        }
      });
    }
  }, [item, mode, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          {mode ? 'Add' : 'Edit'} Phone Field
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
        <Grid item md={12}>
          {txtBox('endpoint', 'API Endpoint URL', 'text', false, 'Enter API Endpoint')}
        </Grid>
        <Grid item md={12}>
          {txtBox('payload', 'API Payload', 'text', false, 'Enter API Payload')}
        </Grid>
        <Grid item md={6}>
          {txtBox('receiverKey', 'API Receiver Key', 'text', false, 'Enter API Receiver Key')}
        </Grid>
        <Grid item md={6}>
          {txtBox('messageKey', 'API Message Key', 'text', false, 'Enter API Message Key')}
        </Grid>
        <Grid container item md={12} sx={{ ml: 1 }}>
          <Grid item md={4}>
            <RHFToggleButton name="required" label="Required" value={Boolean(item?.isRequired === 'true' || item?.isRequired === true)} />
          </Grid>
          <Grid item md={4}>
            <RHFToggleButton name="unique" label="Unique" value={Boolean(item?.isUnique === 'true' || item?.isUnique === true)} />
          </Grid>
          <Grid item md={4}>
            <RHFToggleButton name="editable" label="Editable" value={item?.properties?.editable} />
          </Grid>
        </Grid>
        <Grid container item md={12} sx={{ ml: 1 }}>
          <Grid item md={4}>
            <RHFToggleButton name="currentUser" label="Current User" value={item?.properties?.currentUser} />
          </Grid>
          <Grid item md={4}>
            <RHFToggleButton name="doVerify" label="Verify Number" value={item?.properties?.doVerify} />
          </Grid>
          <Grid item md={4}>
            <RHFToggleButton name="disableOnSearch" label="Disable On Search" value={item?.properties?.disableOnSearch} />
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

PhoneColumn.propTypes = {
  modalId: PropTypes.string,
  mode: PropTypes.string,
  item: PropTypes.object,
  isPublished: PropTypes.bool,
  setOpen: PropTypes.func,
  attributesArray: PropTypes.array,
  setAttributesArray: PropTypes.func
};
