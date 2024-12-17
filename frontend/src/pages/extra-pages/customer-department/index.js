import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getCustomerDepartmentsHistory, getCustomerWiseCustomerDepartments } from '../../../store/actions/customerDepartmentMasterAction';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import CreateNewCustomerDepartment from './create-new-customer-department';
import { useCustomerDepartments } from './useCustomerDepartments';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { getDropdownOrganization, getMasterMakerLov } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const CustomerDepartment = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreRow, setRestoreRow] = useState(null);
  const [listType, setListType] = useState(1);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

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

    if (selectedCustomer) {
      dispatch(
        getCustomerWiseCustomerDepartments({
          pageIndex,
          pageSize,
          listType,
          customerId: selectedCustomer,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          sortBy: sort?.[0],
          sortOrder: sort?.[1],
          filterObject: filterObjectForApi
        })
      );
    }
  }, [
    dispatch,
    pageIndex,
    pageSize,
    listType,
    selectedCustomer,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    forceUpdate,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const customerId = fetchTransactionType(transactionTypeData, 'CUSTOMER');

  useEffect(() => {
    if (customerId) {
      dispatch(getDropdownOrganization(customerId));
    }
  }, [dispatch, customerId]);

  const { organizationsDropdown } = useOrganizations();
  const customerData = organizationsDropdown?.organizationDropdownObject;

  useEffect(() => {
    if (record?.id) {
      dispatch(getCustomerDepartmentsHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { customerWiseCustomerDepartments, customerDepartmentsHistory } = useCustomerDepartments();
  const { data, count } = useMemo(
    () => ({
      data: customerWiseCustomerDepartments.customerWiseCustomerDepartmentsObject?.rows || [],
      count: customerWiseCustomerDepartments.customerWiseCustomerDepartmentsObject?.count || 0,
      isLoading: customerWiseCustomerDepartments.loading || false
    }),
    [customerWiseCustomerDepartments]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: customerDepartmentsHistory.customerDepartmentsHistoryObject?.rows || [],
      historyCounts: customerDepartmentsHistory.customerDepartmentsHistoryObject?.count || 0,
      isLoading: customerDepartmentsHistory.loading || false
    }),
    [customerDepartmentsHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Customer Name',
        accessor: 'organization.name'
      },
      {
        Header: 'Department Name',
        accessor: 'name',
        filterProps: {
          tableName: 'customer_departments',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Department Code',
        accessor: 'code',
        filterProps: {
          tableName: 'customer_departments',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'customer_departments',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      },
      {
        Header: 'Updated By',
        accessor: 'updated.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'updatedBy'
        }
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Created By',
        accessor: 'created.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'createdBy'
        }
      }
    ],
    []
  );

  const setRefresh = () => {
    setView(false);
    setUpdate(false);
    setRowData(null);
  };

  const setListTypeData = (value) => {
    setListType(value);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleRowView = (row) => {
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-customer-department`, { method: 'DELETE', params: deleteId });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  const confirmRestore = async () => {
    const updatedValues = {
      ...restoreRow,
      isActive: '1'
    };
    const response = await request('/customer-department-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewCustomerDepartment
        refreshPagination={refreshPagination}
        setRefresh={setRefresh}
        customerData={customerData}
        setSelectedCustomer={setSelectedCustomer}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedCustomer && (
        <TableForm
          title="Customer Department"
          data={data}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handleRowRestore={handleRowRestore}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          handleRowHistory={handleRowHistory}
          handleRowView={handleRowView}
          listType={listType}
          setListType={setListTypeData}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: 'customer_departments',
            apiQuery: { listType, customerId: selectedCustomer, filterObject: filterObjectForApi }
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
      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} scroll="paper" disableEscapeKeyDown maxWidth="lg">
        <TableForm
          isHistory
          title={record?.name}
          data={historyData}
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

export default CustomerDepartment;
