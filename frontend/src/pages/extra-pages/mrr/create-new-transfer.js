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
  getMasterMakerLov,
  getOrgViewStoreDropdown,
  getOrganizationStores,
  getOrganizations,
  getOrganizationsLocation,
  getProjectsForRoleOrUser,
  getRoles,
  getUsersByPermission
  // getUsersByPermission
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useUsers } from '../users/useUsers';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getFirmStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { concateNameAndCode } from 'utils';

const CreateNewMRR = ({ disableAll, saveData, setProjectId, setStoreId }) => {
  const [address, setAddress] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [selectedContractor, setSelectedContractor] = useState(null);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        contractorStoreId: Validations.contractorStore,
        contractorId: Validations.contractor,
        projectId: Validations.project,
        projectSiteStoreId: Validations.projectSiteStore,
        contractorEmployeeId: Validations.requiredWithLabel('Contractor Employee')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, watch, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getRoles());
  }, [dispatch]);
  const { projectsGovernForRoleOrUser } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();
  const { usersByPermission } = useUsers();

  const projectId = watch('projectId');
  const storeId = watch('contractorStoreId');

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);

  useEffect(() => {
    setStoreId(storeId);
  }, [setStoreId, storeId]);

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const organizationEmployeeData = usersByPermission.usersObject?.rows || [];

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'MRR');
  const contractorId = fetchTransactionType(transactionTypeData, 'CONTRACTOR');

  useEffect(() => {
    if (contractorId) {
      dispatch(getOrganizations({ transactionTypeId: contractorId }));
      dispatch(getOrganizationsLocation({ transactionTypeId: contractorId }));
      dispatch(getOrganizationStores({ organizationType: contractorId }));
      dispatch(getFirmStoreLocations({ organizationType: contractorId }));
    }
  }, [dispatch, contractorId]);

  const { organizations, organizationsLocation } = useOrganizations();
  const projectData = projectsGovernForRoleOrUser?.projectsObject || [];
  const { organizationStores, orgViewStoreDropDown } = useOrganizationStore();
  const contractoreStoreData = organizationStores.organizationStoreObject?.rows || [];
  const projectStoreData = orgViewStoreDropDown?.orgViewStoreDropDownObject?.rows || [];
  const contractorMainData = organizations?.organizationObject?.rows || [];
  const contractorBranchData = organizationsLocation?.organizationLocationObject?.rows || [];
  const contractorData = [...contractorMainData, ...contractorBranchData];
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

  const onInitialSubmit = (formValues) => {
    formValues['transactionTypeId'] = transactionTypeId;
    formValues['requestOrganizationId'] = requestOrganizationId;
    saveData(formValues);
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onSelectedStore = (e) => {
    dispatch(
      getUsersByPermission({
        contractorStoreId: e?.target?.value
      })
    );
    if (e.target.value) {
      const respData = fetchData(contractoreStoreData, e.target.value);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setRequestOrganizationId(respData?.organization?.parentId ? respData?.organization?.parentId : respData?.organization?.id);
      setValue('contractorEmployeeId', '');
      setValue('projectId', '');
      setValue('projectSiteStoreId', '');
      setCompanyAddress('');
    }
  };

  const onSelectedContractor = (e) => {
    if (e?.target?.value) {
      setValue('contractorStoreId', '');
      setAddress('');
      setValue('contractorEmployeeId', '');
      setValue('projectId', '');
      setValue('projectSiteStoreId', '');
      setCompanyAddress('');
      setSelectedContractor(e.target.value);
    }
  };

  const onProjectSelected = (e) => {
    if (e?.target?.value) {
      setValue('projectSiteStoreId', '');
      setCompanyAddress('');
    }
  };

  const onSelectedProjectSiteStore = (e) => {
    if (e?.target?.value) {
      const respData = fetchData(projectStoreData, e.target.value);
      const cityDetails = respData.cities ? respData.cities : respData.city;
      const addressdata = respData.registeredOfficeAddress ? respData.registeredOfficeAddress : respData.address;
      const pincode = respData.registeredOfficePincode
        ? respData.registeredOfficePincode
        : respData.pinCode
        ? respData.pinCode
        : respData.pincode;
      setCompanyAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
    }
  };

  const onEmployeeSelected = (e) => {
    if (e?.target?.value) {
      dispatch(getProjectsForRoleOrUser({ userId: e?.target?.value }));
      dispatch(getOrgViewStoreDropdown({ userId: e?.target?.value, organizationType: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
      setValue('projectId', '');
      setValue('projectSiteStoreId', '');
      setCompanyAddress('');
    }
  };

  return (
    <>
      <MainCard title={'MRR (Material Return Request)'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('contractorId', 'Contractor', concateNameAndCode(contractorData), true, onSelectedContractor)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'contractorStoreId',
                'Contractor Store',
                contractoreStoreData.filter(
                  (val) =>
                    val.organizationId === selectedContractor ||
                    (val.organization && val.organization.parentId && val.organization.parentId === selectedContractor)
                ),
                true,
                onSelectedStore
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{address}</Typography>
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'contractorEmployeeId',
                'Contractor Employee',
                organizationEmployeeData.filter(
                  (val) =>
                    val.authorizedUser == true &&
                    (val.organization.id === selectedContractor || val.organisationBranch.id === selectedContractor)
                ),
                true,
                onEmployeeSelected
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, true, onProjectSelected)}
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              {selectBox('projectSiteStoreId', 'Company Store', projectStoreData, true, onSelectedProjectSiteStore)}
            </Grid>
            <Grid item md={8} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{companyAddress}</Typography>
            </Grid>
            <Grid item xs={12} mb={-4}></Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            {!disableAll && (
              <Grid container spacing={4}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: 2 }}>
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

CreateNewMRR.propTypes = {
  saveData: PropTypes.func,
  setProjectId: PropTypes.func,
  disableAll: PropTypes.bool,
  setStoreId: PropTypes.func
};

export default CreateNewMRR;
