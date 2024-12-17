import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDropdownOrganization, getDropdownProjects, getMasterMakerLov } from 'store/actions';
import { concateNameAndCode, fetchTransactionType } from 'utils';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import FileBox from 'components/attachments/FileBox';

const ContractorLimit = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationId: Validations.organizationId,
        limitQuantity: Validations.quantity
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();
  const { organizationsDropdown } = useOrganizations();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const organizationsData = organizationsDropdown?.organizationDropdownObject;

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization(fetchTransactionType(orgTypeData, 'CONTRACTOR')));
  }, [dispatch, orgTypeData]);

  const onFormSubmit = async () => {};
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Contractor Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="organizationId"
                label="Contractor Name"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(organizationsData)}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="limitQuantity" label="Limit Quantity" type="number" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="remarks" label="Remarks" type="text" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2, ml: 2 }}>
              <Grid item md={6} xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <FileBox name="attachments" label="Attachments" />
              </Grid>
              <Grid item md={6} xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mb: '15px' }}>
                <Button type="submit" size="small" variant="contained" color="primary">
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default ContractorLimit;
