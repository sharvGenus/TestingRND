import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import {
  getCompanyStoreLocations,
  getDropdownOrganization,
  getDropdownOrganizationStores,
  getDropdownProjects,
  getFirmStoreLocations,
  getLovsForMasterName,
  getMasterMakerLov,
  getOrganizations,
  getOrganizationsLocationByParent
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode, valueIsMissingOrNA } from 'utils';

const CreateNewSTSRC = ({ saveData, disableAll, setDisableAll }) => {
  const [storeType, setStoreType] = useState('');
  const [orgTypeId, setOrgTypeId] = useState(null);
  const [projectStoreData, setProjectStoreData] = useState([]);
  const [storeLocationData, setStoreLocationdata] = useState([]);
  const [toStoreLocationData, setToStoreLocationdata] = useState([]);
  const [supplierAddress, setSupplierAddress] = useState('');
  const [eWayBillNumber, setEwayBillNumber] = useState();

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationTypeId: Validations.organizationType,
        organizationId: Validations.organizationId,
        fromProjectSiteStoreId: Validations.fromStore,
        toStoreLocationId: Validations.serviceCenter,
        supplierId: Validations.supplier,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch, clearErrors } = methods;
  const eWayBillNumberValue = watch('eWayBillNumber');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
    dispatch(getOrganizations({ transactionTypeId: 'b442aa8c-92cb-420f-9e34-04764be59fc5' }));
  }, [dispatch]);
  const { projectsDropdown } = useProjects();
  const { masterMakerOrgType, masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'STSRC');

  const orgType = masterMakerOrgType.masterObject || [];
  const orgTypeData = orgType.filter(
    (val) => val.id === '420e7b13-25fd-4d23-9959-af1c07c7e94b' || val.id === 'decb6c57-6d85-4f83-9cc2-50e0630003df'
  );

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  useEffect(() => {
    if (valueIsMissingOrNA(eWayBillNumber)) {
      clearErrors('eWayBillDate');
      setValue('eWayBillDate', '');
    }
  }, [clearErrors, eWayBillNumber, setValue]);

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('organizationTypeId', null);
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('toStoreLocationId', null);
    } else if (stage === 'organizationTypeId') {
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('toStoreLocationId', null);
    } else if (stage === 'organizationId') {
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('toStoreLocationId', null);
    } else if (stage === 'organizationbranchId') {
      setValue('fromProjectSiteStoreId', null);
      setValue('toStoreLocationId', null);
    } else if (stage === 'fromProjectSiteStoreId') {
      setValue('toStoreLocationId', null);
    }
  };

  const selectBox = (name, label, menus, req, onChange, allowClear = false) => {
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
          {...(allowClear && { allowClear: true })}
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
          {...(disableAll && { disabled: true })}
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
      setValue('toStoreLocationId', null);
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
  const { companyStoreLocations, firmStoreLocations } = useOrganizationStoreLocation();
  const storeLocation = storeType?.toLowerCase().includes('company')
    ? companyStoreLocations.companyStoreLocationsObject?.rows
    : storeType?.toLowerCase().includes('contractor')
    ? firmStoreLocations.firmStoreLocationsObject?.rows
    : [];

  const { organizationsDropdown, organizations, organizationsLocByParent } = useOrganizations();
  const orgData = organizationsDropdown.organizationDropdownObject || [];
  const orgDataSecond = organizations.organizationObject.rows || [];
  const { orgBranchData } = useMemo(
    () => ({
      orgBranchData: organizationsLocByParent.organizationObject.rows || []
    }),
    [organizationsLocByParent]
  );

  const [orgId, setOrgId] = useState(null);

  const onOrgSelected = (e, branch = false) => {
    if (e?.target?.value) {
      if (branch) resetContents('organizationbranchId');
      else resetContents('organizationId');
      !branch && setValue('orgnanizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('toStoreLocationId', null);
      !branch && dispatch(getOrganizationsLocationByParent({ params: orgTypeId + '/' + e?.target?.value }));
      setOrgId(e?.target?.value);
      let store = projectStore.filter((val) => val.organizationId === e?.target?.value);
      setProjectStoreData(store);
    }
  };

  const onInitialSubmit = (values) => {
    const selectedStore = projectStoreData.filter((val) => val.id === values.fromProjectSiteStoreId);
    setDisableAll(true);
    values['transactionTypeId'] = transactionTypeId;
    values['fromOrganizationId'] = selectedStore[0]?.organization?.parentId
      ? selectedStore[0]?.organization?.parentId
      : selectedStore[0]?.organization?.id;
    values['storeLocationData'] = storeLocationData;
    saveData(values);
  };

  const onSelectedFromStore = (e) => {
    if (e?.target?.value) {
      resetContents('fromProjectSiteStoreId');
      setValue('fromStoreLocationId', null);
      setValue('toStoreLocationId', null);
      let locData =
        storeLocation &&
        storeLocation.filter((val) => val?.organizationStoreId === e?.target?.value && val?.organization_store?.organization?.id === orgId);
      setStoreLocationdata(locData);
      let locToData =
        storeLocation &&
        storeLocation.filter(
          (val) =>
            val?.name?.toLowerCase()?.includes('service center') &&
            val?.organization_store?.organization?.id === orgId &&
            val?.organizationStoreId === e?.target?.value
        );
      setToStoreLocationdata(locToData);
    }
  };

  const onSupplierSelected = (e) => {
    const respData = e?.target?.row;
    const cityDetails = respData.cities ? respData.cities : respData.city;
    const addressdata = respData.registeredOfficeAddress ? respData.registeredOfficeAddress : respData.address;
    const pincode = respData.registeredOfficePincode ? respData.registeredOfficePincode : respData.pinCode;
    setSupplierAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
  };

  return (
    <>
      <MainCard title={'STSRC (Store To Service Center)'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              {selectBox('projectId', 'Project', projectData, true, () => {
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
              {selectBox(
                'organizationbranchId',
                'Organization Branch',
                concateNameAndCode(orgBranchData) || [],
                false,
                (e) => {
                  onOrgSelected(e, true);
                },
                true
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('fromProjectSiteStoreId', 'From Store', projectStoreData, true, onSelectedFromStore)}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('supplierId', 'Supplier', concateNameAndCode(orgDataSecond), true, onSupplierSelected)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{supplierAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('toStoreLocationId', 'Service Center Location', toStoreLocationData, true, () => {
                resetContents('toStoreLocationId');
              })}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('placeOfSupply', 'Place Of Supply', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('vehicleNumber', 'Vehicle No./LR No.', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('eWayBillNumber', 'E-Way Bill Number', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('eWayBillDate', 'E-Way Bill Date', 'date', false, valueIsMissingOrNA(eWayBillNumber))}
            </Grid>
            <Grid item xs={12} sm={3}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }} mt={2}>
                {!disableAll && (
                  <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                    Next
                  </Button>
                )}
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

CreateNewSTSRC.propTypes = {
  saveData: PropTypes.func,
  disableAll: PropTypes.bool,
  setDisableAll: PropTypes.func
};

export default CreateNewSTSRC;
