import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

// project import
// import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { getCustomerStore } from '../../../store/actions/customerStoreMasterAction';
// import { formAction } from '../../../sections/redux';
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

// import { httpService } from 'utils';
import Validations from 'constants/yupValidations';

const CustomerStoreMaster = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState('');
  const [selectedCurrentState, setSelectedCurrentState] = useState('');
  const { projectsDropdown } = useProjects();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
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
        registeredOfficePinCode: Validations.pincode,
        currentOfficeAddress: Validations.address,
        currentOfficeCountryId: Validations.country,
        currentOfficeStateId: Validations.state,
        currentOfficeCityId: Validations.city,
        currentOfficePinCode: Validations.pincode
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownCountries());
    dispatch(getDropdownProjects());
  }, [dispatch]);
  useEffect(() => {
    selectedCountry && dispatch(getDropdownStates(selectedCountry));
  }, [dispatch, selectedCountry]);
  useEffect(() => {
    selectedState && dispatch(getDropdownCities(selectedState));
  }, [dispatch, selectedState]);
  useEffect(() => {
    selectedCurrentCountry && dispatch(getCurrentDropdownStates(selectedCurrentCountry));
  }, [dispatch, selectedCurrentCountry]);
  useEffect(() => {
    selectedCurrentState && dispatch(getCurrentDropdownCities(selectedCurrentState));
  }, [dispatch, selectedCurrentState]);
  const { countriesDropdown } = useCountries();
  const { statesDropdown, currentStatesDropdown } = useStates();
  const { citiesDropdown, currentCitiesDropdown } = useCities();

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
    if (update) response = await request('/customer-stores-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/customer-stores-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getCustomerStore());
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
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(onChange && { onChange })}
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Create New ') + 'Customer Store'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, undefined, true)}
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
              {selectBox('registeredOfficeCityId', 'Registered City', cityData, true)}
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
              {selectBox('currentOfficeCityId', 'Office City', currentCityData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('currentOfficePinCode', 'Office Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text')}
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
              <Button size="small" type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CustomerStoreMaster.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CustomerStoreMaster;
