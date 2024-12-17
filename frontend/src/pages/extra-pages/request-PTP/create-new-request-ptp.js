import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import { getDropdownProjects, getMasterMakerLov, getMaterial, getOrganizationStores } from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

const CreateNewRequestPTP = ({ saveData }) => {
  const [addressData, setAddressData] = useState('');
  const [filterProjectData, setfilterProjectData] = useState([]);
  const [storeDetails, setStoreDetails] = useState(null);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        projectSiteStoreId: Validations.projectSiteStore,
        toProjectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMaterial());
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const {
    projectsDropdown: { projectsDropdownObject: projectData }
  } = useProjects();
  const {
    masterMakerLovs: {
      masterMakerLovsObject: { rows: transactionTypeData }
    }
  } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'PTPR');
  const organizationTypeId = fetchTransactionType(transactionTypeData, 'COMPANY');
  useEffect(() => {
    organizationTypeId && dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
  }, [dispatch, organizationTypeId]);
  const {
    organizationStores: {
      organizationStoreObject: { rows: companyStoreData }
    }
  } = useOrganizationStore();
  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };
  const onSelectedProject = (e) => {
    if (e?.target?.value) {
      setfilterProjectData(projectData.filter((x) => x.id !== e.target.value));
      setValue('projectSiteStoreId', '');
      setValue('toProjectId', '');
      setValue('remarks', '');
      setAddressData('');
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
      setValue('remarks', '');
    }
  };
  const onInitialSubmit = (values) => {
    values['transactionTypeId'] = transactionTypeId;
    values['storeDetails'] = storeDetails;
    values['requestOrganizationId'] = requestOrganizationId;
    saveData(values);
  };

  return (
    <>
      <MainCard title={'Material Transfer Project To Project Request'} sx={{ mb: 2 }}>
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
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectSiteStoreId"
                label="Company Store"
                menus={companyStoreData || []}
                onChange={onSelectedStore}
                required
              />
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{addressData}</Typography>
            </Grid>

            <Grid item md={3} xl={2}>
              <RHFSelectbox InputLabelProps={{ shrink: true }} name="toProjectId" label="To Project" menus={filterProjectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField InputLabelProps={{ shrink: true }} name="remarks" label="Remarks" type="text" />
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

CreateNewRequestPTP.propTypes = {
  onClick: PropTypes.func,
  getMaterialList: PropTypes.any,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  saveData: PropTypes.func
};

export default CreateNewRequestPTP;
