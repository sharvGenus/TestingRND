import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import {
  getDropdownProjects,
  getMasterMakerLov,
  getMaterial,
  getOrganizationStores,
  getCompanyStoreLocations,
  getDropdownOrganization,
  getDropdownOrganizationLocation,
  getFirmStoreLocations,
  getLovsForMasterNameSecond
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode } from 'utils';

const CreateNewRequestLTL = ({ disableAll, saveData, onSelectedStoreLocation, setLocations }) => {
  const [address, setAddress] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [orgBranchData, setOrgBranchData] = useState([]);
  const [projectSiteStoreId, setProjectSiteStoreId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [storeLocationData, setStoreLocationData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        orgTypeId: Validations.organizationType,
        organization: Validations.organizationId,
        projectSiteStoreId: Validations.organizationStoreId,
        toOrganizationStoreLocationId: Validations.requiredWithLabel('Location of transfer')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getLovsForMasterNameSecond('ORGANIZATION TYPE'));
    dispatch(getDropdownProjects());
    dispatch(getMaterial());
  }, [dispatch]);
  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };
  const {
    masterMakerLovs: {
      masterMakerLovsObject: { rows: transactionTypeData }
    },
    masterMakerOrgTypeSecond: { masterObject: orgTypeData }
  } = useMasterMakerLov();
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'LTL');

  const {
    projectsDropdown: { projectsDropdownObject: projectData }
  } = useProjects();
  const {
    organizationStores: {
      organizationStoreObject: { rows: orgStoreData }
    }
  } = useOrganizationStore();
  const {
    companyStoreLocations: {
      companyStoreLocationsObject: { rows: companyStoreLocationData }
    },
    firmStoreLocations: {
      firmStoreLocationsObject: { rows: firmStoreLocationData }
    }
  } = useOrganizationStoreLocation();

  useEffect(() => {
    setStoreLocationData(companyStoreLocationData);
  }, [companyStoreLocationData]);

  useEffect(() => {
    setStoreLocationData(firmStoreLocationData);
  }, [firmStoreLocationData]);

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const { organizationsDropdown, organizationsLocationDropdown } = useOrganizations();
  const orgData = organizationsDropdown?.organizationDropdownObject || [];
  const orgLoc = organizationsLocationDropdown?.organizationLocationDropdownObject || [];

  const onSelectedStore = (e) => {
    if (e.target.value) {
      setProjectSiteStoreId(e?.target?.value);
      const locationsData = storeLocationData && storeLocationData.filter((item) => item.organizationStoreId === e.target.value);
      setFilteredLocations(locationsData);
      setLocations(locationsData);
      const respData = fetchData(orgStoreData, e.target.value);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setValue('toOrganizationStoreLocationId', null);
    }
  };

  const onSelectedOrg = (e) => {
    if (e?.target?.value) {
      let contData = orgLoc.filter((val) => val.parent && val.parent !== null && val.parent.id === e.target.value);
      setOrgBranchData(contData);
      setSelectedOrg(e?.target?.value);
      setValue('contractorBranch', null);
      setValue('projectSiteStoreId', null);
      setAddress('');
      setValue('toOrganizationStoreLocationId', null);
    }
  };

  const onSelectedOrgBranch = (e) => {
    if (e?.target?.value) {
      setSelectedOrg(e?.target?.value);
      setValue('projectSiteStoreId', null);
      setAddress('');
      setValue('toOrganizationStoreLocationId', null);
    }
  };

  useEffect(() => {
    if (projectSiteStoreId) {
      const organization = orgStoreData?.find((x) => x?.id === projectSiteStoreId)?.organization;
      setOrganizationId(organization?.parentId !== null ? organization?.parentId : organization?.id);
    }
  }, [orgStoreData, projectSiteStoreId]);

  const onInitialSubmit = (values) => {
    values['transactionTypeId'] = transactionTypeId;
    values['organizationId'] = organizationId;
    saveData(values);
  };

  const onSelectedOrgType = (e) => {
    if (e?.target?.value) {
      dispatch(getDropdownOrganization(e?.target?.value));
      dispatch(getDropdownOrganizationLocation(e?.target?.value));
      dispatch(getOrganizationStores({ organizationType: e?.target?.value }));
      if (e?.target?.value === '420e7b13-25fd-4d23-9959-af1c07c7e94b')
        dispatch(getCompanyStoreLocations({ organizationType: e?.target?.value }));
      if (e?.target?.value === 'decb6c57-6d85-4f83-9cc2-50e0630003df')
        dispatch(getFirmStoreLocations({ organizationType: e?.target?.value }));

      setValue('organization', null);
      setValue('contractorBranch', null);
      setValue('projectSiteStoreId', null);
      setAddress('');
      setValue('toOrganizationStoreLocationId', null);
    }
  };

  const keywordsToExclude = ['consumed', 'billing', 'installed', 'old', 'installer', 'service-center', 'service center'];

  return (
    <>
      <MainCard title={'Material Transfer Location To Location'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectId"
                label="Project"
                menus={projectData || []}
                disable={disableAll}
                required
                onChange={() => {
                  setValue('orgTypeId', null);
                  setValue('organization', null);
                  setValue('contractorBranch', null);
                  setValue('projectSiteStoreId', null);
                  setAddress('');
                  setValue('toOrganizationStoreLocationId', null);
                }}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="orgTypeId"
                label="Organization Type"
                menus={orgTypeData.filter(
                  (val) => val.id === '420e7b13-25fd-4d23-9959-af1c07c7e94b' || val.id === 'decb6c57-6d85-4f83-9cc2-50e0630003df'
                )}
                onChange={onSelectedOrgType}
                disable={disableAll}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="organization"
                label="Organization"
                menus={concateNameAndCode(orgData)}
                onChange={onSelectedOrg}
                disable={disableAll}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="contractorBranch"
                label="Organization Branch"
                menus={concateNameAndCode(orgBranchData)}
                onChange={onSelectedOrgBranch}
                disable={disableAll}
                allowClear
              />
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectSiteStoreId"
                label="Organization Store"
                menus={orgStoreData?.filter((vl) => vl.organizationId === selectedOrg)}
                onChange={onSelectedStore}
                disable={disableAll}
                required
              />
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{address}</Typography>
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toOrganizationStoreLocationId"
                label="Location Of Transfer"
                menus={
                  (filteredLocations &&
                    filteredLocations.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword)))) ||
                  []
                }
                onChange={onSelectedStoreLocation}
                disable={disableAll}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField InputLabelProps={{ shrink: true }} name="remarks" label="Remarks" type="text" disabled={disableAll} />
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: 2 }}>
                <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                  Next
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewRequestLTL.propTypes = {
  disableAll: PropTypes.bool,
  saveData: PropTypes.func,
  onSelectedStoreLocation: PropTypes.func,
  setLocations: PropTypes.func
};

export default CreateNewRequestLTL;
