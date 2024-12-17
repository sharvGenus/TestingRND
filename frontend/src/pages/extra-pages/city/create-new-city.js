import React, { useCallback, useEffect } from 'react';
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
import { getDropdownCountries, getDropdownStates } from '../../../store/actions';
import { useCountries } from '../country/useCountries';
import { useStates } from '../state/useStates';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewCity = (props) => {
  const dispatch = useDispatch();
  const { setRefresh, data, view, update, refreshPagination } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        code: Validations.other,
        countryId: Validations.country,
        stateId: Validations.state
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const handleCountryId = (e) => {
    dispatch(getDropdownStates(e?.target?.value));
  };

  useEffect(() => {
    dispatch(getDropdownCountries());
  }, [dispatch]);

  const { countriesDropdown } = useCountries();
  const { statesDropdown } = useStates();

  const countryData = countriesDropdown?.countriesDropdownObject || [];
  const stateData = statesDropdown?.statesDropdownObject || [];

  const { handleSubmit, setValue, clearErrors } = methods;

  const handleBack = useCallback(() => {
    setRefresh();
    methods.reset({
      name: '',
      code: '',
      integrationId: '',
      countryId: '',
      stateId: ''
    });
  }, [setRefresh, methods]);

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
      dispatch(getDropdownStates(data.state.country.id));
      setValue('countryId', data.state.country.id);
      setValue('stateId', data.state.id);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, dispatch, clearErrors, handleBack]);

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/city-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/city-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'City updated successfully!' : 'City added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'City'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('countryId', 'Country Name', countryData, true, handleCountryId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('stateId', 'State Name', stateData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'City Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 1 }}>
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

CreateNewCity.propTypes = {
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewCity;
