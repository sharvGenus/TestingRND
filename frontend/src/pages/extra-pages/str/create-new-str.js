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
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores,
  getOrganizationStoresAllAccess,
  getOrganizations,
  getOrganizationsLocationByParent
} from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode } from 'utils';

const CreateNewSTR = ({ saveData, disableAll }) => {
  // const [fromStoreId, setFromStoreId] = useState(null);
  const [fromAddress, setFromAddress] = useState('');
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [toAddress, setToAddress] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        fromOrganizationId: Validations.requiredWithLabel('Organization'),
        toProjectSiteStoreId: Validations.requiredWithLabel('From Company Store'),
        fromProjectSiteStoreId: Validations.requiredWithLabel('To Company Store')
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
  }, [dispatch]);
  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'STR');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');

  const projectData = projectsDropdown?.projectsDropdownObject;
  const { organizations, organizationsLocByParent } = useOrganizations();
  const { organizationStores, organizationStoresAllAccess } = useOrganizationStore();
  const orgData = organizations.organizationObject?.rows || [];
  const orgBranchData = organizationsLocByParent?.organizationObject?.rows || [];
  const { projectStoreData } = useMemo(
    () => ({
      projectStoreData: organizationStores.organizationStoreObject?.rows || []
    }),
    [organizationStores]
  );
  const { projectStoreDataAll } = useMemo(
    () => ({
      projectStoreDataAll: organizationStoresAllAccess.organizationStoreObject?.rows || []
    }),
    [organizationStoresAllAccess]
  );
  const [toStoreId, setToStoreId] = useState(null);
  const [toProjectStoreData, setToProjectStoreData] = useState([]);
  const [fromProjectStoreData, setFromProjectStoreData] = useState([]);
  const [orgId, setOrgId] = useState(null);

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('fromOrganizationId', null);
      setValue('fromOrganizationBranchId', null);
      setValue('toProjectSiteStoreId', null);
      setToAddress('');
      setValue('fromProjectSiteStoreId', null);
      setFromAddress('');
      setValue('remarks', null);
    } else if (stage === 'fromOrganizationId') {
      setValue('fromOrganizationBranchId', null);
      setValue('toProjectSiteStoreId', null);
      setToAddress('');
      setValue('fromProjectSiteStoreId', null);
      setFromAddress('');
      setValue('remarks', null);
    } else if (stage === 'fromOrganizationBranchId') {
      setValue('toProjectSiteStoreId', null);
      setToAddress('');
      setValue('fromProjectSiteStoreId', null);
      setFromAddress('');
      setValue('remarks', null);
    } else if (stage === 'toProjectSiteStoreId') {
      setValue('fromProjectSiteStoreId', null);
      setFromAddress('');
      setValue('remarks', null);
    } else if (stage === 'fromProjectSiteStoreId') {
      setValue('remarks', null);
    }
  };

  useEffect(() => {
    if (companyId) dispatch(getOrganizations({ transactionTypeId: companyId }));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (orgId) {
      let toProjectNStoreData = projectStoreData.filter((vl) => vl.organizationId === orgId);
      setToProjectStoreData(toProjectNStoreData);
    }
  }, [orgId, projectStoreData]);

  useEffect(() => {
    if (projectStoreDataAll && toStoreId) {
      let fromProjectStoreDataNew = projectStoreDataAll.filter((vl) => vl.id !== toStoreId);
      setFromProjectStoreData(fromProjectStoreDataNew);
    }
  }, [projectStoreDataAll, toStoreId]);

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
    values['transactionTypeId'] = transactionTypeId;
    values['requestOrganizationId'] = requestOrganizationId;
    saveData(values);
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onSelectedFromStore = (e) => {
    if (e?.target?.value) {
      const respData = fetchData(fromProjectStoreData, e.target.value);
      // setFromStoreId(e.target.value);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setFromAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      resetContents('fromProjectSiteStoreId');
    }
  };

  const onSelectedToStore = (e) => {
    if (e?.target?.value) {
      const respData = fetchData(projectStoreData, e.target.value);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setToAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setRequestOrganizationId(respData?.organization?.parentId ? respData?.organization?.parentId : respData?.organization?.id);
      setToStoreId(e?.target?.value);
      resetContents('toProjectSiteStoreId');
    }
  };

  const onProjectSelected = (e) => {
    if (e?.target?.value) {
      resetContents('projectId');
    }
  };

  useEffect(() => {
    if (companyId) dispatch(getOrganizationStores({ organizationType: companyId }));
  }, [dispatch, companyId]);

  const onFromOrgSelected = (e) => {
    if (e?.target?.value) {
      dispatch(getOrganizationsLocationByParent({ params: companyId + '/' + e?.target?.value }));
      dispatch(getOrganizationStoresAllAccess({ organizationType: companyId, organizationId: e?.target?.value }));
      setOrgId(e?.target?.value);
      resetContents('fromOrganizationId');
    }
  };

  const onFromOrgBranchSelected = (e) => {
    if (e?.target?.value) {
      dispatch(getOrganizationStoresAllAccess({ organizationType: companyId, organizationId: e?.target?.value }));
      let toProjectNStoreData = projectStoreData.filter((vl) => vl.organizationId === e?.target?.value);
      setToProjectStoreData(toProjectNStoreData);
      resetContents('fromOrganizationBranchId');
    }
  };

  return (
    <>
      <MainCard title={'STR (Stock Transfer Request)'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, true, onProjectSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('fromOrganizationId', 'Organization', concateNameAndCode(orgData), true, onFromOrgSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'fromOrganizationBranchId',
                'Organization Branch',
                concateNameAndCode(orgBranchData),
                false,
                onFromOrgBranchSelected
              )}
            </Grid>
          </Grid>
          <Grid container spacing={4} mt={1}>
            <Grid item md={3} xl={2}>
              {selectBox('toProjectSiteStoreId', 'From Company Store', toProjectStoreData, true, onSelectedToStore)}
            </Grid>
            <Grid item md={8} xl={10}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{toAddress}</Typography>
            </Grid>
          </Grid>
          {/* <Grid container spacing={4} mt={1}>
            <Grid item md={3} xl={2}>
              {selectBox('toOrganizationId', 'To Organization', concateNameAndCode(orgData), true, onToOrgSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'toOrganizationBranchId',
                'To Organization Branch',
                concateNameAndCode(orgBranchData2),
                false,
                onToOrgBranchSelected
              )}
            </Grid>
          </Grid> */}
          <Grid container spacing={4} mt={1}>
            <Grid item md={3} xl={2}>
              {selectBox('fromProjectSiteStoreId', 'To Company Store', fromProjectStoreData, true, onSelectedFromStore)}
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{fromAddress}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={4} mt={1}>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                {!disableAll && (
                  <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                    Next
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewSTR.propTypes = {
  saveData: PropTypes.func,
  disableAll: PropTypes.bool
};

export default CreateNewSTR;
