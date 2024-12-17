import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { getMaterial, getDropdownUom, getDropdownMaterialType } from '../../../store/actions';
import { useMaterial } from './useMaterial';
import { FormProvider, RHFSelectbox, RHFTextField, RHFRadio } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import { transformDataWithFilePaths } from 'utils';
import CircularLoader from 'components/CircularLoader';
// ============================|| MATERIAL  -  FORM ||============================ //

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const timeoutOverride = 10 * 60000;

const CreateNewMaterial = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;

  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState(false);

  const label1 = [
    {
      value: true,
      name: 'Yes'
    },
    {
      value: false,
      name: 'No'
    }
  ];
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.material,
        code: Validations.materialCode,
        description: Validations.description,
        uomId: Validations.uom,
        hsnCode: Validations.hsnCode,
        materialTypeId: Validations.materialType,
        isSerialNumber: Validations.isSerialNumber,
        ...(!update &&
          fileFields.find((item) => item.name === 'attachments')?.required && {
            attachments: Validations.requiredWithLabel('Attachments')
          })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownMaterialType());
    dispatch(getDropdownUom());
  }, [dispatch]);

  const { uomDropdown } = useMaterial();
  const { materialTypeDropdown } = useMaterial();
  useEffect(() => {
    setValue('isSerialNumber', false);
  }, [setValue]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) handleSetValues(transformDataWithFilePaths(data, fileFields));
  }, [data, update, view, setValue]);

  const onFormSubmit = async (formValues) => {
    setPending(true);
    let response;
    const payload = preparePayloadForFileUpload(formValues, tasks);

    if (update) {
      response = await request('/material-update', {
        method: 'PUT',
        timeoutOverride,
        body: payload,
        params: data.id
      });
    } else {
      response = await request('/material-form', { method: 'POST', timeoutOverride, body: payload });
    }

    if (response.success) {
      const successMessage = update ? 'Material updated successfully!' : 'Material added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      dispatch(getMaterial());
      onClick();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };

  const selectBox = (name, label, menus, req) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(req && { required: true })}
        {...(view ? { disable: true } : update ? { disable: false } : {})}
      />
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        {...(view ? { disabled: true } : update ? { disabled: false } : {})}
      />
    );
  };

  const radioBox = (name, labels, title) => {
    return <RHFRadio name={name} labels={labels} title={title} disabled={view} required="false" />;
  };

  const materialTypeData = materialTypeDropdown?.materialTypeDropdownObject || [];
  const uomData = uomDropdown?.uomDropdownObject || [];

  return (
    <>
      {pending && <CircularLoader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Material'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('materialTypeId', 'Material Type', materialTypeData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('description', 'Description', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('longDescription', 'Specification', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('sapDescription', 'SAP Description', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('uomId', 'Unit of Measurement', uomData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('hsnCode', 'HSN Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            <Grid item md={3} xl={4}>
              {radioBox('isSerialNumber', label1, 'IsSerialNumber', true)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              <FileSections
                fileFields={fileFields}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Cancel
              </Button>
              {!view && (
                <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewMaterial.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewMaterial;
