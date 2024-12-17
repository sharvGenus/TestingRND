import React, { forwardRef, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import {
  getMasterMakerLov,
  getOrgViewStoreDropdown,
  getOrganizationStores,
  getOrganizationStoresSecond,
  getOrganizations,
  getOrganizationsLocation,
  getProjectsForRoleOrUser,
  getTransactionMaterialList,
  // getTransactions,
  getUsersByPermission
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useUsers } from '../users/useUsers';
import { useOrganizations } from '../organization/useOrganizations';
import MaterialInputs from './material-inputs';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getFirmStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { concateNameAndCode } from 'utils';
import CircularLoader from 'components/CircularLoader';

const CreateNewMRF = forwardRef(({ getMaterialList, view, update, showData, saveData, materials }, ref) => {
  const [disableAll, setDisableAll] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [contractorAddress, setContractorAddress] = useState('');
  const [contractor, setContractor] = useState('');
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [requestStoreId, setRequestStoreId] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        fromStoreId: Validations.projectSiteStore,
        contractor: Validations.requiredWithLabel('Contractor'),
        // fromStoreLocationId: Validations.projectSiteStoreLocation,
        contractorEmployeeId: Validations.requiredWithLabel('Contractor Employee'),
        toStoreId: Validations.contractorStore,
        poNumber: Validations.workOrderNumber
        // toStoreLocationId: Validations.contractorStoreLocation
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { projectsGovernForRoleOrUser } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'MRF');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  const contractorId = fetchTransactionType(transactionTypeData, 'CONTRACTOR');

  useEffect(() => {
    if (companyId) {
      dispatch(getOrganizationStores({ organizationType: companyId }));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    if (contractorId) {
      dispatch(getOrganizations({ transactionTypeId: contractorId }));
      dispatch(getOrganizationsLocation({ transactionTypeId: contractorId }));
      dispatch(getOrganizationStoresSecond({ organizationType: contractorId }));
      dispatch(getFirmStoreLocations({ organizationType: contractorId }));
    }
  }, [dispatch, contractorId]);

  const projectData = projectsGovernForRoleOrUser?.projectsObject || [];
  const { usersByPermission } = useUsers();
  const contractorEmpData = usersByPermission.usersObject?.rows || [];

  const { organizations, organizationsLocation } = useOrganizations();

  const { contractorsMainData } = useMemo(
    () => ({
      contractorsMainData: (!organizations.loading && organizations.organizationObject?.rows) || [],
      isLoading: organizations.loading || false
    }),
    [organizations]
  );

  const { contractorsBranchData } = useMemo(
    () => ({
      contractorsBranchData: (!organizationsLocation.loading && organizationsLocation?.organizationLocationObject?.rows) || [],
      isLoading: organizationsLocation.loading || false
    }),
    [organizationsLocation]
  );

  const contractorsData = [...contractorsMainData, ...contractorsBranchData];

  const { organizationStoresSecond, orgViewStoreDropDown } = useOrganizationStore();
  const { firmStoreLocations } = useOrganizationStoreLocation();
  const projectStoreData = orgViewStoreDropDown?.orgViewStoreDropDownObject?.rows || [];
  const contractorData = organizationStoresSecond?.organizationStoreObject?.rows || [];
  const handleFilterData = (val) => {
    const newData = contractorData.filter((x) => x?.id === val);
    setRequestOrganizationId(newData[0]?.organization?.parentId ? newData[0]?.organization?.parentId : newData[0]?.organization?.id);
    setRequestStoreId(newData[0].id);
  };
  const firmStoreLocationData = firmStoreLocations.firmStoreLocationsObject?.rows || [];

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

  const onInitialFormSubmit = (iniValues) => {
    setLoading(true);
    iniValues['transactionTypeId'] = transactionTypeId;
    iniValues['requestOrganizationId'] = requestOrganizationId;
    iniValues['requestStoreId'] = requestStoreId;
    iniValues['approverStoreId'] = selectedStoreId;
    setFormValues(iniValues);
    saveData(iniValues);
    setDisableAll(true);
    // dispatch(getTransactions({ project: iniValues.projectId, store: iniValues.fromStoreId, withoutTransaction: true }));
    dispatch(getTransactionMaterialList({ project: iniValues.projectId, store: iniValues.fromStoreId }));
  };

  const { transactionMaterialList } = useStockLedger();
  let { storeData } = useMemo(
    () => ({
      storeData: transactionMaterialList?.stocksObject || [],
      isLoading: transactionMaterialList.loading || false
    }),
    [transactionMaterialList]
  );

  useEffect(() => {
    storeData && storeData.length > 0 && setLoading(false);
  }, [storeData]);

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onSelectedStore = (e) => {
    if (e) {
      const respData = fetchData(projectStoreData, e.target.value);
      const cityDetails = respData.cities ? respData.cities : respData.city;
      const addressdata = respData.registeredOfficeAddress ? respData.registeredOfficeAddress : respData.address;
      const pincode = respData.registeredOfficePincode
        ? respData.registeredOfficePincode
        : respData.pinCode
        ? respData.pinCode
        : respData.pincode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setSelectedStoreId(e.target.value);
    } else {
      setAddress('');
      setSelectedStoreId(null);
    }
  };

  // const getId = (org) => {
  //   if (org && org !== null) {
  //     if (org && org.parentId && org.parentId !== null) return org.parentId;
  //     else return org.id;
  //   }
  // };

  const onSelectedContractorStore = (e) => {
    if (e?.target?.value) {
      const locationsData =
        firmStoreLocationData &&
        firmStoreLocationData?.filter(
          (item) => item.organizationStoreId === e.target.value && !item?.name?.toLowerCase()?.includes('installer')
        );
      setFilteredLocations(locationsData);
      const respData = fetchData(contractorData, e.target.value);
      const cityDetails = respData.cities ? respData.cities : respData.city;
      const addressdata = respData.registeredOfficeAddress ? respData.registeredOfficeAddress : respData.address;
      const pincode = respData.registeredOfficePincode
        ? respData.registeredOfficePincode
        : respData.pinCode
        ? respData.pinCode
        : respData.pincode;
      setContractorAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      handleFilterData(e?.target?.value);
      dispatch(
        getUsersByPermission({
          contractorStoreId: e?.target?.value
        })
      );
      setAddress('');
      setValue('contractorEmployeeId', '');
      setValue('projectId', '');
      setValue('fromStoreId', '');
    } else {
      setContractorAddress('');
    }
  };

  const addFields = (store) => {
    const obj = {};
    const resp = [];
    store &&
      store.length > 0 &&
      store
        .filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55')
        .map((val) => {
          if (!obj[val.id]) {
            obj[val.id] = {
              ...val
              // rate: val.rate ? parseFloat(val.rate).toFixed(2) : null,
              // tax: val.tax ? val.tax : null,
              // code: val?.material?.code,
              // id: val?.material?.id,
              // name: val?.material?.name
            };
          }
        });
    Object.keys(obj).map((ky) => {
      resp.push(obj[ky]);
    });
    return resp && resp.length > 0 ? resp : [];
  };

  const onContractorSelected = (e) => {
    if (e?.target?.value) {
      setContractor(e?.target?.value);
      setContractorAddress('');
      setAddress('');
      setValue('toStoreId', '');
      setValue('contractorEmployeeId', '');
      setValue('projectId', '');
      setValue('fromStoreId', '');
    }
  };

  const onSelectedProject = (e) => {
    if (e?.target?.value) {
      setValue('fromStoreId', '');
      setAddress('');
    }
  };

  const onEmployeeSelected = (e) => {
    dispatch(getProjectsForRoleOrUser({ userId: e?.target?.value }));
    dispatch(getOrgViewStoreDropdown({ userId: e?.target?.value, organizationType: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
    setValue('projectId', '');
    setValue('fromStoreId', '');
    setAddress('');
  };
  const onBack = () => setDisableAll(false);

  return (
    <>
      <MainCard title={'MRF (Material Requisition Form)'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('contractor', 'Contractor', concateNameAndCode(contractorsData || []), true, onContractorSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'toStoreId',
                'Contractor Store',
                contractorData.filter(
                  (val) =>
                    val.organizationId === contractor ||
                    (val.organization && val.organization.parentId && val.organization.parentId === contractor)
                ),
                true,
                onSelectedContractorStore
              )}
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{contractorAddress}</Typography>
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'contractorEmployeeId',
                'Contractor Employee',
                contractorEmpData.filter(
                  (val) => val.authorizedUser == true && (val.organization.id === contractor || val.organisationBranch.id === contractor)
                ) || [],
                true,
                onEmployeeSelected
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData || [], true, onSelectedProject)}
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              {selectBox('fromStoreId', 'Company Store', projectStoreData || [], true, onSelectedStore)}
            </Grid>
            <Grid item md={8} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{address}</Typography>
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              {txtBox('poNumber', 'Work Order Number', 'text', true, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                {!disableAll && (
                  <Button onClick={handleSubmit(onInitialFormSubmit)} size="small" variant="contained" color="primary">
                    Next
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          {disableAll && (
            <>
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid item md={12} xl={12}>
                  <Divider />
                </Grid>
              </Grid>
              <MaterialInputs
                ref={ref}
                materialData={addFields(storeData)}
                onMaterailsInput={getMaterialList}
                storeLocationData={filteredLocations}
                view={view}
                update={update}
                showData={showData}
                formValues={formValues}
              />
            </>
          )}
        </FormProvider>
      </MainCard>
      {loading && <CircularLoader />}
      {disableAll && (materials || []).length === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
            <Button onClick={onBack} size="small" variant="outlined" color="primary">
              Back
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
});

CreateNewMRF.propTypes = {
  getMaterialList: PropTypes.any,
  materials: PropTypes.array,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  saveData: PropTypes.func
};

export default CreateNewMRF;
