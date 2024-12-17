import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import {
  getDropdownAllProjects,
  getDropdownOrganization,
  getDropdownOrganizationLocation,
  getDropdownProjects,
  getOrganizationListData,
  getOrganizationListDataSecond,
  getOrganizationStores,
  getOrganizationStoresAllAccess
} from '../../../store/actions';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode, valueIsMissingOrNA } from 'utils';

const CreateNewTransfer = ({ saveData }) => {
  const [addressData, setAddressData] = useState('');
  const [toAddressData, setToAddressData] = useState('');
  const [filterProjectData, setfilterProjectData] = useState([]);
  const [storeDetails, setStoreDetails] = useState(null);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [orgData, setOrgData] = useState(null);
  const [storeOrgData, setStoreOrgData] = useState(null);
  const [toOrgData, setToOrgData] = useState(null);
  const [eWayBillNumber, setEwayBillNumber] = useState();
  const [disableAll, setDisableAll] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        fromOrganizationId: Validations.organizationId,
        projectSiteStoreId: Validations.projectSiteStore,
        toProjectId: Validations.project,
        toOrganizationId: Validations.organizationId,
        toProjectSiteStoreId: Validations.projectSiteStore,
        vehicleNumber: Validations.vehicleNumberOptional,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch, clearErrors } = methods;

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  useEffect(() => {
    if (valueIsMissingOrNA(eWayBillNumber)) {
      clearErrors('eWayBillDate');
      setValue('eWayBillDate', '');
    }
  }, [clearErrors, eWayBillNumber, setValue]);

  const dispatch = useDispatch();
  useEffect(() => {
    setDisableAll(false);
    dispatch(getDropdownAllProjects());
    dispatch(getDropdownProjects());
  }, [dispatch]);
  const {
    projectsDropdown: { projectsDropdownObject: projectData },
    allProjectsDropdown: { projectsDropdownObject: allProjectData }
  } = useProjects();

  const transactionTypeId = '22ce5829-2a1e-407c-88f6-5ebc38455519'; //PTP
  const organizationTypeId = '420e7b13-25fd-4d23-9959-af1c07c7e94b';

  useEffect(() => {
    if (organizationTypeId) {
      dispatch(getDropdownOrganization(organizationTypeId));
      dispatch(getDropdownOrganizationLocation(organizationTypeId));
      dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
      dispatch(getOrganizationListData({ organizationTypeId: organizationTypeId }));
    }
  }, [dispatch, organizationTypeId]);

  const {
    organizationsDropdown: { organizationDropdownObject: organizationData },
    organizationsLocationDropdown: { organizationLocationDropdownObject: organizationBranchData },
    organizationsAllData: {
      organizationObject: { rows: toOrganizationData }
    },
    organizationsAllDataSecond: {
      organizationObject: { rows: toOrganizationBranchData }
    }
  } = useOrganizations();

  const {
    organizationStores: {
      organizationStoreObject: { rows: companyStoreData }
    },
    organizationStoresAllAccess: {
      organizationStoreObject: { rows: toCompanyStoreData }
    }
  } = useOrganizationStore();

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onSelectedProject = (e) => {
    if (e?.target?.value) {
      setfilterProjectData(allProjectData.filter((x) => x.id !== e.target.value));
      setValue('fromOrganizationId', '');
      setValue('fromOrganizationBranchId', '');
      setValue('projectSiteStoreId', '');
      setValue('toProjectId', '');
      setValue('toOrganizationId', '');
      setValue('toOrganizationBranchId', '');
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
      setAddressData('');
      setToAddressData('');
    }
  };

  const onSelectedStore = (e) => {
    if (e?.target?.value) {
      const respData = fetchData(companyStoreData, e.target.value);
      setStoreDetails(respData);
      const { pincode, address, city } = respData;
      setAddressData(`${address}, ${city.name},${city.state.name}, ${city.state.country.name}, ${pincode}`);
      setRequestOrganizationId(respData?.organization?.parentId ? respData?.organization?.parentId : respData?.organization?.id);
      setValue('toProjectId', '');
      setValue('toOrganizationId', '');
      setValue('toOrganizationBranchId', '');
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
      setToAddressData('');
    }
  };

  const onSelectedToStore = (e) => {
    if (e?.target?.value) {
      const respData = fetchData(toCompanyStoreData, e.target.value);
      const { pincode, address, city } = respData;
      setToAddressData(`${address}, ${city?.name},${city?.state?.name}, ${city?.state?.country?.name}, ${pincode}`);
      setValue('remarks', '');
    }
  };

  const onInitialSubmit = (values) => {
    values['transactionTypeId'] = transactionTypeId;
    values['storeDetails'] = storeDetails;
    values['requestOrganizationId'] = requestOrganizationId;
    setDisableAll(true);
    saveData(values);
  };

  const onSelectedOrganization = (e) => {
    if (e?.target?.value) {
      setOrgData(e?.target?.value);
      setStoreOrgData(e?.target?.value);
      setValue('fromOrganizationBranchId', '');
      setValue('projectSiteStoreId', '');
      setValue('toProjectId', '');
      setValue('toOrganizationId', '');
      setValue('toOrganizationBranchId', '');
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
      setToAddressData('');
    }
  };

  const onSelectedToOrganization = (e) => {
    if (e?.target?.value) {
      setToOrgData(e?.target?.value);
      dispatch(getOrganizationListDataSecond({ organizationTypeId: organizationTypeId, parentId: e?.target?.value }));
      dispatch(getOrganizationStoresAllAccess({ organizationType: organizationTypeId, organizationId: e?.target?.value }));
      setValue('toOrganizationBranchId', '');
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
    }
  };

  const onSelectedOrganizationBranch = (e) => {
    if (e?.target?.value) {
      setStoreOrgData(e?.target?.value);
      setValue('projectSiteStoreId', '');
      setValue('toProjectId', '');
      setValue('toOrganizationId', '');
      setValue('toOrganizationBranchId', '');
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
    }
  };

  const onSelectedToOrganizationBranch = (e) => {
    if (e?.target?.value) {
      dispatch(getOrganizationStoresAllAccess({ organizationType: organizationTypeId, organizationId: e?.target?.value }));
      setValue('toProjectSiteStoreId', '');
      setValue('remarks', '');
    }
  };

  return (
    <>
      <MainCard title={'Material Transfer Project To Project'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectId"
                label="From Project"
                menus={projectData || []}
                onChange={onSelectedProject}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="fromOrganizationId"
                label="From Organization"
                menus={concateNameAndCode(organizationData) || []}
                onChange={onSelectedOrganization}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="fromOrganizationBranchId"
                label="From Organization Branch"
                menus={concateNameAndCode(organizationBranchData)?.filter((val) => val?.parent?.id === orgData) || []}
                onChange={onSelectedOrganizationBranch}
                disable={disableAll}
              />
            </Grid>
            <Grid item md={12} xl={12} mt={-5}></Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectSiteStoreId"
                label="From Organization Store"
                menus={concateNameAndCode(companyStoreData)?.filter((val) => val?.organizationId === storeOrgData) || []}
                onChange={onSelectedStore}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>From Address: </Typography>
              <Typography mt={2}>{addressData}</Typography>
            </Grid>
            <Grid item md={12} xl={12} mt={-5}></Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toProjectId"
                label="To Project"
                menus={filterProjectData}
                onChange={() => {
                  setValue('toOrganizationId', '');
                  setValue('toProjectSiteStoreId', '');
                  setValue('remarks', '');
                }}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toOrganizationId"
                label="To Organization"
                menus={concateNameAndCode(toOrganizationData) || []}
                onChange={onSelectedToOrganization}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toOrganizationBranchId"
                label="To Organization Branch"
                menus={concateNameAndCode(toOrganizationBranchData)?.filter((val) => val?.parent?.id === toOrgData) || []}
                onChange={onSelectedToOrganizationBranch}
                disable={disableAll}
              />
            </Grid>
            <Grid item md={12} xl={12} mt={-5}></Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toProjectSiteStoreId"
                label="To Organization Store"
                menus={concateNameAndCode(toCompanyStoreData) || []}
                onChange={onSelectedToStore}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>To Address: </Typography>
              <Typography mt={2}>{toAddressData}</Typography>
            </Grid>
            <Grid item md={12} xl={12} mt={-5}></Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="placeOfSupply"
                label="Place of Supply"
                type="text"
                disabled={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="vehicleNumber"
                label="Vehicle No. / LR No."
                type="text"
                disabled={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="eWayBillNumber"
                label="E-Way Bill Number"
                type="text"
                disabled={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="eWayBillDate"
                label="E-Way Bill Date"
                type="date"
                handleChange={(e) => {
                  valueIsMissingOrNA(e);
                }}
                disabled={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField InputLabelProps={{ shrink: true }} name="remarks" label="Remarks" type="text" disabled={disableAll} />
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                  Next
                </Button>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 3, mb: 3 }}>
              <Grid item md={12} xl={12}>
                <Divider />
              </Grid>
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewTransfer.propTypes = {
  onClick: PropTypes.func,
  getMaterialList: PropTypes.any,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  saveData: PropTypes.func
};

export default CreateNewTransfer;
