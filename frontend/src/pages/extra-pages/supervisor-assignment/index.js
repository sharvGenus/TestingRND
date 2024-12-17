import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Grid } from '@mui/material';
import { useUsers } from '../users/useUsers';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { useProjects } from '../project/useProjects';
import NewSupervisorAssignment from './check-supervisor-assignment';
import { useSupervisorAssignments } from './useSupervisorAssignment';
import { SupervisorDeleteModal } from './supervisorDeleteModal';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { getAllSupervisors, getDropdownOrganization, getDropdownProjects, getLovsForMasterName, getUsers } from 'store/actions';
import { getSupervisorAssignmentHistory, getSupervisorAssignments } from 'store/actions/supervisorAssignmentAction';

const SupervisorAssignment = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const [selectedUser, setSelectedUser] = useState();
  const [selectedSupervisor, setSelectedSupervisor] = useState();
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [rowData, setRowData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  const fetchUsers = useCallback(() => {
    if (selectedProject && selectedOrganizationName) {
      dispatch(getUsers({ organizationId: selectedOrganizationName, projectId: selectedProject, supervision: true }));
      dispatch(getAllSupervisors({ projectId: selectedProject, organizationId: selectedOrganizationName }));
    }
  }, [dispatch, selectedProject, selectedOrganizationName]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedOrganizationType) {
      dispatch(getDropdownOrganization(selectedOrganizationType));
    }
  }, [dispatch, selectedOrganizationType]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const { masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType?.masterObject;

  useEffect(() => {
    if (record?.id) {
      dispatch(getSupervisorAssignmentHistory({ pageIndex, pageSize, recordId: record?.id, listType: 2 }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, record]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getSupervisorAssignments({ pageIndex, pageSize, userId: selectedUser, listType: 1 }));
    }
  }, [dispatch, pageIndex, pageSize, selectedUser, forceUpdate]);

  useEffect(() => {
    if (selectedSupervisor) {
      dispatch(getSupervisorAssignments({ pageIndex, pageSize, supervisorId: selectedSupervisor, listType: 1 }));
    }
  }, [dispatch, pageIndex, pageSize, selectedSupervisor, forceUpdate]);

  const { supervisorAssignments, supervisorAssignmentHistory } = useSupervisorAssignments();
  const { organizationsDropdown } = useOrganizations();
  const organizationNameData = organizationsDropdown?.organizationDropdownObject;

  const { users, supervisorUsers } = useUsers();
  const supervisorData = supervisorUsers?.supervisorUsersObject?.rows || [];
  const usersData = users?.usersObject?.rows || [];

  const { supervisorAssignmentData, supervisorAssignmentCount } = useMemo(
    () => ({
      supervisorAssignmentData: supervisorAssignments.supervisorAssignmentsObject?.rows || [],
      supervisorAssignmentCount: supervisorAssignments.supervisorAssignmentsObject?.count || 0,
      isLoading: supervisorAssignments.loading || false
    }),
    [supervisorAssignments]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: supervisorAssignmentHistory?.supervisorAssignmentHistoryObject?.rows || [],
      historyCounts: supervisorAssignmentHistory?.supervisorAssignmentHistoryObject?.count || 0,
      isLoading: supervisorAssignmentHistory?.loading || false
    }),
    [supervisorAssignmentHistory]
  );

  const supervisorwiseColumns = useMemo(
    () => [
      {
        Header: 'Supervisor',
        accessor: 'supervisor.name'
      },
      {
        Header: 'User',
        accessor: 'user.name'
      },
      {
        Header: 'Applicable Date',
        accessor: 'dateFrom'
      }
    ],
    []
  );

  const userwiseColumns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user.name'
      },
      {
        Header: 'Supervisor',
        accessor: 'supervisor.name'
      },
      {
        Header: 'Applicable Date',
        accessor: 'dateFrom'
      }
    ],
    []
  );

  const historyColumns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user.name'
      },
      {
        Header: 'Supervisor',
        accessor: 'supervisor.name'
      },
      {
        Header: 'Date From',
        accessor: 'dateFrom'
      },
      {
        Header: 'Date To',
        accessor: 'dateTo'
      },
      {
        Header: 'Status',
        accessor: 'isActive'
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      },
      {
        Header: 'Updated By',
        accessor: 'updated.name'
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Created By',
        accessor: 'created.name'
      }
    ],
    []
  );

  const setRefresh = () => {
    setRowData(null);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const modalProps = {
    refreshPagination,
    deleteId,
    setOpenDeleteModal,
    fetchUsers
  };

  return (
    <>
      <NewSupervisorAssignment
        refreshPagination={refreshPagination}
        setRefresh={setRefresh}
        organizationNameData={organizationNameData}
        setSelectedOrganizationType={setSelectedOrganizationType}
        selectedOrganizationType={selectedOrganizationType}
        organizationTypeData={organizationTypeData}
        setSelectedOrganizationName={setSelectedOrganizationName}
        selectedOrganizationName={selectedOrganizationName}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setSelectedSupervisor={setSelectedSupervisor}
        setSelectedProject={setSelectedProject}
        usersData={usersData}
        projectData={projectData}
        supervisorData={supervisorData}
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        {...(rowData && { data: rowData })}
      />
      {(selectedUser || selectedSupervisor) && (
        <TableForm
          hideHeader
          hideViewIcon
          hideHistoryIcon={selectedUser ? false : true}
          hideEditIcon
          data={supervisorAssignmentData}
          count={supervisorAssignmentCount}
          columns={selectedUser ? userwiseColumns : supervisorwiseColumns}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handleRowDelete={handleRowDelete}
          handleRowHistory={handleRowHistory}
        />
      )}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} scroll="paper" maxWidth="xs" disableEscapeKeyDown>
        <SupervisorDeleteModal {...modalProps} />
      </Dialog>
      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} scroll="paper" disableEscapeKeyDown minWidth="xl">
        <Grid container>
          <Grid item xs={12}>
            <TableForm
              isHistory
              title={'Supervisor Assignment'}
              data={historyData}
              columns={historyColumns}
              count={historyCounts}
              hideActions
              hideSearch
              hideAddButton
              hideExportButton
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default SupervisorAssignment;
