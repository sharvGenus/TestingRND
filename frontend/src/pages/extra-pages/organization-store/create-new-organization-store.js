import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// material-ui
import { Button, Grid } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import { useCities } from '../city/useCities';
import request from '../../../utils/request';
import {
  getDropdownCities,
  getDropdownCountries,
  getDropdownOrganization,
  getDropdownOrganizationLocation,
  getDropdownStates,
  getLovsForMasterName,
  getOrganizationStores
} from '../../../store/actions';
import { useCountries } from '../country/useCountries';
import { useStates } from '../state/useStates';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import { concateNameAndCode, transformDataWithFilePaths } from 'utils';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import CircularLoader from 'components/CircularLoader';

const fileFields = [
  {
    name: 'storePhoto',
    label: 'Store Photo',
    accept: 'image/png, image/gif, image/jpeg',
    required: false,
    multiple: false
  },
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const timeoutOverride = 10 * 60000;

const CreateNewOrganizationStore = (props) => {
  const { onClick, view, data, update, refreshPagination, organizationTypeId } = props;

  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState(false);

  const officeData = [
    {
      id: 'Principal Office',
      name: 'Principal Office'
    },
    {
      id: 'Branch Office',
      name: 'Branch Office'
    }
  ];

  const selectBox = (name, label, menus, req, onChange, disable) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(typeof onChange === 'function' && { onChange: onChange })}
        {...(req && { required: true })}
        {...(view ? { disable: true } : update ? { disable: false } : {})}
        {...(disable ? { disable: true } : {})}
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

  const { orgType } = useParams();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        organizationId: Validations.organizationId,
        name: Validations.orgName,
        code: Validations.code,
        countryId: Validations.country,
        stateId: Validations.state,
        cityId: Validations.city,
        organizationType: Validations.organizationType,
        gstNumber: Validations.gstNumber,
        mobileNumber: Validations.mobileNumber,
        address: Validations.address,
        pincode: Validations.pincode,
        ...(['Company', 'CONTRACTOR'].includes(orgType) && { office: Validations.requiredWithLabel('Office') }),
        ...(!['Customer'].includes(orgType) && {
          ...(!update &&
            fileFields.find((item) => item.name === 'attachments')?.required && {
              attachments: Validations.requiredWithLabel('Attachments')
            })
        })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const handleCountryId = (e) => {
    dispatch(getDropdownStates(e?.target?.value));
  };

  const handleStateId = (e) => {
    dispatch(getDropdownCities(e?.target?.value));
  };

  useEffect(() => {
    dispatch(getDropdownCountries());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    if (orgType !== 'Company' && orgType !== 'CONTRACTOR') dispatch(getDropdownOrganization(organizationTypeId));
  }, [dispatch, orgType, organizationTypeId]);

  const { countriesDropdown } = useCountries();
  const { statesDropdown } = useStates();
  const { citiesDropdown } = useCities();
  const { masterMakerOrgType } = useMasterMakerLov();
  const { organizationsDropdown, organizationsLocationDropdown } = useOrganizations();
  const [organizationData, setOrganizationData] = useState();

  const { orgData } = useMemo(
    () => ({
      orgData: organizationsDropdown?.organizationDropdownObject || [],
      count: organizationsDropdown?.organizationDropdownObject?.count || 0,
      isLoading: organizationsDropdown.loading || false
    }),
    [organizationsDropdown]
  );

  const { orgLocationData } = useMemo(
    () => ({
      orgLocationData: organizationsLocationDropdown?.organizationLocationDropdownObject || [],
      count: organizationsLocationDropdown?.organizationLocationDropdownObject?.count || 0,
      isLoading: organizationsLocationDropdown.loading || false
    }),
    [organizationsLocationDropdown]
  );

  useEffect(() => {
    setOrganizationData(orgData);
  }, [orgData]);

  useEffect(() => {
    setOrganizationData(orgLocationData);
  }, [orgLocationData]);

  const organizationTypeData = masterMakerOrgType.masterObject;
  const countryData = [...(data?.city ? [data.city.state.country] : []), ...countriesDropdown.countriesDropdownObject];
  const stateData = [...(data?.city ? [data.city.state] : []), ...statesDropdown.statesDropdownObject];
  const cityData = [...(data?.city ? [data.city] : []), ...citiesDropdown.citiesDropdownObject];

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    organizationTypeId && setValue('organizationType', organizationTypeId);
  }, [setValue, organizationTypeId]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      setValue('countryId', data?.city?.state?.country?.id);
      setValue('stateId', data?.city?.state?.id);
      setValue('cityId', data?.city?.id);
      handleSetValues(transformDataWithFilePaths(data, fileFields));
      if (data && data.organization && data.organization.parentId && data.organization.parentId !== null) {
        dispatch(getDropdownOrganizationLocation(organizationTypeId));
        setValue('office', 'Branch Office');
        setValue('organizationId', data.organizationId);
      } else {
        dispatch(getDropdownOrganization(organizationTypeId));
        setValue('office', 'Principal Office');
        setValue('organizationId', data.organizationId);
      }
    }
  }, [data, update, view, setValue, organizationTypeId, dispatch]);

  const onFormSubmit = async (values) => {
    setPending(true);
    let response;
    values = preparePayloadForFileUpload(values, tasks);

    if (update) {
      response = await request('/organization-store-update', { method: 'PUT', timeoutOverride, body: values, params: data.id });
    } else {
      response = await request('/organization-store-create', { method: 'POST', timeoutOverride, body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Store updated successfully!' : 'Store created successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
      onClick();
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };

  const onOfficeSelected = (e) => {
    if (e?.target?.value) {
      let val = e?.target?.value;
      if (val === 'Branch Office') dispatch(getDropdownOrganizationLocation(organizationTypeId));
      else if (val === 'Principal Office') dispatch(getDropdownOrganization(organizationTypeId));
    }
  };

  return (
    <>
      {pending && <CircularLoader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + orgType + ' Store'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('organizationType', 'Organization Type', organizationTypeData, false, undefined, true)}
            </Grid>
            {(orgType === 'Company' || orgType === 'CONTRACTOR') && (
              <Grid item md={3} xl={2}>
                {selectBox('office', 'Office', officeData, true, onOfficeSelected)}
              </Grid>
            )}
            <Grid item md={3} xl={2}>
              {selectBox('organizationId', 'Organization', concateNameAndCode(structuredClone(organizationData)), true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('integrationId', 'Integration ID', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('gstNumber', 'GSTIN', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('email', 'Email', 'email')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('telephone', 'Telephone', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('address', 'Address', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('countryId', 'Country', countryData, true, handleCountryId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('stateId', 'State', stateData, true, handleStateId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('cityId', 'City', cityData, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('pincode', 'Pincode', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              <FileSections
                fileFields={fileFields}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && (
                <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
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

CreateNewOrganizationStore.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func,
  organizationTypeId: PropTypes.string
};

export default CreateNewOrganizationStore;
