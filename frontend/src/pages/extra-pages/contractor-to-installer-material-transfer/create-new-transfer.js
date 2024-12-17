import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import {
  getDropdownOrganization,
  getDropdownOrganizationLocation,
  getDropdownProjects,
  getLovsForMasterNameSecond,
  getMasterMakerLov,
  getOrganizationStores,
  getRoleProjects,
  getUsers
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useUsers } from '../users/useUsers';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import { useRoles } from '../roles-and-permissions/useRoles';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getCompanyStoreLocations, getFirmStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { concateNameAndCode } from 'utils';
import toast from 'utils/ToastNotistack';
import { APIImport } from 'components/third-party/ReactTable';

const CreateNewMaterialTransferToInstaller = ({ disableAll, saveData }) => {
  const [address, setAddress] = useState('');
  const [selectContractor, setSelectedContractor] = useState(null);
  const [selectContractorId, setSelectedContractorId] = useState(null);
  const [selectedContractorStore, setSelectedContractorStore] = useState(null);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        orgTypeId: Validations.organizationType,
        contractorStoreId: Validations.organizationStoreId,
        contractor: Validations.organizationId,
        roleId: Validations.requiredWithLabel('Role'),
        installerId: Validations.requiredWithLabel('Installer'),
        installerStoreLocationId: Validations.installerStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, watch, setValue } = methods;
  const [projectId] = watch(['projectId']);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);
  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CTI');
  const [isCompany, setIsCompany] = useState(false);

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('orgTypeId', null);
      setValue('contractor', null);
      setValue('contractorBranch', null);
      setValue('contractorStoreId', null);
      setValue('roleId', null);
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
      setAddress('');
    }
    if (stage === 'orgTypeId') {
      setValue('contractor', null);
      setValue('contractorBranch', null);
      setValue('contractorStoreId', null);
      setValue('roleId', null);
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
      setAddress('');
    }
    if (stage === 'contractor') {
      setValue('contractorBranch', null);
      setValue('contractorStoreId', null);
      setValue('roleId', null);
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
      setAddress('');
    }
    if (stage === 'contractorBranch') {
      setValue('contractorStoreId', null);
      setValue('roleId', null);
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
      setAddress('');
    }
    if (stage === 'contractorStoreId') {
      setValue('roleId', null);
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
    }
    if (stage === 'roleId') {
      setValue('installerId', null);
      setValue('installerStoreLocationId', null);
    }
    if (stage === 'installerId') {
      setValue('installerStoreLocationId', null);
    }
    // if (stage === 'installerStoreLocationId
  };

  const onSelectedOrgType = (e) => {
    resetContents('orgTypeId');
    if (e?.target?.value) {
      dispatch(getDropdownOrganization(e?.target?.value));
      dispatch(getDropdownOrganizationLocation(e?.target?.value));
      dispatch(getOrganizationStores({ organizationType: e?.target?.value }));
      if (e?.target?.value === '420e7b13-25fd-4d23-9959-af1c07c7e94b') {
        setValue('isCompany', true);
        setIsCompany(true);
        dispatch(getCompanyStoreLocations({ organizationType: e?.target?.value }));
      } else {
        setValue('isCompany', false);
        setIsCompany(false);
        dispatch(getFirmStoreLocations({ organizationType: e?.target?.value }));
      }
    }
  };

  const { organizationsDropdown, organizationsLocationDropdown } = useOrganizations();
  const { roleProjects } = useRoles();
  const rolesData = roleProjects?.roleProjectsObject?.rows || [];
  const projectData = projectsDropdown?.projectsDropdownObject;
  const { organizationStores } = useOrganizationStore();
  const { firmStoreLocations, companyStoreLocations } = useOrganizationStoreLocation();
  const contractoreStore = organizationStores.organizationStoreObject?.rows || [];
  const contractoreStoreData = [...contractoreStore];

  const { users } = useUsers();
  const contractor = organizationsDropdown?.organizationDropdownObject || [];
  const contractorLoc = organizationsLocationDropdown?.organizationLocationDropdownObject || [];
  const contractorData = [...contractor];
  const [contractorBranchData, setContractorBranchData] = useState([]);
  const firmStoreLocationsData = firmStoreLocations?.firmStoreLocationsObject?.rows || [];
  const companyStoreLocationsData = companyStoreLocations?.companyStoreLocationsObject?.rows || [];
  const installersStoreData = isCompany ? companyStoreLocationsData : firmStoreLocationsData;
  const installerData = users.usersObject?.rows || [];

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

  const onInitialSubmit = (values) => {
    if (values.receivingStore === null)
      toast('Receiving store location not found for selected store.', {
        variant: 'error',
        autoHideDuration: 2000
      });
    else {
      values['orgId'] = selectContractorId;
      values['contractorId'] = selectContractorId;
      values['transactionTypeId'] = transactionTypeId;
      saveData(values);
    }
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onSelectedStore = (e) => {
    resetContents('contractorStoreId');
    if (e?.target?.value) {
      const respData = fetchData(contractoreStoreData, e.target.value);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setSelectedContractorStore(e?.target?.value);
      let receiveData;
      receiveData = installersStoreData.filter(
        (val) => val.organizationStoreId === e?.target?.value && val?.name?.toLowerCase()?.includes('receiving')
      );
      if (receiveData && receiveData.length === 0 && isCompany) {
        receiveData = installersStoreData.filter(
          (val) => val.organizationStoreId === e?.target?.value && val?.name?.toLowerCase()?.includes('brought out')
        );
        if (receiveData && receiveData.length === 0) {
          receiveData = installersStoreData.filter(
            (val) => val.organizationStoreId === e?.target?.value && val?.name?.toLowerCase()?.includes('genus supply')
          );
        }
      }
      setValue('receivingStore', receiveData && receiveData.length ? receiveData[0]?.id : null);
    }
  };

  const onSelectedContractor = (e) => {
    resetContents('contractor');
    if (e?.target?.value) {
      setSelectedContractorId(e.target.value);
      setSelectedContractor(e?.target?.value);
      let contData = contractorLoc.filter((val) => val.parent && val.parent !== null && val.parent.id === e.target.value);
      setContractorBranchData(contData);
    }
  };

  const onSelectedContractorBranch = (e) => {
    resetContents('contractorBranch');
    if (e?.target?.value) {
      let row = e?.target?.row;
      setSelectedContractorId(row && row.parent && row.parent !== null ? row?.parent?.id : e.target.value);
      setSelectedContractor(e?.target?.value);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    dispatch(getRoleProjects({ selectedProject: projectId }));
  }, [dispatch, projectId]);

  // useEffect(() => {
  //   dispatch(getUsers({ organizationId: selectedContractor, roleId: roleNameInstallerId }));
  // }, [dispatch, roleNameInstallerId, selectedContractor]);

  const onSelectedRole = (e) => {
    resetContents('roleId');
    if (e?.target?.value) {
      dispatch(
        getUsers({
          organizationId: selectContractorId,
          roleId: e?.target?.value,
          lockType: 1
        })
      );
    }
  };

  const {
    masterMakerOrgTypeSecond: { masterObject: orgTypeData }
  } = useMasterMakerLov();

  useEffect(() => {
    dispatch(getLovsForMasterNameSecond('ORGANIZATION TYPE'));
  }, [dispatch]);

  return (
    <>
      <MainCard title={'Material Transfer to Installer'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ textAlign: 'right' }} mt={-9}>
              <APIImport tableName={'cti'} apipath={'/import-cti-transaction'} forTraxns />
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, true, () => {
                resetContents('projectId');
              })}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'orgTypeId',
                'Organization Type',
                orgTypeData.filter(
                  (val) => val.id === '420e7b13-25fd-4d23-9959-af1c07c7e94b' || val.id === 'decb6c57-6d85-4f83-9cc2-50e0630003df'
                ),
                true,
                onSelectedOrgType
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('contractor', 'Organization', concateNameAndCode(contractorData), true, onSelectedContractor)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'contractorBranch',
                'Organization Branch',
                concateNameAndCode(contractorBranchData),
                false,
                onSelectedContractorBranch
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'contractorStoreId',
                'Organization Store',
                contractoreStoreData.filter((val) => val.organizationId === selectContractor),
                true,
                onSelectedStore
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{address}</Typography>
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('roleId', 'Role', rolesData, true, onSelectedRole)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('installerId', 'Installer', installerData, true, () => {
                resetContents('installerId');
                const installersData = installersStoreData.filter(
                  (val) => val.organizationStoreId === selectedContractorStore && val?.name?.toLowerCase()?.includes('installer')
                );
                setValue('installerStoreLocationId', installersData && installersData.length ? installersData[0]?.id : null);
                setValue('installerStoreLocationName', installersData && installersData.length ? installersData[0]?.name : null);
              })}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'installerStoreLocationId',
                'Installer Store Location',
                installersStoreData.filter(
                  (val) => val.organizationStoreId === selectedContractorStore && val?.name?.toLowerCase()?.includes('installer')
                ),
                true
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            {!disableAll && (
              <Grid container spacing={4}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }} mt={4}>
                  <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                    Next
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewMaterialTransferToInstaller.propTypes = {
  disableAll: PropTypes.bool,
  saveData: PropTypes.func
};

export default CreateNewMaterialTransferToInstaller;
