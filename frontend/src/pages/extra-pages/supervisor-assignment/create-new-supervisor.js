import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Grid, Button, Divider } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { useUsers } from '../users/useUsers';
import { useProjects } from '../project/useProjects';
import { useSupervisorAssignments } from './useSupervisorAssignment';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import {
  getDropdownOrganization,
  getDropdownOrganizationSecond,
  getDropdownProjects,
  getLovsForMasterName,
  getMasterMakerLov,
  getSupervisorAssignments,
  getUsers,
  getUsersSecond
} from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

const AssignNewSupervisor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [selectedOrganizationTypeSecond, setSelectedOrganizationTypeSecond] = useState([]);
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [selectedOrganizationNameSecond, setSelectedOrganizationNameSecond] = useState([]);
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const { organizationsDropdown, organizationsDropdownSecond } = useOrganizations();
  const { projectsDropdown } = useProjects();
  const { masterMakerOrgType } = useMasterMakerLov();
  const { users, usersSecond } = useUsers();
  const { supervisorAssignments } = useSupervisorAssignments();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const organizationTypeData = masterMakerOrgType?.masterObject;
  const organizationNameData = organizationsDropdown?.organizationDropdownObject;
  const organizationNameDataSecond = organizationsDropdownSecond?.organizationDropdownSecondObject?.rows || [];
  const { supervisorAssignmentData, supervisorAssignmentCount } = useMemo(
    () => ({
      supervisorAssignmentData: supervisorAssignments.supervisorAssignmentsObject?.rows || [],
      supervisorAssignmentCount: supervisorAssignments.supervisorAssignmentsObject?.count || 0,
      isLoading: supervisorAssignments.loading || false
    }),
    [supervisorAssignments]
  );

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        oraganizationType: Validations.other,
        oraganizationId: Validations.other,
        supervisorId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Contact',
        accessor: 'mobileNumber'
      }
    ],
    []
  );

  const supervisorAssignmentColumn = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'user.name'
      },
      {
        Header: 'Supervisor Name',
        accessor: 'supervisor.name'
      },
      {
        Header: 'Applicable Date',
        accessor: 'dateFrom'
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrganizationName && selectedProject?.length) {
      dispatch(getUsers({ organizationId: selectedOrganizationName, projectId: selectedProject }));
    }
  }, [dispatch, selectedOrganizationName, selectedProject]);

  useEffect(() => {
    if (selectedSupervisor) {
      dispatch(getSupervisorAssignments({ pageIndex, pageSize, supervisorId: selectedSupervisor }));
    }
  }, [dispatch, pageIndex, pageSize, selectedSupervisor]);

  useEffect(() => {
    if (selectedOrganizationNameSecond?.length && selectedProject?.length) {
      dispatch(
        getUsersSecond({
          organizationId: selectedOrganizationNameSecond,
          projectId: selectedProject,
          pageIndex,
          pageSize
        })
      );
    }
  }, [dispatch, selectedOrganizationNameSecond, selectedProject, pageIndex, pageSize, selectedSupervisor]);

  const { data, secondUsersData, countUsers } = useMemo(
    () => ({
      data: users?.usersObject?.rows || [],
      secondUsersData: usersSecond?.usersObject?.rows || [],
      countUsers: usersSecond?.usersObject?.count || 0
    }),
    [users, usersSecond]
  );

  useEffect(() => {
    const newData = secondUsersData.filter(
      (item) => item.id !== methods.watch('supervisorId') && item.supervisorId !== methods.watch('supervisorId')
    );
    setUserData(newData);
    setUserCount(countUsers);
  }, [secondUsersData, countUsers, methods]);

  useEffect(() => {
    if (selectedOrganizationType) {
      dispatch(getDropdownOrganization(selectedOrganizationType));
    }
  }, [dispatch, selectedOrganizationType]);

  useEffect(() => {
    if (selectedOrganizationTypeSecond?.length) {
      dispatch(getDropdownOrganizationSecond({ organizationTypeId: selectedOrganizationTypeSecond, multiId: true }));
    }
  }, [dispatch, selectedOrganizationTypeSecond]);

  useEffect(() => {
    setValue('dateFrom', new Date().toISOString().slice(0, 10));
  }, [setValue]);

  const handleBack = () => {
    setSelectedOrganizationType();
    setSelectedOrganizationName();
    setSelectedRecords([]);
    methods.reset();
    navigate('/supervisor-assignment');
  };

  const onFormSubmit = async (values) => {
    values.userId = selectedRecord;
    delete values['projectIdSecond'];
    delete values['oraganizationTypeSecond'];
    delete values['oraganizationIdSecond'];
    let response;
    response = await request('/supervisor-assignments-create', { method: 'POST', body: { supervisorAssignmentsDetails: values } });
    if (response.success) {
      const successMessage = 'Supervisor Assignment added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const handleOrganizationTypeId = (name, e) => {
    if (name === 'oraganizationType') {
      setSelectedOrganizationType(e.target?.value);
    } else if (name === 'oraganizationTypeSecond') {
      setSelectedOrganizationTypeSecond(e);
    }
  };

  const handleOrganizationId = (name, e) => {
    if (name === 'oraganizationId') {
      setSelectedOrganizationName(e.target?.value);
    } else if (name === 'oraganizationIdSecond') {
      setSelectedOrganizationNameSecond(e);
    }
  };

  const handleProjectId = (e) => {
    setSelectedProject([e.target?.value]);
  };

  const handleSupervisorId = (e) => {
    setSelectedSupervisor(e.target?.value);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Assign Supervisor'} sx={{ mb: 2 }}>
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
                  onChange={handleOrganizationTypeId.bind(this, 'oraganizationType')}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="oraganizationId"
                  label="Organization Name"
                  InputLabelProps={{ shrink: true }}
                  menus={selectedOrganizationType ? organizationNameData : []}
                  onChange={handleOrganizationId.bind(this, 'oraganizationId')}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="supervisorId"
                  label="Supervisor"
                  InputLabelProps={{ shrink: true }}
                  menus={selectedOrganizationName ? data.filter(({ supervisorId }) => !supervisorId) : []}
                  onChange={handleSupervisorId}
                  required={true}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFTextField name="dateFrom" label="Applicable Date" type="date" required={true} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                  <Button size="small" variant="outlined" color="primary" onClick={handleBack}>
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 3, mb: 3 }}>
              <Grid item md={12} xl={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item md={6} xl={6}>
                <RHFSelectTags
                  name={`oraganizationTypeSecond`}
                  label={'Organization Type'}
                  menus={organizationTypeData}
                  onChange={handleOrganizationTypeId.bind(this, 'oraganizationTypeSecond')}
                />
              </Grid>
              <Grid item md={6} xl={6}>
                <RHFSelectTags
                  name={`oraganizationIdSecond`}
                  label={'Organization Name'}
                  menus={selectedOrganizationTypeSecond?.length ? organizationNameDataSecond : []}
                  onChange={handleOrganizationId.bind(this, 'oraganizationIdSecond')}
                />
              </Grid>
            </Grid>
            <Grid item md={12} sx={{ mr: 2, mt: 4 }}>
              {selectedOrganizationNameSecond?.length && selectedProject?.length ? (
                <TableForm
                  title="Select Users"
                  hideAddButton
                  hideExportButton
                  hideActions
                  data={selectedOrganizationNameSecond?.length ? userData : []}
                  columns={columns}
                  count={selectedOrganizationNameSecond?.length ? userCount : 0}
                  showCheckbox
                  selectedRecord={selectedRecord}
                  setSelectedRecords={setSelectedRecords}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                />
              ) : (
                ''
              )}
            </Grid>
            <Grid item md={12} sx={{ mr: 2, mt: 4 }}>
              {selectedSupervisor && (
                <TableForm
                  title="Assigned Users"
                  hideActions
                  hideAddButton
                  hideExportButton
                  data={supervisorAssignmentData}
                  columns={supervisorAssignmentColumn}
                  count={supervisorAssignmentCount}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                />
              )}
            </Grid>
          </>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default AssignNewSupervisor;
