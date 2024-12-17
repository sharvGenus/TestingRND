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
  getOrganizationsLocationByParent,
  getStoreLocationsStock
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useOrganizations } from '../organization/useOrganizations';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { concateNameAndCode, valueIsMissingOrNA } from 'utils';

const getStoreLocation = (storeType, companyStoreLocations, firmStoreLocations) => {
  if (storeType?.toLowerCase().includes('company')) {
    return companyStoreLocations.companyStoreLocationsObject?.rows;
  } else if (storeType?.toLowerCase().includes('contractor')) {
    return firmStoreLocations.firmStoreLocationsObject?.rows;
  } else {
    return [];
  }
};

const CreateNewSRCTS = ({ saveData, disableAll, setDisableAll }) => {
  const [storeType, setStoreType] = useState('');
  const [orgTypeId, setOrgTypeId] = useState(null);
  const [projectStoreData, setProjectStoreData] = useState([]);
  const [storeLocationData, setStoreLocationdata] = useState([]);
  const [fromStoreLocationData, setFromStoreLocationdata] = useState([]);
  const [supplierAddress, setSupplierAddress] = useState('');
  const [eWayBillNumber, setEwayBillNumber] = useState();
  const [formValues, setFormValues] = useState({});

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationTypeId: Validations.organizationType,
        organizationId: Validations.organizationId,
        toProjectSiteStoreId: Validations.fromStore,
        fromStoreLocationId: Validations.serviceCenter,
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
  const { storeLocationsStock } = useStockLedger();
  const { projectsDropdown } = useProjects();
  const { masterMakerOrgType, masterMakerLovs } = useMasterMakerLov();

  const locsData = useMemo(() => storeLocationsStock?.allStoreLocationsStock, [storeLocationsStock]);

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'SRCTS');
  // const reqTransactionTypeId = fetchTransactionType(transactionTypeData, 'STSRC');

  const orgType = masterMakerOrgType.masterObject || [];
  const orgTypeData = orgType.filter(
    (val) => val.id === '420e7b13-25fd-4d23-9959-af1c07c7e94b' || val.id === 'decb6c57-6d85-4f83-9cc2-50e0630003df'
  );

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('organizationTypeId', null);
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('toProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationTypeId') {
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('toProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationId') {
      setValue('organizationbranchId', null);
      setValue('toProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'organizationbranchId') {
      setValue('toProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
    } else if (stage === 'toProjectSiteStoreId') {
      setValue('requisitionNumber', null);
      setValue('fromStoreLocationId', null);
    } else if (stage === 'requisitionNumber') {
      setValue('fromStoreLocationId', null);
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
      setValue('toProjectSiteStoreId', null);
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
  const { companyStoreLocations, firmStoreLocations } = useOrganizationStoreLocation();

  const storeLocation = getStoreLocation(storeType, companyStoreLocations, firmStoreLocations);

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
      setValue('toProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      !branch && dispatch(getOrganizationsLocationByParent({ params: orgTypeId + '/' + e?.target?.value }));
      setOrgId(e?.target?.value);
      let store = projectStore.filter((val) => val.organizationId === e?.target?.value);
      setProjectStoreData(store);
    }
  };

  const onInitialSubmit = (values) => {
    setFormValues(values);
    setDisableAll(true);
    dispatch(
      getStoreLocationsStock({
        projectId: values.projectId,
        storeId: values.toProjectSiteStoreId,
        supplierId: values.supplierId,
        storeLocationId: values.fromStoreLocationId
      })
    );
  };

  useEffect(() => {
    if (locsData?.[0]?.allMaterialsArr) {
      let values = formValues;
      const selectedStore = projectStoreData.filter((val) => val.id === values.toProjectSiteStoreId);
      // setDisableAll(!disableAll);
      values['transactionTypeId'] = transactionTypeId;
      values['fromOrganizationId'] = selectedStore[0]?.organization?.parentId
        ? selectedStore[0]?.organization?.parentId
        : selectedStore[0]?.organization?.id;
      values['storeLocationData'] = storeLocationData;
      values['materials'] = locsData?.[0]?.allMaterialsArr;
      saveData(values);
    }
  }, [locsData, formValues, transactionTypeId, projectStoreData, storeLocationData, saveData]);

  const onSelectedFromStore = (e) => {
    if (e?.target?.value) {
      resetContents('toProjectSiteStoreId');
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      let locData =
        storeLocation &&
        storeLocation.filter((val) => val?.organizationStoreId === e?.target?.value && val?.organization_store?.organization?.id === orgId);
      setStoreLocationdata(locData);
      let locToData =
        storeLocation &&
        storeLocation.filter(
          (val) =>
            val?.name.includes('Service Center') &&
            val?.organization_store?.organization?.id === orgId &&
            val?.organizationStoreId === e?.target?.value
        );
      setFromStoreLocationdata(locToData);
    }
  };

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  useEffect(() => {
    if (valueIsMissingOrNA(eWayBillNumber)) {
      clearErrors('eWayBillDate');
      setValue('eWayBillDate', '');
    }
  }, [clearErrors, eWayBillNumber, setValue]);

  const onSupplierSelected = (e) => {
    const respSData = e?.target?.row;
    const cityDetails = respSData.cities ? respSData.cities : respSData.city;
    const addressdata = respSData.registeredOfficeAddress ? respSData.registeredOfficeAddress : respSData.address;
    const pincode = respSData.registeredOfficePincode ? respSData.registeredOfficePincode : respSData.pinCode;
    setSupplierAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
  };

  return (
    <>
      <MainCard title={'SRCTS (Service Center To Store)'} sx={{ mb: 2 }}>
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
              {selectBox('toProjectSiteStoreId', 'To Store', projectStoreData, true, onSelectedFromStore)}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('supplierId', 'Supplier', concateNameAndCode(orgDataSecond), true, onSupplierSelected)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{supplierAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('fromStoreLocationId', 'Service Center Location', fromStoreLocationData, true, () => {
                resetContents('fromStoreLocationId');
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
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
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

CreateNewSRCTS.propTypes = {
  saveData: PropTypes.func,
  disableAll: PropTypes.bool,
  setDisableAll: PropTypes.func
};

export default CreateNewSRCTS;
