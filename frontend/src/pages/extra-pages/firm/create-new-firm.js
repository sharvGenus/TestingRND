import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import request from '../../../utils/request';
import { getFirms } from '../../../store/actions/firmMasterAction';
import { useCountries } from '../country/useCountries';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import { getDropdownCities, getDropdownCountries, getDropdownStates } from 'store/actions';
import Validations from 'constants/yupValidations';

const CreateNewFirm = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        code: Validations.code,
        gstNumber: Validations.gstNumber,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        telephone: Validations.telephone,
        registeredOfficeAddress: Validations.address,
        registeredOfficeCountryId: Validations.country,
        registeredOfficeStateId: Validations.state,
        registeredOfficeCityId: Validations.city,
        registeredOfficePincode: Validations.pincode
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownCountries());
  }, [dispatch]);
  useEffect(() => {
    selectedCountry && dispatch(getDropdownStates(selectedCountry));
  }, [dispatch, selectedCountry]);
  useEffect(() => {
    selectedState && dispatch(getDropdownCities(selectedState));
  }, [dispatch, selectedState]);
  const { countriesDropdown } = useCountries();
  const { statesDropdown } = useStates();
  const { citiesDropdown } = useCities();

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      setSelectedCountry(data.city.state.country.id);
      setSelectedState(data.city.state.id);
      setValue('registeredOfficeCountryId', data.city.state.country.id);
      setValue('registeredOfficeStateId', data.city.state.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue]);

  const onFormSubmit = async (values) => {
    let response;
    if (update) response = await request('/firm-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/firm-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getFirms());
      onClick();
    }
  };

  const countryData = countriesDropdown?.countriesDropdownObject;
  const stateData = statesDropdown?.statesDropdownObject;
  const cityData = citiesDropdown?.citiesDropdownObject;

  const handleCountryId = (e) => {
    setSelectedCountry(e?.target?.value);
  };

  const handleStateId = (e) => {
    setSelectedState(e?.target?.value);
  };

  const selectBox = (name, label, menus, onChange, req) => {
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

  const fileBox = (accept, label, req) => {
    return (
      <Stack spacing={1}>
        {req ? (
          <Button size="small" variant="outlined" htmlFor="files" color="primary" required>
            <PaperClipOutlined />
            &nbsp;{label}
          </Button>
        ) : (
          <Button size="small" variant="outlined" htmlFor="files" color="primary">
            {label}
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Contractor'}>
          <Grid container spacing={4}>
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
              {txtBox('gstNumber', 'GSTIN', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone', 'number')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficeAddress', 'Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeCountryId', 'Country', countryData, handleCountryId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeStateId', 'State', stateData, handleStateId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeCityId', 'City', cityData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficePincode', 'Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              {fileBox('image/*', 'Attachments', true)}
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && (
                <Button size="small" type="submit" variant="contained" color="primary">
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

CreateNewFirm.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewFirm;
