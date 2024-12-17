import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { getProjectSiteStore } from '../../../store/actions';
import { useCountries } from '../country/useCountries';
import { useProjects } from '../project/useProjects';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import {
  getDropdownCities,
  getDropdownCountries,
  getDropdownStates,
  getDropdownProjects,
  getCurrentDropdownCities,
  getCurrentDropdownStates
} from 'store/actions';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

// ============================|| PROJECT - SITE - STORE ||============================ //

const CreateNewProjectSiteStore = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { projectsDropdown } = useProjects();
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState('');
  const [selectedCurrentState, setSelectedCurrentState] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        projectId: Validations.project,
        code: Validations.code,
        gstNumber: Validations.gstNumber,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        telephone: Validations.telephone,
        registeredOfficeAddress: Validations.address,
        registeredOfficePinCode: Validations.pincode,
        currentOfficeAddress: Validations.address,
        currentOfficePinCode: Validations.pincode,
        currentOfficeCountryId: Validations.country,
        currentOfficeStateId: Validations.state,
        currentOfficeCityId: Validations.city,
        registeredOfficeCountryId: Validations.country,
        registeredOfficeStateId: Validations.state,
        registeredOfficeCityId: Validations.city
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const { countriesDropdown } = useCountries();
  const { statesDropdown, currentStatesDropdown } = useStates();
  const { citiesDropdown, currentCitiesDropdown } = useCities();
  useEffect(() => {
    dispatch(getDropdownCountries());
    selectedCountry && dispatch(getDropdownStates(selectedCountry));
    selectedState && dispatch(getDropdownCities(selectedState));
    selectedCurrentCountry && dispatch(getCurrentDropdownStates(selectedCurrentCountry));
    selectedCurrentState && dispatch(getCurrentDropdownCities(selectedCurrentState));
    dispatch(getDropdownProjects());
  }, [dispatch, selectedCountry, selectedState, selectedCurrentCountry, selectedCurrentState]);
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (view || update) {
      setSelectedCountry(data.register_office_cities?.state.country.id);
      setSelectedCurrentCountry(data.current_office_cities?.state.country.id);
      setSelectedState(data.register_office_cities?.state.id);
      setSelectedCurrentState(data.current_office_cities?.state.id);
      setValue('registeredOfficeCountryId', data.register_office_cities?.state.country.id);
      setValue('registeredOfficeStateId', data.register_office_cities?.state.id);
      setValue('currentOfficeCountryId', data.current_office_cities?.state.country.id);
      setValue('currentOfficeStateId', data.current_office_cities?.state.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue]);
  const onFormSubmit = async (values) => {
    values.attachments = 'attachment.jpg';
    let response;
    if (update) response = await request('/project-site-store-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/project-site-store-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getProjectSiteStore());
      onClick();
    }
  };
  const projectData = projectsDropdown?.projectsDropdownObject;
  const countryData = countriesDropdown?.countriesDropdownObject;
  const stateData = statesDropdown?.statesDropdownObject;
  const cityData = citiesDropdown?.citiesDropdownObject;
  const currentStateData = currentStatesDropdown?.currentStatesDropdownObject;
  const currentCityData = currentCitiesDropdown?.currentCitiesDropdownObject;

  const handleCountryId = (name, e) => {
    if (name === 'registeredOfficeCountryId') {
      setSelectedCountry(e?.target?.value);
    } else if (name === 'currentOfficeCountryId') {
      setSelectedCurrentCountry(e?.target?.value);
    }
  };

  const handleStateId = (name, e) => {
    if (name === 'registeredOfficeStateId') {
      setSelectedState(e?.target?.value);
    } else if (name === 'currentOfficeStateId') {
      setSelectedCurrentState(e?.target?.value);
    }
  };

  const selectBox = (name, label, menus, onChange, req) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={onChange}
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Project Site Store'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, undefined, true)}
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
              {txtBox('gstNumber', 'GSTIN', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone', 'number')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email id', 'email', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficeAddress', 'Registered Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeCountryId',
                'Registered Country',
                countryData,
                handleCountryId.bind(this, 'registeredOfficeCountryId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeStateId',
                'Registered State',
                stateData,
                handleStateId.bind(this, 'registeredOfficeStateId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeCityId', 'Registered City', cityData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficePinCode', 'Registered Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('currentOfficeAddress', 'Office Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'currentOfficeCountryId',
                'Office Country',
                countryData,
                handleCountryId.bind(this, 'currentOfficeCountryId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('currentOfficeStateId', 'Office State', currentStateData, handleStateId.bind(this, 'currentOfficeStateId'), true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('currentOfficeCityId', 'Office City', currentCityData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('currentOfficePinCode', 'Office Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              {fileBox('image/*', 'Store Photo', true)}
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

CreateNewProjectSiteStore.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewProjectSiteStore;
