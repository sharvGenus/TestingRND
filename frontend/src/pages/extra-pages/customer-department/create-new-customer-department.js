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

const CreateNewCustomerDepartment = (props) => {
  const { setRefresh, data, view, update, refreshPagination, customerData, setSelectedCustomer } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        code: Validations.code,
        customerId: Validations.other
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
      customerId: formValues.customerId
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
      setValue('customerId', data?.organization?.id);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/customer-department-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/customer-department-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Department updated successfully!' : 'Department added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          onChange={onChange}
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Customer Department'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('customerId', 'Customer Name', customerData, true, handleCustomerId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Department Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Department Code', 'text', true)}
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

CreateNewCustomerDepartment.propTypes = {
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func,
  setRefresh: PropTypes.func,
  customerData: PropTypes.array,
  setSelectedCustomer: PropTypes.func
};

export default CreateNewCustomerDepartment;
