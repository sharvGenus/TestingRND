import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import {
  getDropdownCities,
  getDropdownCountries,
  getDropdownProjectSiteStore,
  getDropdownStates,
  getLocationSiteStore
} from '../../../store/actions';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import { useCountries } from '../country/useCountries';
import { useProjectSiteStore } from '../project-site-store/useProjectSiteStore';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

// ============================|| LOCATION - SITE - STORE ||============================ //

const CreateNewLocationSiteStore = (props) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { onClick, data, view, update, refreshPagination } = props;

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        projectSiteStoreId: Validations.projectSiteStore,
        code: Validations.code,
        address: Validations.address,
        pinCode: Validations.pincode,
        countryId: Validations.country,
        stateId: Validations.state,
        cityId: Validations.city
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownCountries());
    dispatch(getDropdownProjectSiteStore());
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
  const { projectSiteStoreDropdown } = useProjectSiteStore();

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      setSelectedCountry(data.city.state.country.id);
      setSelectedState(data.city.state.id);
      setValue('countryId', data.city.state.country.id);
      setValue('stateId', data.city.state.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue]);

  const onFormSubmit = async (values) => {
    values.attachments = 'attachment.jpg';
    let response;
    if (update) response = await request('/location-site-store-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/location-site-store-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getLocationSiteStore());
      onClick();
    }
  };

  const projectData = projectSiteStoreDropdown?.projectSiteStoreDropdownObject;
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Location Site Store'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectSiteStoreId', 'Project Site Store', projectData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('address', 'Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('countryId', 'Country', countryData, handleCountryId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('stateId', 'State', stateData, handleStateId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('cityId', 'City', cityData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('pinCode', 'Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text')}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}></Grid>
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

CreateNewLocationSiteStore.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewLocationSiteStore;
