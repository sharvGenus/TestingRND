import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import CreateNewUser from './create-new-user';
import { useUsers } from './useUsers';
import { useFilterContext } from 'contexts/FilterContext';
import TableForm from 'tables/table';
import { getUsers, getUsersHistory } from 'store/actions';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { hasChanged } from 'utils';
import usePrevious from 'hooks/usePrevious';
import useAuth from 'hooks/useAuth';

const Users = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, forceSearch, accessorsRef, setAccessors, setSearchString, searchStringTrimmed } = useSearch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openLockModal, setOpenLockModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [lockRow, setLockRow] = useState(null);
  const [restoreRow, setRestoreRow] = useState(null);
  const [listType, setListType] = useState(1);
  const [lockType, setLockType] = useState(1);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(null);
  const dispatch = useDispatch();

  const { filterObjectForApi } = useFilterContext();

  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);
  const { user } = useAuth();
  const isSuperUser = user?.role?.name === 'SuperUser' ? true : false;
  const isCompanyUser = user?.oraganizationType === '420e7b13-25fd-4d23-9959-af1c07c7e94b' ? true : false;

  useEffect(() => {
    if (
      [
        [prevFilterObjectForApi, filterObjectForApi],
        [prevSort, sort]
      ].some(hasChanged)
    ) {
      refreshPagination();
      return;
    }

    dispatch(
      getUsers({
        pageIndex,
        pageSize,
        listType,
        lockType,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0],
        sortOrder: sort?.[1],
        filterObject: filterObjectForApi,
        hasAccess: isCompanyUser
      })
    );
  }, [
    accessorsRef,
    dispatch,
    listType,
    lockType,
    pageIndex,
    pageSize,
    searchStringTrimmed,
    sort,
    forceUpdate,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    isCompanyUser
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getUsersHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { users, usersHistory } = useUsers();
  const { data, count } = useMemo(
    () => ({
      data: users.usersObject?.rows || [],
      count: users.usersObject?.count || 0,
      isLoading: users.loading || false
    }),
    [users]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: usersHistory.usersHistoryObject?.rows || [],
      historyCounts: usersHistory.usersHistoryObject?.count || 0,
      isLoading: usersHistory.loading || false
    }),
    [usersHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Organization Type',
        accessor: 'master_maker_lov.name',
        filterProps: {
          tableName: 'organizationType',
          getColumn: 'name',
          customAccessor: 'oraganizationTypeId'
        }
      },
      {
        Header: 'Organization Name',
        accessor: 'organization.nameAndCode',
        exportAccessor: 'organization.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'oraganizationId'
        }
      },
      {
        Header: 'Organization Branch',
        accessor: 'organisationBranch.nameAndCode',
        exportAccessor: 'organisationBranch.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'organizationId'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'WFM Code',
        accessor: 'wfmCode',
        filterProps: {
          tableName: 'users',
          getColumn: 'wfm_code',
          customAccessor: 'wfmCode'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'users',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterProps: {
          tableName: 'users',
          getColumn: 'email',
          customAccessor: 'email'
        }
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber',
        filterProps: {
          tableName: 'users',
          getColumn: 'mobile_number',
          customAccessor: 'mobileNumber'
        }
      },
      {
        Header: 'Address',
        accessor: 'address',
        filterProps: {
          tableName: 'users',
          getColumn: 'address',
          customAccessor: 'address'
        }
      },
      {
        Header: 'Country',
        accessor: 'city.state.country.name',
        filterProps: {
          tableName: 'countries',
          getColumn: 'name',
          customAccessor: 'countryId'
        }
      },
      {
        Header: 'State',
        accessor: 'city.state.name',
        filterProps: {
          tableName: 'states',
          getColumn: 'name',
          customAccessor: 'stateId'
        }
      },
      {
        Header: 'City',
        accessor: 'city.name',
        filterProps: {
          tableName: 'cities',
          getColumn: 'name',
          customAccessor: 'cityId'
        }
      },
      {
        Header: 'Date Of On Boarding',
        accessor: 'dateOfOnboarding'
      },
      {
        Header: 'Status',
        accessor: 'user_status.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'status',
          customAccessor: 'status'
        }
      },
      {
        Header: 'Pincode',
        accessor: 'pinCode',
        filterProps: {
          tableName: 'users',
          getColumn: 'pin_code',
          customAccessor: 'pinCode'
        }
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Updated By',
        accessor: 'updated.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy'
        }
      },
      {
        Header: 'Created By',
        accessor: 'created.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'created_by',
          customAccessor: 'createdBy'
        }
      },
      {
        Header: 'Last Login',
        accessor: 'lastLogin'
      },
      {
        Header: 'Source',
        accessor: 'source',
        filterProps: {
          tableName: 'users',
          getColumn: 'source',
          customAccessor: 'source'
        }
      },
      {
        Header: 'App Version',
        accessor: 'appVersion',
        filterProps: {
          tableName: 'users',
          getColumn: 'app_version',
          customAccessor: 'appVersion'
        }
      },
      {
        Header: 'User ID',
        accessor: 'id'
      },
      {
        Header: 'Organization Type ID',
        accessor: 'oraganizationType'
      },
      {
        Header: 'Organization ID',
        accessor: 'oraganizationId'
      }
    ],
    []
  );

  const onBack = () => {
    setListType(1);
    setView(false);
    setUpdate(false);
    setRowData(null);
    setShowAdd(!showAdd);
  };

  const setListTypeData = (value) => {
    setListType(value);
  };

  const setLockTypeData = (value) => {
    setLockType(value);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleLockToggle = (value) => {
    setLockRow(value);
    setOpenLockModal(true);
  };

  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const confirmLockUnlock = async () => {
    const { name, mobileNumber, address, pinCode, email } = lockRow;
    const response = await request('/user-update', {
      method: 'PUT',
      body: {
        name,
        mobileNumber,
        email,
        address,
        pinCode,
        isLocked: !lockRow.isLocked
      },
      params: lockRow.id
    });
    if (response.success) {
      refreshPagination();
      setOpenLockModal(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-user`, {
      method: 'DELETE',
      params: `${deleteId}/c15f716f-5fc7-422c-8ac2-74c688dce2d1`
    });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  const confirmRestore = async () => {
    const { name, mobileNumber, address, pinCode, email } = restoreRow;
    const response = await request('/user-update', {
      method: 'PUT',
      body: {
        name,
        mobileNumber,
        address,
        email,
        pinCode,
        isActive: '1',
        status: '8e92b381-56ab-4191-af00-12f3c59c09bf'
      },
      params: restoreRow.id
    });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const mergeNameAndCode = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        let val = structuredClone(vl);
        val.organization = { ...val.organization, nameAndCode: val.organization?.name + ' - ' + val.organization?.code };
        if (val.organisationBranchId && val.organisationBranchId !== null) {
          val.organisationBranch = {
            ...val.organisationBranch,
            nameAndCode: val.organisationBranch?.name + ' - ' + val.organisationBranch?.code
          };
        }
        newArr.push(val);
      });
    return newArr;
  };

  return (
    <>
      {showAdd ? (
        <CreateNewUser
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="User Creation"
          data={mergeNameAndCode(data)}
          columns={columns}
          count={count}
          hideType
          hideImportButton
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onClick={onBack}
          handleRowRestore={handleRowRestore}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          handleRowHistory={handleRowHistory}
          handleRowView={handleRowView}
          handleLockToggle={handleLockToggle}
          showLockIcon={true}
          listType={listType}
          setListType={setListTypeData}
          lockType={lockType}
          setLockType={setLockTypeData}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          hideDeleteIcon
          hideEditIcon={isSuperUser ? false : true}
          hideRestoreIcon
          // disableDeleteIcon={true}
          exportConfig={{
            tableName: 'users',
            apiQuery: { listType, filterObject: filterObjectForApi }
          }}
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
      <ConfirmModal
        open={openRestoreModal}
        handleClose={() => setOpenRestoreModal(false)}
        handleConfirm={confirmRestore}
        title="Confirm Restore"
        message="Are you sure you want to restore?"
        confirmBtnTitle="Restore"
      />
      <ConfirmModal
        open={openLockModal}
        handleClose={() => setOpenLockModal(false)}
        handleConfirm={confirmLockUnlock}
        title={`Confirm ${lockRow?.isLocked ? 'Unlock' : 'Lock'}`}
        message={`Are you sure you want to ${lockRow?.isLocked ? 'unlock' : 'lock'} user?`}
        confirmBtnTitle="Confirm"
      />
      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} scroll="paper" disableEscapeKeyDown maxWidth="lg">
        <TableForm
          isHistory
          title={record?.name}
          data={mergeNameAndCode(historyData)}
          columns={columns}
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

export default Users;
