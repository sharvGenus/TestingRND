import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
// material-ui
import { Button, Grid } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { useCountries } from '../country/useCountries';
import { useStates } from '../state/useStates';
import { useCities } from '../city/useCities';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getDropdownCities,
  getDropdownCountries,
  getDropdownOrganization,
  getDropdownStates,
  getLovsForMasterName,
  getOrganizationsLocation
} from 'store/actions';
import { concateNameAndCode } from 'utils';
import toast from 'utils/ToastNotistack';

const CreateNewOrganiationLocation = (props) => {
  const { orgType } = useParams();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { onClick, data, view, update, refreshPagination, title } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.orgName,
        code: Validations.code,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        gstNumber: Validations.gstNumber,
        address: Validations.address,
        countryId: Validations.country,
        stateId: Validations.state,
        cityId: Validations.city,
        pinCode: Validations.pincode,
        parentId: Validations.organizationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
    dispatch(getDropdownCountries());
  }, [dispatch]);
  useEffect(() => {
    if (selectedCountry) dispatch(getDropdownStates(selectedCountry));
  }, [dispatch, selectedCountry]);
  useEffect(() => {
    if (selectedState) dispatch(getDropdownCities(selectedState));
  }, [dispatch, selectedState]);
  const { masterMakerOrgType } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerOrgType?.masterObject;
  const transactionTypeId = fetchTransactionType(transactionTypeData, orgType.toUpperCase());
  const typeData = masterMakerOrgType?.masterObject.filter((x) => x.name === orgType.toUpperCase());
  useEffect(() => {
    if (transactionTypeId) dispatch(getDropdownOrganization(transactionTypeId));
  }, [dispatch, transactionTypeId]);

  const { countriesDropdown } = useCountries();
  const { statesDropdown } = useStates();
  const { citiesDropdown } = useCities();
  const { organizationsDropdown } = useOrganizations();
  const organizationData = organizationsDropdown?.organizationDropdownObject || [];

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (view || update) {
      setSelectedCountry(data.cities.state.country.id);
      setSelectedState(data.cities.state.id);
      setValue('countryId', data.cities.state.country.id);
      setValue('stateId', data.cities.state.id);
      handleSetValues(data);
    }
  }, [data, update, view, setValue]);
  useEffect(() => {
    setValue('organizationTypeId', typeData[0]?.id); // Set the default value for the "type" field
  }, [typeData, setValue]);

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/organization-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/organization-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Organization updated successfully!' : 'Organization added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      dispatch(getOrganizationsLocation({ transactionTypeId }));
      onClick();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const countryData = countriesDropdown?.countriesDropdownObject;
  const stateData = statesDropdown?.statesDropdownObject;
  const cityData = citiesDropdown?.citiesDropdownObject;

  const handleCountryId = (e) => {
    setSelectedState('');
    setSelectedCountry(e?.target?.value);
  };

  const handleStateId = (e) => {
    setSelectedState(e?.target?.value);
  };

  const selectBox = (name, label, menus, disable, onChange, req) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        disable={disable}
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Add ' + title}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('organizationTypeId', 'Type', typeData, true, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('parentId', orgType, concateNameAndCode(organizationData), undefined, undefined, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
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
              {txtBox('gstNumber', 'GSTIN', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('address', 'Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('countryId', 'Country', countryData, undefined, handleCountryId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('stateId', 'State', stateData, undefined, handleStateId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('cityId', 'City', cityData, undefined, () => {}, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('pinCode', 'Pincode', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
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

CreateNewOrganiationLocation.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func,
  orgType: PropTypes.string,
  title: PropTypes.string
};

export default CreateNewOrganiationLocation;
