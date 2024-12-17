import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// material-ui
import { Grid, Button } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const encryptionData = [
  { name: 'None', id: 'NONE' },
  { name: 'SSL/TLS', id: 'TLS' },
  { name: 'STARTTLS', id: 'STARTTLS' }
];

const CreateNewSmtp = (props) => {
  const dispatch = useDispatch();
  const { setRefresh, data, view, update, refreshPagination } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        server: Validations.server,
        port: Validations.port,
        encryption: Validations.encryption,
        username: Validations.email,
        password: Validations.password
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, clearErrors } = methods;
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      handleSetValues(data);
    } else {
      setValue('encryption', encryptionData[0].id);
    }

    clearErrors();
  }, [data, update, view, setValue, dispatch, clearErrors]);

  const onFormSubmit = async (values) => {
    let response;
    if (update) response = await request('/smtp-configuration-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/smtp-configuration-create', { method: 'POST', body: values });
    if (response.success) {
      refreshPagination();
      handleBack();
    } else {
      toast(response.error?.message || 'Something wrong happened', { variant: 'error' });
    }
  };

  const handleBack = () => {
    setRefresh();
    methods.reset({
      name: '',
      code: '',
      integrationId: '',
      countryId: '',
      stateId: ''
    });
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        onChange={onChange}
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'SMTP Configuration'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {txtBox('server', 'Server', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('port', 'Port', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('encryption', 'Encryption', encryptionData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('username', 'Email', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('password', 'Password', 'password', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text')}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              {!view ? (
                update ? (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                  </Grid>
                ) : (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
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

CreateNewSmtp.propTypes = {
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewSmtp;
