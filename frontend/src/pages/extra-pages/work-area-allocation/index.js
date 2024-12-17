import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@mui/material';
import { useProjects } from '../project/useProjects';
import { useOrganizations } from '../organization/useOrganizations';
import { useUsers } from '../users/useUsers';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import NewWorkAreaAllocation from './work-area-allocation';
import { useWorkAreaAssignments } from './useWorkAreaAssignments';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import {
  getDropdownOrganization,
  getDropdownProjects,
  getLovsForMasterName,
  getUsers,
  getUsersWithForms,
  getWorkAreaAssignmentHistory,
  getWorkAreaAssignments
} from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const UserList = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [selectedOrganizationNameOuter, setSelectedOrganizationNameOuter] = useState('');
  const [selectedUser, setSelectedUser] = useState();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [rowData, setRowData] = useState(null);

  const dispatch = useDispatch();
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getWorkAreaAssignments({ pageIndex, pageSize, userId: selectedUser }));
    }
  }, [dispatch, pageIndex, pageSize, selectedUser, forceUpdate]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getWorkAreaAssignmentHistory({ pageIndex, pageSize, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, record]);

  useEffect(() => {
    if (selectedOrganizationNameOuter) {
      dispatch(getUsers({ organizationId: selectedOrganizationNameOuter }));
    }
  }, [dispatch, selectedOrganizationNameOuter]);

  useEffect(() => {
    if (selectedOrganizationName) {
      dispatch(getUsersWithForms({ organizationId: selectedOrganizationName }));
    }
  }, [dispatch, selectedOrganizationName]);

  useEffect(() => {
    if (selectedOrganizationType) {
      dispatch(getDropdownOrganization(selectedOrganizationType));
    }
  }, [dispatch, selectedOrganizationType]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType?.masterObject;
  const { projectsDropdown } = useProjects();
  const { organizationsDropdown } = useOrganizations();
  const { workAreaAssignments, workAreaAssignmentHistory } = useWorkAreaAssignments();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const organizationNameData = organizationsDropdown?.organizationDropdownObject;

  const { users, usersWithForms } = useUsers();
  const userData = users.usersObject?.rows || [];

  const { data, count } = useMemo(
    () => ({
      data: usersWithForms?.usersWithForms || [],
      count: usersWithForms?.usersWithForms?.length || 0
    }),
    [usersWithForms]
  );

  const { workAssignmentData, workAssignmentCount } = useMemo(
    () => ({
      workAssignmentData: workAreaAssignments.workAreaAssignmentsObject?.data || [],
      workAssignmentCount: workAreaAssignments.workAreaAssignmentsObject?.count || 0,
      isLoading: workAreaAssignments.loading || false
    }),
    [workAreaAssignments]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: workAreaAssignmentHistory.workAreaAssignmentHistoryObject?.data || [],
      historyCounts: workAreaAssignmentHistory.workAreaAssignmentHistoryObject?.count || 0,
      isLoading: workAreaAssignmentHistory.loading || false
    }),
    [workAreaAssignmentHistory]
  );

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
        Header: 'Mobile Number',
        accessor: 'mobileNumber'
      },
      {
        Header: 'Forms Assigned',
        accessor: (item) =>
          item.forms.map((form, index) => (
            <Fragment key={item.forms.name}>
              {form}
              {index !== item.forms.length - 1 && <br />}
            </Fragment>
          ))
      }
    ],
    []
  );

  const workAssignmentColumn = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'user.name'
      },
      {
        Header: 'Project',
        accessor: 'project.name'
      },
      {
        Header: 'Level',
        accessor: (item) => item.gaa_hierarchy?.name || item.network_hierarchy?.name
      },
      {
        Header: 'Level Entry',
        accessor: (item) =>
          item.gaaLevelEntryNames.map((x, index) => (
            <Fragment key={x}>
              {x}
              {index !== item.gaaLevelEntryNames.length - 1 && <br />}
            </Fragment>
          )) ||
          item.networkLevelEntryNames.map((x, index) => (
            <Fragment key={x}>
              {x}
              {index !== item.networkLevelEntryNames.length - 1 && <br />}
            </Fragment>
          ))
      },
      {
        Header: 'Allocation Date',
        accessor: 'dateFrom'
      }
    ],
    []
  );

  const historyColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'user.name'
      },
      {
        Header: 'Project',
        accessor: 'project.name'
      },
      {
        Header: 'Level',
        accessor: (item) => item.gaa_hierarchy?.name || item.network_hierarchy?.name
      },
      {
        Header: 'Level Entry',
        accessor: (item) =>
          item.gaaLevelEntryNames.map((x, index) => (
            <Fragment key={x}>
              {x}
              {index !== item.gaaLevelEntryNames.length - 1 && <br />}
            </Fragment>
          )) ||
          item.networkLevelEntryNames.map((x, index) => (
            <Fragment key={x}>
              {x}
              {index !== item.networkLevelEntryNames.length - 1 && <br />}
            </Fragment>
          ))
      },
      {
        Header: 'Allocation Date',
        accessor: 'dateFrom'
      },
      {
        Header: 'Expiry Date',
        accessor: 'dateTo'
      }
    ],
    []
  );

  const setRefresh = () => {
    setRowData(null);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleRowDelete = async (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const navigate = useNavigate();
  const handleRowUpdate = async (value) => {
    navigate('/edit-work-area-allocation/' + value?.userId);
  };

  const confirmDelete = async () => {
    const response = await request(`/work-area-assignment-delete`, { method: 'DELETE', params: deleteId });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message, { variant: 'error' });
    }
  };

  return (
    <>
      <NewWorkAreaAllocation
        setRefresh={setRefresh}
        projectData={projectData}
        selectedOrganizationType={selectedOrganizationType}
        setSelectedOrganizationType={setSelectedOrganizationType}
        setSelectedOrganizationNameOuter={setSelectedOrganizationNameOuter}
        selectedOrganizationName={selectedOrganizationName}
        setSelectedOrganizationName={setSelectedOrganizationName}
        organizationNameData={organizationNameData}
        organizationTypeData={organizationTypeData}
        setSelectedUser={setSelectedUser}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setSelectedHierarchy={setSelectedHierarchy}
        selectedHierarchy={selectedHierarchy}
        selectedRecord={selectedRecord}
        setSelectedRecords={setSelectedRecords}
        userData={userData}
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        {...(rowData && { data: rowData })}
      />
      {showAdd
        ? selectedOrganizationName && (
            <TableForm
              title="Select User"
              hideAddButton
              hideExportButton
              hideActions
              data={data}
              columns={columns}
              count={count}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              showCheckbox
              selectedRecord={selectedRecord}
              setSelectedRecords={setSelectedRecords}
            />
          )
        : selectedUser && (
            <TableForm
              hideHeader
              hideViewIcon
              hidePagination
              data={workAssignmentData}
              columns={workAssignmentColumn}
              count={workAssignmentCount}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              handleRowUpdate={handleRowUpdate}
              handleRowDelete={handleRowDelete}
              handleRowHistory={handleRowHistory}
            />
          )}
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} scroll="paper" disableEscapeKeyDown maxWidth="lg">
        <TableForm
          isHistory
          title={'Work Area Allocation'}
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
      </Dialog>
    </>
  );
};

export default UserList;
