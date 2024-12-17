import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { useProjects } from '../project/useProjects';
import {
  fetchRequestDetails,
  getCompanyStoreLocations,
  getDropdownOrganization,
  getDropdownOrganizationStores,
  getDropdownProjects,
  getFirmStoreLocations,
  getLovsForMasterName,
  getMasterMakerLov,
  getOrganizationsLocationByParent
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode, groupByRequisitionNumberForDropdown } from 'utils';
import { useRequest } from 'pages/receipts/mrf-receipt/useRequest';

const CreateNewConsumption = ({ saveData, disableAll, setDisableAll }) => {
  const [storeType, setStoreType] = useState('');
  const [orgTypeId, setOrgTypeId] = useState(null);
  const [projectStoreData, setProjectStoreData] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [respData, setRespData] = useState([]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationTypeId: Validations.organizationType,
        organizationId: Validations.organizationId,
        fromProjectSiteStoreId: Validations.requiredWithLabel('Store')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);
  const { projectsDropdown } = useProjects();
  const { masterMakerOrgType, masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CONSUMPTION');
  const reqTransactionTypeId = fetchTransactionType(transactionTypeData, 'CONSUMPTIONREQUEST');
  // const installedTransactionTypeId = fetchTransactionType(transactionTypeData, 'INSTALLED');

  const orgType = masterMakerOrgType.masterObject || [];
  const orgTypeData = orgType.filter(
    (val) => val.id === '420e7b13-25fd-4d23-9959-af1c07c7e94b' || val.id === 'decb6c57-6d85-4f83-9cc2-50e0630003df'
  );

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('organizationTypeId', null);
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationTypeId') {
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationId') {
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationbranchId') {
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'fromProjectSiteStoreId') {
      setValue('requisitionNumber', null);
      setValue('fromStoreLocationId', null);
    } else if (stage === 'requisitionNumber') {
      setValue('fromStoreLocationId', null);
    } else if (stage === 'fromStoreLocationId') {
      setValue('challanNumber', null);
      setValue('challanDate', null);
    } else if (stage === 'challanNumber') setValue('challanDate', null);
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          {...(typeof onChange === 'function' && { onChange: onChange })}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(disableAll && { disable: true })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const onOrgTypeSelected = (e) => {
    resetContents('organizationTypeId');
    if (e?.target?.value) {
      setValue('orgnanizationId', null);
      setValue('orgnanizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      dispatch(getDropdownOrganization(e?.target?.value));
      dispatch(getDropdownOrganizationStores(e?.target?.value));
      let row = e?.target?.row;
      setStoreType(row?.name);
      setOrgTypeId(e?.target?.value);
      if (row?.name?.toLowerCase().includes('contractor')) dispatch(getFirmStoreLocations(e?.target?.value));
      else if (row?.name?.toLowerCase().includes('company')) dispatch(getCompanyStoreLocations(e?.target?.value));
    }
  };

  const projectData = projectsDropdown?.projectsDropdownObject;
  const { organizationStoresDropdown } = useOrganizationStore();
  const projectStore = organizationStoresDropdown.organizationStoreDropdownObject?.rows || [];

  const { organizationsDropdown, organizationsLocByParent } = useOrganizations();
  const orgData = organizationsDropdown.organizationDropdownObject || [];
  const { orgBranchData } = useMemo(
    () => ({
      orgBranchData: organizationsLocByParent.organizationObject.rows || []
    }),
    [organizationsLocByParent]
  );

  const onOrgSelected = (e, branch = false) => {
    if (e?.target?.value) {
      if (branch) resetContents('organizationbranchId');
      else resetContents('organizationId');
      !branch && setValue('orgnanizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      !branch && dispatch(getOrganizationsLocationByParent({ params: orgTypeId + '/' + e?.target?.value }));
      let store = projectStore.filter((val) => val.organizationId === e?.target?.value);
      setProjectStoreData(store);
    }
  };

  const { transactionRequest } = useRequest();
  const requestList = transactionRequest?.requestDetails?.rows;

  const onInitialSubmit = (values) => {
    if (respData && respData.length > 0) {
      setValue('fromStoreLocationId', respData?.[0]?.storeLocationId);
    }
    const selectedStore = projectStoreData.filter((val) => val.id === values.fromProjectSiteStoreId);
    setDisableAll(true);
    values['transactionTypeId'] = transactionTypeId;
    values['fromOrganizationId'] = selectedStore[0]?.organization?.parentId
      ? selectedStore[0]?.organization?.parentId
      : selectedStore[0]?.organization?.id;
    values['storeType'] = storeType;
    // values['storeLocationData'] = storeLocationData;
    values['materials'] = respData;
    saveData(values);
  };

  const onSelectedFromStore = (e) => {
    if (e?.target?.value) {
      resetContents('fromProjectSiteStoreId');
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      dispatch(
        fetchRequestDetails({
          projectId,
          fromStoreId: e?.target?.value,
          status: '1',
          isProcessed: '0',
          approvalStatus: '1',
          transactionTypeId: reqTransactionTypeId,
          sortBy: 'updatedAt',
          sortOrder: 'DESC'
        })
      );
    }
  };

  // const createResponse = (row) => {
  //   let arr = row?.data;
  //   let filterObj = {};
  //   if (arr && arr.length > 0) {
  //     let filteredData = arr.filter((vl) => vl.quantity > 0);
  //     let negativeFilteredData = arr.filter((vl) => vl.quantity < 0);
  //     filteredData.map((vl) => {
  //       if (!filterObj[vl.materialId]) filterObj[vl.materialId] = vl;
  //     });
  //     negativeFilteredData.map((vl) => {
  //       if (filterObj[vl.materialId])
  //         filterObj[vl.materialId] = { ...filterObj[vl.materialId], receiveStoreLocation: vl.organization_store_location };
  //     });
  //     let responseArr = [];
  //     Object.keys(filterObj).map((key) => responseArr.push(filterObj[key]));
  //     setRespData(responseArr);
  //   }
  // };

  return (
    <>
      <MainCard title={'Consumption'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              {selectBox('projectId', 'Project', projectData, true, (e) => {
                if (e?.target?.value) setProjectId(e?.target?.value);
                resetContents('projectId');
              })}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('organizationTypeId', 'Organization Type', orgTypeData, true, onOrgTypeSelected)}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('organizationId', 'Organization', concateNameAndCode(orgData), true, onOrgSelected)}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('organizationbranchId', 'Organization Branch', concateNameAndCode(orgBranchData) || [], false, (e) => {
                onOrgSelected(e, true);
              })}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('fromProjectSiteStoreId', 'Store', projectStoreData, true, onSelectedFromStore)}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grid container>
                <Grid item xs={11}>
                  {selectBox(
                    'requisitionNumber',
                    'Requisition Number',
                    groupByRequisitionNumberForDropdown(requestList) || [],
                    true,
                    (e) => {
                      resetContents('requisitionNumber');
                      if (e?.target?.value) setRespData(e?.target?.row?.data);
                    }
                  )}
                </Grid>
                <Grid item xs={1}>
                  <Button sx={{ mt: 4 }} onClick={handleSubmit(onInitialSubmit)}>
                    <SearchIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}></Grid>
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

CreateNewConsumption.propTypes = {
  saveData: PropTypes.func,
  disableAll: PropTypes.bool,
  setDisableAll: PropTypes.func
};

export default CreateNewConsumption;
