import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import request from '../../../utils/request';
import { useCountries } from '../country/useCountries';
import { useStates } from '../state/useStates';
import { useCities } from '../city/useCities';
import { useCompanies } from './useCompanies';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getCompanies, getDropdownCompanies } from 'store/actions/companyMasterAction';
import {
  getCurrentDropdownCities,
  getCurrentDropdownStates,
  getDropdownCities,
  getDropdownCountries,
  getDropdownStates
} from 'store/actions';

// ============================|| COMPANY MASTER FORM ||============================ //

const CreateNewCompany = (props) => {
  const dispatch = useDispatch();
  const { onClick, data, view, update, refreshPagination } = props;
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
        currentOfficeCountryId: Validations.country,
        currentOfficeStateId: Validations.state,
        currentOfficeCityId: Validations.city,
        registeredOfficePincode: Validations.pincode,
        currentOfficeAddress: Validations.address,
        currentOfficePincode: Validations.pincode,
        remarks: Validations.remarks
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    dispatch(getDropdownCountries());
    dispatch(getDropdownCompanies());
  }, [dispatch]);

  const { countriesDropdown } = useCountries();
  const { statesDropdown, currentStatesDropdown } = useStates();
  const { citiesDropdown, currentCitiesDropdown } = useCities();
  const { companiesDropdown } = useCompanies();

  const countryData = countriesDropdown?.countriesDropdownObject;
  const stateData = statesDropdown?.statesDropdownObject;
  const currentStateData = currentStatesDropdown?.currentStatesDropdownObject;
  const cityData = citiesDropdown?.citiesDropdownObject;
  const currentCityData = currentCitiesDropdown?.currentCitiesDropdownObject;
  const companyData = companiesDropdown?.companiesDropdownObject;

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      dispatch(getDropdownStates(data.registered_office_city.state.country.id));
      dispatch(getCurrentDropdownStates(data.current_office_city.state.country.id));
      dispatch(getDropdownCities(data.registered_office_city.state.id));
      dispatch(getCurrentDropdownCities(data.current_office_city.state.id));
      setValue('registeredOfficeCountryId', data.registered_office_city.state.country.id);
      setValue('registeredOfficeStateId', data.registered_office_city.state.id);
      setValue('registeredOfficeCityId', data.registered_office_city.id);
      setValue('currentOfficeCountryId', data.current_office_city.state.country.id);
      setValue('currentOfficeStateId', data.current_office_city.state.id);
      setValue('currentOfficeCityId', data.current_office_city.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue, dispatch]);

  const onFormSubmit = async (values) => {
    !values.parentCompanyId && delete values['parentCompanyId'];
    let response;
    if (update) response = await request('/company-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/company-form', { method: 'POST', body: values });
    if (response.success) {
      refreshPagination();
      dispatch(getCompanies());
      onClick();
    }
  };

  const handleCountryId = (name, e) => {
    if (name === 'registeredOfficeCountryId') {
      dispatch(getDropdownStates(e?.target?.value));
    } else if (name === 'currentOfficeCountryId') {
      dispatch(getCurrentDropdownStates(e?.target?.value));
    }
  };

  const handleStateId = (name, e) => {
    if (name === 'registeredOfficeStateId') {
      dispatch(getDropdownCities(e?.target?.value));
    } else if (name === 'currentOfficeStateId') {
      dispatch(getCurrentDropdownCities(e?.target?.value));
    }
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Company'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Company Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Company Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('parentCompanyId', 'Parent Company', companyData, undefined)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('gstNumber', 'GST No', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile No', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone No', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficeAddress', 'Registered Office Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeCountryId',
                'Registered Office Country',
                countryData,
                handleCountryId.bind(this, 'registeredOfficeCountryId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'registeredOfficeStateId',
                'Registered Office State',
                stateData,
                handleStateId.bind(this, 'registeredOfficeStateId'),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('registeredOfficeCityId', 'Registered Office City', cityData, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('registeredOfficePincode', 'Registered Office Pincode', 'number', true)}
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
              {txtBox('currentOfficePincode', 'Office Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text')}
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

CreateNewCompany.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewCompany;
