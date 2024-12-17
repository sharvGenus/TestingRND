import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewCustomerDesignation = (props) => {
  const { setRefresh, data, view, update, refreshPagination, customerData, departmentData, setSelectedCustomer, setSelectedDepartment } =
    props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        code: Validations.code,
        customerId: Validations.other,
        customerDepartmentId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, clearErrors, getValues } = methods;

  const handleBack = useCallback(() => {
    setRefresh();
    const formValues = getValues();
    methods.reset({
      name: '',
      code: '',
      customerId: formValues.customerId,
      customerDepartmentId: formValues.customerDepartmentId
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (!data) {
      handleBack();
    }
    if (view || update) {
      setSelectedCustomer(data?.customer_department?.organization?.id);
      setValue('customerId', data?.customer_department?.organization?.id);
      setValue('customerDepartmentId', data?.customer_department?.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue, clearErrors, handleBack, setSelectedCustomer]);

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/customer-designation-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/customer-designation-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Designation updated successfully!' : 'Designation added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, onChange, req) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
          {...(view ? { disable: true } : update ? { disable: false } : {})}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
          {...(view ? { disabled: true } : update ? { disabled: false } : {})}
        />
      </Stack>
    );
  };

  const handleCustomerId = (e) => {
    setSelectedCustomer(e?.target?.value);
  };

  const handleDepartmentId = (e) => {
    setSelectedDepartment(e?.target?.value);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Customer Designation'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('customerId', 'Customer Name', customerData, handleCustomerId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('customerDepartmentId', 'Department Name', departmentData, handleDepartmentId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Designation Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Designation Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              {!view ? (
                update ? (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                  </Grid>
                ) : (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                  </Grid>
                )
              ) : (
                <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewCustomerDesignation.propTypes = {
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func,
  setRefresh: PropTypes.func,
  customerData: PropTypes.array,
  departmentData: PropTypes.array,
  setSelectedCustomer: PropTypes.func,
  setSelectedDepartment: PropTypes.func
};

export default CreateNewCustomerDesignation;
