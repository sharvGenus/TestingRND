import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useTransactionTypeRange } from './useTransactionTypeRange';
import CreateNewTransactionType from './create-new-transaction-type-range';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import { getLovsForMasterName, getTransactionTypeRangeHistory, getTransactionTypeRangeList } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const MasterMakerLov = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreRow, setRestoreRow] = useState(null);
  const [listType, setListType] = useState(1);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();
  const { masterMakerOrgType } = useMasterMakerLov();

  const masterMakeData = useMemo(() => masterMakerOrgType?.masterObject || [], [masterMakerOrgType?.masterObject]);

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);

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

    dispatch(
      getTransactionTypeRangeList({
        pageIndex,
        pageSize,
        listType,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0] || 'updatedAt',
        sortOrder: sort?.[1] || 'DESC',
        filterObject: filterObjectForApi
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    forceUpdate,
    listType,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getTransactionTypeRangeHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, forceUpdate, record]);

  const { transactionTypeRange, transactionTypeRangeHistory } = useTransactionTypeRange();
  const { data, count } = useMemo(
    () => ({
      data: transactionTypeRange?.transactionTypeRangesObject?.rows || [],
      count: transactionTypeRange?.transactionTypeRangesObject?.count || 0,
      isLoading: transactionTypeRange.loading || false
    }),
    [transactionTypeRange]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: transactionTypeRangeHistory.transactionTypeRangeHistoryObject?.rows || [],
      historyCounts: transactionTypeRangeHistory.transactionTypeRangeHistoryObject?.count || 0,
      isLoading: transactionTypeRangeHistory.loading || false
    }),
    [transactionTypeRangeHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Organization',
        accessor: 'orgName',
        exportAccessor: 'organization.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'orgName'
        }
      },
      {
        Header: 'Organization Branch',
        accessor: 'branchName',
        exportAccessor: 'branchName',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'orgBranchName'
        }
      },
      {
        Header: 'Store',
        accessor: 'organization_store.name',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'name',
          customAccessor: 'storeName'
        }
      },
      {
        Header: 'Prefix',
        accessor: 'prefix',
        filterProps: {
          tableName: 'transaction_type_ranges',
          getColumn: 'prefix',
          customAccessor: 'prefix'
        }
      },
      {
        Header: 'Transaction Type',
        accessor: 'traxnsName',
        filterProps: {
          tableName: 'transaction_type_ranges',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Start Range',
        accessor: 'startRange',
        filterProps: {
          tableName: 'transaction_type_ranges',
          getColumn: 'start_range',
          customAccessor: 'startRange'
        }
      },
      {
        Header: 'End Range',
        accessor: 'endRange',
        filterProps: {
          tableName: 'transaction_type_ranges',
          getColumn: 'end_range',
          customAccessor: 'endRange'
        }
      },
      {
        Header: 'Effective Date',
        accessor: 'effectiveDate'
      },
      {
        Header: 'End Date',
        accessor: 'endDate'
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
        Header: 'Created By',
        accessor: 'created.name',
        filterProps: {
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'createdBy'
        }
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      }
    ],
    []
  );

  const onBack = () => {
    setView(false);
    setListType(1);
    setRowData(null);
    setUpdate(false);
    setShowAdd(!showAdd);
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

  const confirmDelete = async () => {
    const response = await request('/delete-transaction-type-range', { method: 'DELETE', params: deleteId });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message, { variant: 'error' });
    }
  };

  const confirmRestore = async () => {
    if (!restoreRow.endDate) {
      const response = await request('/transaction-type-range-activate', { method: 'PUT', params: restoreRow.id });
      if (response.success) {
        refreshPagination();
        setOpenRestoreModal(false);
      } else {
        toast(response?.error?.message, { variant: 'error' });
        setOpenRestoreModal(false);
      }
    } else {
      toast('This Record Can not be activeted', { variant: 'error' });
      setOpenRestoreModal(false);
    }
  };

  const fetchTransactions = (arr) => {
    const str = [];
    arr &&
      arr.length > 0 &&
      arr.map((id) => {
        const foundData = masterMakeData?.find((item1) => item1.id === id);
        if (foundData) str.push(foundData.name);
      });
    return str && str.length > 1 ? str?.join(', ') : str.toString();
  };

  const addTransactionsName = (arr) => {
    let respArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        respArr.push({
          ...val,
          traxnsName: fetchTransactions(val.transactionTypeIds),
          orgName: val?.organization?.name + ' - ' + val?.organization?.code,
          branchName:
            val?.organization_store?.organization?.parentId && val?.organization_store?.organization?.parentId !== null
              ? val?.organization_store?.organization?.name + ' - ' + val?.organization_store?.organization?.code
              : '-'
        });
      });
    return respArr;
  };
  return (
    <>
      {showAdd ? (
        <CreateNewTransactionType
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Transaction Type Range"
          data={addTransactionsName(data)}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          columns={columns}
          onClick={onBack}
          handleRowView={handleRowView}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          handleRowRestore={handleRowRestore}
          listType={listType}
          setListType={setListTypeData}
          handleRowHistory={handleRowHistory}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: 'transaction_type_ranges',
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

export default MasterMakerLov;
