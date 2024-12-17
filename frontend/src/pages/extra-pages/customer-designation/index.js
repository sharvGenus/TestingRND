import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { useOrganizations } from '../organization/useOrganizations';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useCustomerDepartments } from '../customer-department/useCustomerDepartments';
import CreateNewCustomerDesignation from './create-new-customer-designation';
import { useCustomerDesignations } from './useCustomerDesignations';
import TableForm from 'tables/table';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import { getCustomerDepartmentsDropdown, getCustomerDesignationHistory, getDepartmentWiseCustomerDesignations } from 'store/actions';
import { getDropdownOrganization, getMasterMakerLov } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const CustomerDesignation = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(false);
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
    if (selectedDepartment) {
      dispatch(
        getDepartmentWiseCustomerDesignations({
          pageIndex,
          pageSize,
          listType,
          customerDepartmentId: selectedDepartment,
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
    selectedDepartment,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    filterObjectForApi,
    prevFilterObjectForApi,
    prevSort,
    refreshPagination
  ]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(getCustomerDepartmentsDropdown(selectedCustomer));
    }
  }, [dispatch, selectedCustomer]);

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

  const { customerDepartmentsDropdown } = useCustomerDepartments();

  const departmentData = customerDepartmentsDropdown.customerDepartmentsDropdownObject;

  useEffect(() => {
    if (record?.id) {
      dispatch(getCustomerDesignationHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { departmentWiseCustomerDesignations, customerDesignationHistory } = useCustomerDesignations();
  const { data, count } = useMemo(
    () => ({
      data: departmentWiseCustomerDesignations.departmentWiseCustomerDesignationsObject?.rows || [],
      count: departmentWiseCustomerDesignations.departmentWiseCustomerDesignationsObject?.count || 0,
      isLoading: departmentWiseCustomerDesignations.loading || false
    }),
    [departmentWiseCustomerDesignations]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: customerDesignationHistory.customerDesignationHistoryObject?.rows || [],
      historyCounts: customerDesignationHistory.customerDesignationHistoryObject?.count || 0,
      isLoading: customerDesignationHistory.loading || false
    }),
    [customerDesignationHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Customer Name',
        accessor: 'customer_department.organization.name'
      },
      {
        Header: 'Department Name',
        accessor: 'customer_department.name'
      },
      {
        Header: 'Designation Name',
        accessor: 'name',
        filterProps: {
          tableName: 'customer_designations',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Designation Code',
        accessor: 'code',
        filterProps: {
          tableName: 'customer_designations',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'customer_designations',
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

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
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

  const confirmDelete = async () => {
    const response = await request(`/delete-customer-designation`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/customer-designation-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewCustomerDesignation
        refreshPagination={refreshPagination}
        setRefresh={setRefresh}
        customerData={customerData}
        departmentData={departmentData}
        setSelectedCustomer={setSelectedCustomer}
        setSelectedDepartment={setSelectedDepartment}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedDepartment && (
        <TableForm
          title="Customer Designation"
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
            tableName: 'customer_designations',
            apiQuery: { listType, customerDepartmentId: selectedDepartment, filterObject: filterObjectForApi }
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

export default CustomerDesignation;
