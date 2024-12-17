import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getMasterMaker, getMasterMakerHistory } from '../../../store/actions/masterMakerAction';
import CreateNewMaster from './create-new-master';
import { useMasterMaker } from './useMasterMaker';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { hasChanged } from 'utils';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';

const MasterMaker = () => {
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
      getMasterMaker({
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
    accessorsRef,
    dispatch,
    listType,
    pageIndex,
    pageSize,
    searchStringTrimmed,
    sort,
    forceUpdate,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getMasterMakerHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const { masterMakers, masterMakerHistory } = useMasterMaker();

  const { data, count } = useMemo(
    () => ({
      data: masterMakers.masterMakerObject?.rows || [],
      count: masterMakers.masterMakerObject?.count || 0,
      isLoading: masterMakers.loading || false
    }),
    [masterMakers]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: masterMakerHistory.masterMakerHistoryObject?.rows || [],
      historyCounts: masterMakerHistory.masterMakerHistoryObject?.count || 0,
      isLoading: masterMakerHistory.loading || false
    }),
    [masterMakerHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Master ID',
        accessor: 'id',
        filterProps: {
          tableName: 'master_makers',
          getColumn: 'id',
          customAccessor: 'masterId'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'master_makers',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'master_makers',
          getColumn: 'remarks',
          customAccessor: 'remarks'
        }
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
    const response = await request('/delete-master-maker', { method: 'DELETE', params: deleteId });
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
    const response = await request('/master-maker-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      {showAdd ? (
        <CreateNewMaster
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Master Maker"
          data={data}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
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
            tableName: 'master_makers',
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

export default MasterMaker;
