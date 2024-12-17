import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// material-ui
import { Button, Grid, Typography, styled } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import { useProjects } from '../project/useProjects';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import {
  getDropdownOrganization,
  getDropdownOrganizationLocation,
  getDropdownProjects,
  getLovsForMasterName,
  getLovsForMasterNameSecond,
  getOrganizationStores
} from '../../../store/actions';
import { useOrganizations } from '../organization/useOrganizations';
import request from 'utils/request';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import { concateNameAndCode } from 'utils';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import { transformDataWithFilePaths } from 'utils';
import CircularLoader from 'components/CircularLoader';

const SectionContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(6),
  alignItems: 'end'
}));

const ItemContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '20px',
  position: 'absolute'
});

const ActionsContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '20px'
});

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

const CreateNewOrganizationStoreLocation = (props) => {
  const { onClick: goBack, data, view, update, refreshPagination, organizationTypeId } = props;

  const { orgType } = useParams();
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [org, setOrg] = useState(null);

  const [pending, setPending] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.orgName,
        code: Validations.code,
        organizationType: Validations.organizationType,
        organizationStoreId: Validations.organizationStoreId,
        projectId: Validations.project,
        isRestricted: Validations.other,
        ...(!update &&
          fileFields.find((item) => item.name === 'attachments')?.required && {
            attachments: Validations.requiredWithLabel('Attachments')
          }),
        ...(!update &&
          fileFields.find((item) => item.name === 'storePhoto')?.required && { storePhoto: Validations.requiredWithLabel('Store Photo') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const { projectsDropdown } = useProjects();
  const { organizationStores } = useOrganizationStore();
  const { masterMakerOrgType, masterMakerOrgTypeSecond } = useMasterMakerLov();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const organizationTypeData = masterMakerOrgType.masterObject;
  const organizationStoresData = organizationStores?.organizationStoreObject.rows;

  const locationTypeData = masterMakerOrgTypeSecond.masterObject;
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
    if (organizationTypeId) {
      dispatch(getDropdownOrganization(organizationTypeId));
      dispatch(getDropdownOrganizationLocation(organizationTypeId));
    }
  }, [dispatch, organizationTypeId]);

  useEffect(() => {
    if (orgData && orgLocationData) setOrganizationData([...orgData, ...orgLocationData]);
  }, [orgData, orgLocationData]);

  useEffect(() => {
    organizationTypeId && setValue('organizationType', organizationTypeId);
  }, [organizationTypeId, setValue]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
    dispatch(getLovsForMasterNameSecond('STORE LOCATION'));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
  }, [dispatch, organizationTypeId]);

  useEffect(() => {
    setValue('isRestricted', false);
    setValue('isFaulty', false);
    setValue('isScrap', false);
    setValue('isInstalled', false);
    setValue('forInstaller', false);
    setValue('isOld', false);
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName === 'projectId') setValue('projectId', value);
        if (fieldName === 'organization_store') {
          setValue('organizationId', value.organization.id);
          setOrg(value.organization.id);
        } else setValue(fieldName, value);
      });
    };

    if (view || update) {
      handleSetValues(transformDataWithFilePaths(data, fileFields));
    }
  }, [data, update, view, setValue]);

  const showNamesOnly = (arr) => {
    let newArr = [];
    arr &&
      arr.length &&
      arr.map((val) => {
        newArr.push({
          id: val.name,
          name: val.name,
          code: val.code
        });
      });
    return newArr;
  };

  const onFormSubmit = async (values) => {
    setPending(true);
    let response;
    const payload = preparePayloadForFileUpload(values, tasks);

    if (update) {
      response = await request('/organization-store-location-update', {
        method: 'PUT',
        timeoutOverride,
        body: payload,
        params: data.id
      });
    } else {
      response = await request('/organization-store-location-create', { method: 'POST', timeoutOverride, body: payload });
    }

    if (response.success) {
      const successMessage = update ? 'Store location updated successfully!' : 'Store location created successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      goBack();
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };

  const onNameSelected = (e) => {
    if (e?.target && e?.target?.row) setValue('code', e?.target?.row?.code);
  };

  const label1 = [
    {
      value: true,
      name: 'Yes'
    },
    {
      value: false,
      name: 'No'
    }
  ];

  const radioBox = (name, labels, title, disable = false) => {
    return <RHFRadio name={name} labels={labels} title={title} disabled={view || disable} defaultValue={false} required />;
  };

  const onOrgSelected = (e) => {
    if (e?.target?.value) setOrg(e?.target?.value);
  };

  return (
    <>
      {pending && <CircularLoader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={`${view ? `View` : update ? 'Update' : 'Add'} ${orgType} Store Location`}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                disable
                name="organizationType"
                label="Organization Type"
                menus={organizationTypeData || []}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                disable={view}
                name="projectId"
                label="Project"
                menus={projectData || []}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                disable={view}
                name="organizationId"
                label="Organization"
                menus={concateNameAndCode(structuredClone(organizationData))}
                onChange={onOrgSelected}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                disable={view}
                name="organizationStoreId"
                label="Organization Store"
                menus={organizationStoresData?.filter((vl) => vl.organizationId === org)}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                disable={view}
                name="name"
                label="Name"
                menus={showNamesOnly(locationTypeData || [])}
                onChange={onNameSelected}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                disable={view}
                name="code"
                label="Code"
                type="text"
                disabled={true}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField InputLabelProps={{ shrink: true }} disable={view} name="integrationId" label="Integration ID" type="text" />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField InputLabelProps={{ shrink: true }} disable={view} name="remarks" label="Remarks" type="text" />
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('isRestricted', label1, 'Restricted')}
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('isFaulty', label1, 'Faulty', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('isScrap', label1, 'Scrap', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('isInstalled', label1, 'Installed', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('forInstaller', label1, 'Installer', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {radioBox('isOld', label1, 'Old', true)}
            </Grid>
            <Grid item xs={12} mt={-2} mb={-2}>
              {
                <Typography sx={{ fontSize: 12, color: 'red' }}>
                  {`Note: If you select "Restricted = Yes", Total Stock will not be included for this location in "Approver Dashboard".`}
                </Typography>
              }
            </Grid>
          </Grid>
          <SectionContainer container mt={2} spacing={2}>
            <ItemContainer item xs={6}>
              <FileSections
                fileFields={fileFields}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
            </ItemContainer>
            <ActionsContainer item xs={12}>
              <Button onClick={goBack} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && (
                <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </ActionsContainer>
          </SectionContainer>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewOrganizationStoreLocation.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func,
  organizationTypeId: PropTypes.string
};

export default CreateNewOrganizationStoreLocation;
