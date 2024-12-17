import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCountries } from '../country/useCountries';
import { useStates } from '../state/useStates';
import { useCities } from '../city/useCities';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { ChangePassword } from './change-password';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getLovsForMasterName,
  getDropdownCities,
  getDropdownCountries,
  getDropdownStates,
  getDropdownOrganization,
  getOrganizationsLocationByParent
} from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { concateNameAndCode, transformDataWithFilePaths } from 'utils';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import CircularLoader from 'components/CircularLoader';
import useAuth from 'hooks/useAuth';

const isAuthorizedOptions = [
  {
    value: true,
    name: 'Yes'
  },
  {
    value: false,
    name: 'No'
  }
];

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const attachmentsAreRequired = fileFields.some((item) => item.name === 'attachments' && item.required === true);
const timeoutOverride = 10 * 60000;

const CreateNewUser = (props) => {
  const dispatch = useDispatch();
  const [organizationTypeId, setOrganizationTypeId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [pending, setPending] = useState(false);
  const { onClick, data, view, update, refreshPagination } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        code: Validations.code,
        mobileNumber: Validations.mobileNumber,
        address: Validations.other,
        pinCode: Validations.pincode,
        countryId: Validations.other,
        stateId: Validations.other,
        cityId: Validations.other,
        oraganizationType: Validations.other,
        oraganizationId: Validations.other,
        authorizedUser: Validations.requiredWithLabel('Is Authorized'),
        ...(!update &&
          attachmentsAreRequired && {
            attachments: Validations.attachmentsWhenIsAuthorized
          })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const [deviceIdAccess, setDeviceIdAccess] = useState(false);

  useEffect(() => {
    (async () => {
      const userDetails = await request('/get-user-details');
      if (userDetails?.success) {
        if (userDetails?.data?.data?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c') {
          setDeviceIdAccess(true);
        }
      }
    })();
  }, [setDeviceIdAccess]);

  const { handleSubmit, setValue, watch } = methods;
  const { user } = useAuth();
  const isSuperUser = user?.role?.name === 'SuperUser' ? true : false;
  const isCompanyUser = user?.oraganizationType === '420e7b13-25fd-4d23-9959-af1c07c7e94b' ? true : false;

  const authorizedUser = watch('authorizedUser');

  useEffect(() => {
    setValue('authorizedUser', false);
    dispatch(getDropdownCountries());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch, setValue]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType?.masterObject;

  useEffect(() => {
    if (organizationTypeId) {
      dispatch(getDropdownOrganization(`${organizationTypeId}?hasAccess=${isCompanyUser}`));
    }
  }, [dispatch, organizationTypeId, isCompanyUser]);

  const { organizationsDropdown, organizationsLocByParent } = useOrganizations();
  const organizationNameData = organizationsDropdown?.organizationDropdownObject;

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
      dispatch(getOrganizationsLocationByParent({ params: data.oraganizationType + '/' + data.oraganizationId, hasAccess: isCompanyUser }));
      dispatch(getDropdownStates(data.city.state.country.id));
      dispatch(getDropdownCities(data.city.state.id));
      setValue('countryId', data.city.state.country.id);
      setValue('stateId', data.city.state.id);
      setValue('oraganizationId', data.master_maker_lov.id);
      setOrganizationTypeId(data.master_maker_lov.id);
      handleSetValues(transformDataWithFilePaths(data, fileFields));
      setValue('oraganizationTypeValue', data.master_maker_lov?.name);
      setValue('oraganizationIdValue', data.organization?.name);
      setValue('organisationBranchValue', data.organisationBranch?.name);
    }
  }, [data, update, view, setValue, dispatch, isCompanyUser]);

  useEffect(() => {
    if (countryId) {
      setValue('stateId', '');
      setValue('cityId', '');
    }
  }, [countryId, setValue]);

  useEffect(() => {
    if (stateId) {
      setValue('cityId', '');
    }
  }, [stateId, setValue]);

  useEffect(() => {
    setValue('dateOfOnboarding', new Date().toISOString().slice(0, 10));
  }, [setValue]);

  const onFormSubmit = async (values) => {
    setPending(true);
    // need to delete once dropdowns api avaialble
    if (values?.organisationBranchId === '') {
      values.organisationBranchId = null;
    }
    const payload = preparePayloadForFileUpload(values, tasks);
    payload.authorizedUser = payload.authorizedUser === 'true' ? true : false;

    if (
      update &&
      payload.authorizedUser &&
      attachmentsAreRequired &&
      (!payload.attachments || (Array.isArray(payload.attachments) && payload.attachments.length === 0))
    ) {
      toast('Please select attachments for an authorized user', { variant: 'error' });
      setPending(false);
      return;
    } else {
      if (!payload.authorizedUser) {
        const currentFilePaths = (payload.attachments || []).filter((item) => typeof item === 'string');
        payload.attachments = currentFilePaths.map((filePath) => ({
          action: 'delete',
          filePath
        }));
      }
    }
    payload.status = update ? '5ba80e90-6e3d-4a22-873f-9a10908d5a06' : 'de6ae8b5-909a-4ea4-a518-bfad9bdbdd3d';

    let response;
    if (update) response = await request('/user-update', { method: 'PUT', timeoutOverride, body: payload, params: data.id });
    else response = await request('/user-form', { method: 'POST', timeoutOverride, body: payload });
    if (response.success) {
      const successMessage = update ? 'User updated successfully!' : 'User added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      onClick();
      refreshPagination();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };
  const countryData = countriesDropdown.countriesDropdownObject;
  const stateData = statesDropdown?.statesDropdownObject;
  const cityData = citiesDropdown?.citiesDropdownObject;

  const handleCountryId = (e) => {
    dispatch(getDropdownStates(e?.target?.value));
    setCountryId(e?.target?.value);
  };

  const handleStateId = (e) => {
    dispatch(getDropdownCities(e?.target?.value));
    setStateId(e?.target?.value);
  };

  const selectBox = (name, label, menus, req, onChange, allowClear = false) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          onChange={onChange}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(allowClear && { allowClear: true })}
          {...(req && { required: true })}
          {...(view ? { disable: true } : update ? { disable: false } : {})}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
          {...(view
            ? { disabled: true }
            : update
            ? { disabled: ['oraganizationTypeValue', 'oraganizationIdValue', 'organisationBranchValue'].includes(name) }
            : {})}
        />
      </Stack>
    );
  };

  const radioBox = (name, labels, title, onChange, req) => {
    return (
      <RHFRadio
        name={name}
        labels={labels}
        title={title}
        mini
        onChange={onChange}
        {...(req && { required: true })}
        {...(view ? { disabled: true } : update ? { disabled: false } : {})}
      />
    );
  };

  // const is2FaEnableData = [
  //   {
  //     name: 'Enable',
  //     value: 1
  //   },
  //   {
  //     name: 'Disable',
  //     value: 0
  //   }
  // ];

  const { organizationBranchData } = useMemo(
    () => ({
      organizationBranchData: organizationsLocByParent?.organizationObject?.rows || [],
      isLoading: organizationsLocByParent.loading || false
    }),
    [organizationsLocByParent]
  );

  const handleOrganizationTypeId = (e) => {
    setOrganizationTypeId(e?.target?.value);
    methods.setValue('oraganizationId', '');
    methods.setValue('organisationBranchId', '');
  };

  const onOrganizationSelected = (e) => {
    if (e?.target?.value) {
      dispatch(getOrganizationsLocationByParent({ params: organizationTypeId + '/' + e?.target?.value, hasAccess: isCompanyUser }));
    }
  };

  return (
    <>
      {pending && <CircularLoader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'User'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'none' : 'block' }}>
              {selectBox(
                'oraganizationType',
                'Organization Type',
                isSuperUser || isCompanyUser ? organizationTypeData : [{ id: user.master_maker_lov.id, name: user.master_maker_lov.name }],
                true,
                handleOrganizationTypeId
              )}
            </Grid>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'none' : 'block' }}>
              {selectBox(
                'oraganizationId',
                'Organization Name',
                isSuperUser || isCompanyUser
                  ? concateNameAndCode(organizationNameData)
                  : [{ id: user.organization.id, name: user.organization.name + ' - ' + user.organization.code }],
                true,
                onOrganizationSelected
              )}
            </Grid>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'none' : 'block' }}>
              {selectBox(
                'organisationBranchId',
                'Organization Branch',
                isSuperUser || isCompanyUser
                  ? concateNameAndCode(organizationBranchData)
                  : user.organisationBranch
                  ? [{ id: user.organisationBranch?.id, name: user.organisationBranch?.name + ' - ' + user.organisationBranch?.code }]
                  : [],
                false,
                undefined,
                true
              )}
            </Grid>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'block' : 'none' }}>
              {txtBox('oraganizationTypeValue', 'Organization Type', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'block' : 'none' }}>
              {txtBox('oraganizationIdValue', 'Organization Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2} sx={{ display: (view || update) && !isSuperUser ? 'block' : 'none' }}>
              {txtBox('organisationBranchValue', 'Organization Branch', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              <Stack spacing={1}>
                <RHFTextField allSmall name={'email'} label={'Email'} disabled={!!view} />
              </Stack>
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('mobileNumber', 'Mobile Number', 'number', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('aadharNo', 'Aadhar Number', 'number', false)}
            </Grid>
            {deviceIdAccess && update && (
              <Grid item md={3} xl={2}>
                {txtBox('deviceId', 'Device-Id', 'text', true)}
              </Grid>
            )}
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
              {txtBox('pinCode', 'Pincode', 'number', true)}
            </Grid>
            {/* <Grid item md={3} xl={2}>
              {txtBox('panNumber', 'PAN Number', 'text', false)}
            </Grid> */}
            <Grid item md={3} xl={2}>
              {txtBox('dateOfOnboarding', 'Date of Onboarding', 'date', false, true)}
            </Grid>
            <Grid item md={3} xl={3}>
              {radioBox('authorizedUser', isAuthorizedOptions, 'Is Authorized', () => {}, true)}
            </Grid>
            {/* <Grid item md={3} xl={2}>
              {selectBox('is2FaEnable', 'Is 2FA Enabled', is2FaEnableData, false, undefined)}
            </Grid> */}
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              {(authorizedUser === 'true' || authorizedUser === true) && (
                <FileSections
                  fileFields={fileFields}
                  data={data}
                  view={view}
                  update={update}
                  tasks={tasks}
                  setTasks={setTasks}
                  setValue={setValue}
                />
              )}
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {update && user?.roleId === 'a89c1591-ed87-40e5-b89b-e409d647e3e5' && (
                <Button
                  size="small"
                  onClick={() => {
                    setOpenChangePasswordDialog(true);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Change Password
                </Button>
              )}
              {!view && (
                <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Dialog
        open={openChangePasswordDialog}
        onClose={() => {
          setOpenChangePasswordDialog(false);
        }}
        PaperProps={{ sx: { width: '25rem' } }}
        maxWidth="xl"
        scroll="body"
      >
        <ChangePassword
          userId={data?.id}
          onClose={() => {
            setOpenChangePasswordDialog(false);
          }}
        />
      </Dialog>
    </>
  );
};

CreateNewUser.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewUser;
