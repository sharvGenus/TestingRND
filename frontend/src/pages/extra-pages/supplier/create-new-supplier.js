import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaperClipOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import request from '../../../utils/request';
import { getDropdownCities, getDropdownCountries, getDropdownStates, getSupplier } from '../../../store/actions';
import { useCities } from '../city/useCities';
import { useStates } from '../state/useStates';
import { useCountries } from '../country/useCountries';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

// ============================|| SUPPLIER  -  FORM ||============================ //

const CreateNewSupplier = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        type: Validations.type,
        name: Validations.name,
        code: Validations.code,
        website: Validations.website,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        telephone: Validations.telephone,
        gstNumber: Validations.gstNumber,
        aadharNumber: Validations.aadharNumber,
        panNumber: Validations.panNumber,
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
    selectedCountry && dispatch(getDropdownStates(selectedCountry));
    selectedState && dispatch(getDropdownCities(selectedState));
  }, [dispatch, selectedCountry, selectedState]);
  const {
    countriesDropdown: { countriesDropdownObject: countryData }
  } = useCountries();
  const {
    statesDropdown: { statesDropdownObject: stateData }
  } = useStates();
  const {
    citiesDropdown: { citiesDropdownObject: cityData }
  } = useCities();

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
    if (update) response = await request('/supplier-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/supplier-form', { method: 'POST', body: values });

    if (response.success) {
      refreshPagination();
      dispatch(getSupplier());
      onClick();
    }
  };
  const supplierData = [
    {
      id: 'Genus',
      name: 'Genus'
    },
    {
      id: 'Vendor',
      name: 'Vendor'
    },
    {
      id: 'Customer',
      name: 'Customer'
    }
  ];

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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Supplier'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('type', 'Supplier Type', supplierData, undefined, true)}
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
              {txtBox('website', 'Website', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email', 'email', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone', 'number')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('gstNumber', 'GSTIN', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('aadharNumber', 'Aadhar Number', 'number')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('panNumber', 'PAN Number', 'text')}
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
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              {fileBox('image/*', 'Attachments', true)}
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              <Button size="small" type="submit" variant="contained" color="primary">
                {update ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewSupplier.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewSupplier;
