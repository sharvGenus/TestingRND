import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../project/useProjects';
import { useOrganizations } from '../organization/useOrganizations';
import { useUsers } from '../users/useUsers';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import NewWorkAreaAllocation from './gaa-network-area-allocation';
import { useGaaNetworkAreaAssignments } from './useGaaNetworkAreaAssignments';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import {
  getDropdownOrganization,
  getDropdownProjects,
  getGaaNetworkAreaAllocation,
  getLovsForMasterName,
  getUsersWithForms
} from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';
import { startLoading, stopLoading } from 'store/reducers/loadingSlice';

const UserList = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [selectedOrganizationNameOuter, setSelectedOrganizationNameOuter] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [rowData, setRowData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const { user } = useAuth();
  const [userLoggedInGaaNetworkData, setUserLoggedInGaaNetworkData] = useState(null);
  const fetchUserDetailsLoggedIn = useCallback(async () => {
    if (user?.id) {
      const userId = user?.id;
      if (userId && userId !== '577b8900-b333-42d0-b7fb-347abc3f0b5c') {
        const response = await request('/get-gaanetwork-userId', {
          method: 'GET',
          query: { userId }
        });
        if (response?.success) {
          return setUserLoggedInGaaNetworkData(response?.data?.data);
        }
        const error = response.error && response.error.message ? response.error.message : response.error;
        toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserDetailsLoggedIn();
  }, [dispatch, fetchUserDetailsLoggedIn]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    if (
      (user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || userLoggedInGaaNetworkData) &&
      selectedOrganizationType &&
      selectedOrganizationNameOuter
    ) {
      setIsLoading(true);
      dispatch(getGaaNetworkAreaAllocation({ selectedOrganizationType, selectedOrganizationNameOuter, setIsLoading }));
    } else if (selectedOrganizationType && selectedOrganizationNameOuter) {
      toast('No Access Asssign to you', { variant: 'error' });
      setIsLoading(false);
    }
  }, [
    dispatch,
    pageIndex,
    pageSize,
    forceUpdate,
    selectedOrganizationType,
    selectedOrganizationNameOuter,
    userLoggedInGaaNetworkData,
    user?.id
  ]);

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
  const { gaaNetworkAreaAllocation } = useGaaNetworkAreaAssignments();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const organizationNameData = organizationsDropdown?.organizationDropdownObject;

  const { usersWithForms } = useUsers();

  const { data, count } = useMemo(
    () => ({
      data: usersWithForms?.usersWithForms.filter((item) => item?.id !== user?.id) || [],
      count: usersWithForms?.usersWithForms.filter((item) => item?.id !== user?.id)?.length || 0
    }),
    [usersWithForms, user]
  );

  const { gaaNetworkAreaAllocationData, gaaNetworkAreaAllocationCount } = useMemo(
    () => ({
      gaaNetworkAreaAllocationData:
        gaaNetworkAreaAllocation?.gaaNetworkAreaAllocationObject?.data?.filter((item) => item?.userId !== user?.id) || [],
      gaaNetworkAreaAllocationCount:
        gaaNetworkAreaAllocation?.gaaNetworkAreaAllocationObject?.data?.filter((item) => item?.userId !== user?.id).length || 0,
      isLoading: gaaNetworkAreaAllocation.loading || false
    }),
    [gaaNetworkAreaAllocation, user]
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
        Header: 'Email',
        accessor: 'email'
      }
    ],
    []
  );

  const gaaNetworkAreaColumn = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'user.name'
      },
      {
        Header: 'Mobile Number',
        accessor: 'user.mobileNumber'
      },
      {
        Header: 'Project',
        accessor: 'projectName'
      },
      {
        Header: 'Level',
        accessor: 'levelName'
      },
      {
        Header: 'Level Entry',
        accessor: (item) =>
          item.lovArray.map((x, index) => (
            <Fragment key={x}>
              {x}
              {index !== item.lovArray.length - 1 && <br />}
            </Fragment>
          ))
      },
      {
        Header: 'Allocation Date',
        accessor: 'updatedAt'
      }
    ],
    []
  );

  const setRefresh = () => {
    setRowData(null);
  };

  const handleRowDelete = async (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const navigate = useNavigate();
  const handleRowUpdate = async (value) => {
    navigate('/edit-gaa-network-area-allocation/' + value?.userId);
  };

  const confirmDelete = async () => {
    const id = deleteId;
    const response = await request(`/user-master-lov-permission-delete`, { method: 'DELETE', params: id });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  }, [dispatch, isLoading]);

  return (
    <>
      {user?.id && (
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
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setSelectedHierarchy={setSelectedHierarchy}
          selectedHierarchy={selectedHierarchy}
          selectedRecord={selectedRecord}
          setSelectedRecords={setSelectedRecords}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
          masterId={gaaNetworkAreaAllocationData[0]?.masterId}
          {...(rowData && { data: rowData })}
          isAccessData={userLoggedInGaaNetworkData}
          isAdmin={user?.id}
        />
      )}
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
        : (user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || userLoggedInGaaNetworkData) &&
          selectedOrganizationType &&
          selectedOrganizationNameOuter && (
            <TableForm
              hideAddButton
              hideExportButton
              hideHistoryIcon
              hideViewIcon
              data={gaaNetworkAreaAllocationData}
              columns={gaaNetworkAreaColumn}
              count={gaaNetworkAreaAllocationCount}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              handleRowUpdate={handleRowUpdate}
              handleRowDelete={handleRowDelete}
              LoggedInUserhierarchyType={userLoggedInGaaNetworkData?.hierarchyType}
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
    </>
  );
};

export default UserList;
