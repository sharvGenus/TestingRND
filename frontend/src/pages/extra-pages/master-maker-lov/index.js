import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getMasterMakerLovHistory, getMasterMakerLovList } from '../../../store/actions/masterMakerLovAction';
import CreateNewMasterLOV from './create-new-master-lov';
import { useMasterMakerLov } from './useMasterMakerLov';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
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
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

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
      getMasterMakerLovList({
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
      dispatch(getMasterMakerLovHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, forceUpdate, record]);

  const { masterMakerLovsList, masterMakerLovHistory } = useMasterMakerLov();
  const { data, count } = useMemo(
    () => ({
      data: masterMakerLovsList?.masterMakerLovsObject?.rows || [],
      count: masterMakerLovsList?.masterMakerLovsObject?.count || 0,
      isLoading: masterMakerLovsList.loading || false
    }),
    [masterMakerLovsList]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: masterMakerLovHistory.masterMakerLovHistoryObject?.rows || [],
      historyCounts: masterMakerLovHistory.masterMakerLovHistoryObject?.count || 0,
      isLoading: masterMakerLovHistory.loading || false
    }),
    [masterMakerLovHistory]
  );
  const columns = useMemo(
    () => [
      {
        Header: 'Master',
        accessor: 'master_maker.name',
        filterProps: {
          tableName: 'master_makers',
          getColumn: 'name',
          customAccessor: 'masterName'
        }
      },
      {
        Header: 'LOV',
        accessor: 'name',
        filterProps: {
          tableName: 'master_maker_lovs',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'master_maker_lovs',
          getColumn: 'code',
          customAccessor: 'code'
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
    const response = await request('/delete-master-maker-lov', { method: 'DELETE', params: deleteId });
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
    const response = await request('/master-maker-lov-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };
  return (
    <>
      {showAdd ? (
        <CreateNewMasterLOV
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Master Maker LOV"
          data={data}
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
            tableName: 'master_maker_lovs',
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
