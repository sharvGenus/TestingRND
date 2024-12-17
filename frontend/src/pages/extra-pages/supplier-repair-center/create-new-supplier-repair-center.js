import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import request from '../../../utils/request';
import { useCountries } from '../country/useCountries';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import { useSupplier } from '../supplier/useSupplier';
import {
  getDropdownSupplier,
  getSupplierRepairCenter,
  getDropdownCountries,
  getDropdownCities,
  getDropdownStates,
  getCurrentDropdownCities,
  getCurrentDropdownStates
} from 'store/actions';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';

const CreateNewSupplierRepairCenter = (props) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState('');
  const [selectedCurrentState, setSelectedCurrentState] = useState('');
  const { onClick, data, view, update, refreshPagination } = props;
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        code: Validations.code,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        telephone: Validations.telephone,
        registeredOfficeAddress: Validations.address,
        registeredOfficePinCode: Validations.pincode,
        currentOfficeAddress: Validations.address,
        currentOfficePinCode: Validations.pincode,
        supplierId: Validations.supplier,
        currentOfficeCountryId: Validations.country,
        currentOfficeStateId: Validations.state,
        currentOfficeCityId: Validations.city,
        registeredOfficeCountryId: Validations.country,
        registeredOfficeStateId: Validations.state,
        registeredOfficeCityId: Validations.city,
        remarks: Validations.remarks
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  useEffect(() => {
    dispatch(getDropdownCountries());
    selectedCountry && dispatch(getDropdownStates(selectedCountry));
    selectedState && dispatch(getDropdownCities(selectedState));
    selectedCurrentCountry && dispatch(getCurrentDropdownStates(selectedCurrentCountry));
    selectedCurrentState && dispatch(getCurrentDropdownCities(selectedCurrentState));
  }, [dispatch, selectedCountry, selectedState, selectedCurrentCountry, selectedCurrentState]);
  const { countriesDropdown } = useCountries();
  const { statesDropdown, currentStatesDropdown } = useStates();
  const { citiesDropdown, currentCitiesDropdown } = useCities();
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    dispatch(getDropdownSupplier());
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
  }, [data, update, view, setValue, dispatch]);

  const { supplierDropdown } = useSupplier();

  const onFormSubmit = async (values) => {
    values.attachments = 'attachment.jpg';
    let response;
    if (update) response = await request('/supplier-repair-center-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/supplier-repair-center-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getSupplierRepairCenter());
      onClick();
    }
  };
  const countryData = countriesDropdown?.countriesDropdownObject;
  const supplierData = supplierDropdown?.supplierDropdownObject;
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Supplier Repair Center'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('supplierId', 'Supplier', supplierData, undefined, true)}
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
              {selectBox('registeredOfficeCityId', 'RegisteredCity', cityData, undefined, true)}
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
              {txtBox('remarks', 'Remarks', 'text', true)}
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

CreateNewSupplierRepairCenter.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewSupplierRepairCenter;
