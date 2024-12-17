import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

const CheckSupervisorAssignment = (props) => {
  const navigate = useNavigate();
  const {
    usersData,
    supervisorData,
    showAdd,
    projectData,
    setSelectedUser,
    setSelectedSupervisor,
    setSelectedOrganizationType,
    selectedOrganizationType,
    setSelectedOrganizationName,
    selectedOrganizationName,
    organizationNameData,
    organizationTypeData,
    setSelectedProject
  } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        firmId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue } = methods;

  const handleUserSelection = (e) => {
    setValue('supervisorSelected');
    setSelectedSupervisor();
    setSelectedUser(e?.target?.value);
  };

  const handleSupervisorSelection = (e) => {
    setValue('userSelected');
    setSelectedUser();
    setSelectedSupervisor(e?.target?.value);
  };

  const handleOrganizationTypeId = (e) => {
    setSelectedOrganizationType(e?.target?.value);
  };

  const handleOrganizationNameId = (e) => {
    setSelectedOrganizationName(e?.target?.value);
  };

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value?.split());
  };

  const handleNewSupervisor = () => {
    navigate('/create-new-supervisor');
  };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard
          title={
            <Grid container xl={12} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Typography variant="h4">Supervisor Assignment</Typography>
              </Grid>
              {!showAdd && (
                <Grid item>
                  <Button onClick={() => handleNewSupervisor()} size="small" variant="contained" color="primary">
                    Assign Supervisor
                  </Button>
                </Grid>
              )}
            </Grid>
          }
          sx={{ mb: 2 }}
        >
          <>
            <Grid container spacing={4}>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="projectId"
                  label="Project"
                  InputLabelProps={{ shrink: true }}
                  menus={projectData}
                  onChange={handleProjectId}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="oraganizationType"
                  label="Organization Type"
                  InputLabelProps={{ shrink: true }}
                  menus={organizationTypeData}
                  onChange={handleOrganizationTypeId}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="oraganizationId"
                  label="Organization Name"
                  InputLabelProps={{ shrink: true }}
                  menus={selectedOrganizationType ? organizationNameData : []}
                  onChange={handleOrganizationNameId}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}></Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="supervisorSelected"
                  label="Search Supervisor"
                  InputLabelProps={{ shrink: true }}
                  menus={selectedOrganizationName ? supervisorData : []}
                  onChange={handleSupervisorSelection}
                  required={false}
                />
              </Grid>
              <Grid item md={0.5} xl={0.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>OR</Typography>
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="userSelected"
                  label="Search User"
                  InputLabelProps={{ shrink: true }}
                  menus={selectedOrganizationName ? usersData : []}
                  onChange={handleUserSelection}
                  required={false}
                />
              </Grid>
            </Grid>
          </>
        </MainCard>
      </FormProvider>
    </>
  );
};

CheckSupervisorAssignment.propTypes = {
  usersData: PropTypes.array,
  projectData: PropTypes.array,
  supervisorData: PropTypes.array,
  showAdd: PropTypes.bool,
  setShowAdd: PropTypes.func,
  setSelectedUser: PropTypes.func,
  setSelectedSupervisor: PropTypes.func,
  setSelectedOrganizationType: PropTypes.func,
  setSelectedOrganizationName: PropTypes.func,
  selectedOrganizationType: PropTypes.array,
  selectedOrganizationName: PropTypes.array,
  setSelectedProject: PropTypes.func,
  organizationNameData: PropTypes.array,
  organizationTypeData: PropTypes.array
};

export default CheckSupervisorAssignment;
