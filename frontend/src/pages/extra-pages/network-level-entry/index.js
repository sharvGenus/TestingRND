import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getDropdownProjects, getNetworkLevelEntryHistory, getNetworkLevelProjects } from '../../../store/actions';
import { useProjects } from '../project/useProjects';
import NetworkEntryForm from '../network-level-entry/network-entry-form';
import { useNetworks } from '../network/useNetworks';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';
import useAuth from 'hooks/useAuth';

const NetworkLevelEntry = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [selectedNetworkId, setSelectedNetworkId] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
  const [selectedParent, setSelectedParent] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useAuth();

  const { searchString, forceSearch, accessorsRef, setAccessors, setSearchString, searchStringTrimmed } = useSearch();

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getNetworkLevelEntryHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

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

    if (selectedNetworkId) {
      dispatch(
        getNetworkLevelProjects({
          pageIndex,
          pageSize,
          listType,
          networkId: selectedNetworkId,
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
    selectedNetworkId,
    forceUpdate,
    sort,
    searchStringTrimmed,
    accessorsRef,
    forceSearch,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    refreshPagination
  ]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { networkLevelProjects, networkLevelEntryHistory } = useNetworks();

  const { networkLevelData, networkCount } = useMemo(
    () => ({
      networkLevelData: networkLevelProjects.networkLevelProjectsObject?.rows || [],
      networkCount: networkLevelProjects.networkLevelProjectsObject?.count || 0,
      isLoading: networkLevelProjects.loading || false
    }),
    [networkLevelProjects]
  );

  const { historyLevelEntryData, historyLevelEntryCounts } = useMemo(
    () => ({
      historyLevelEntryData: networkLevelEntryHistory.networkLevelEntryHistoryObject?.rows || [],
      historyLevelEntryCounts: networkLevelEntryHistory.networkLevelEntryHistoryObject?.count || 0,
      isLoading: networkLevelEntryHistory.loading || false
    }),
    [networkLevelEntryHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Entry ID',
        accessor: 'id',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'id',
          customAccessor: 'id',
          projectId: selectedProject,
          levelId: selectedNetworkId
        }
      },
      {
        Header: 'Entry Name',
        accessor: 'name',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject,
          levelId: selectedNetworkId
        }
      },
      {
        Header: 'Entry Code',
        accessor: 'code',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject,
          levelId: selectedNetworkId
        }
      },
      {
        Header: 'Parent ID',
        accessor: (data) => data.parent?.id,
        exportAccessor: 'parent.id',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'parent_id',
          customAccessor: 'parentId',
          projectId: selectedProject,
          levelId: selectedNetworkId
        }
      },
      {
        Header: 'Parent Name',
        accessor: (data) => data.parent?.name,
        exportAccessor: 'parent.name',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'name',
          customAccessor: 'parentName',
          projectId: selectedProject,
          levelId: selectedParentId
        }
      },
      {
        Header: 'Status',
        accessor: 'approvalStatus',
        exportAccessor: 'approval_status',
        filterProps: {
          tableName: 'networkEntry',
          getColumn: 'approval_status',
          customAccessor: 'approvalStatus',
          projectId: selectedProject,
          levelId: selectedNetworkId
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
          tableName: 'networkEntry',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject,
          levelId: selectedNetworkId
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
          tableName: 'networkEntry',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          projectId: selectedProject,
          levelId: selectedNetworkId
        }
      }
    ],
    [selectedNetworkId, selectedProject, selectedParentId]
  );

  const setRefresh = () => {
    setView(false);
    setUpdate(false);
    setRowData(null);
  };

  const setListTypeData = (value) => {
    setListType(value);
    setRefresh();
  };

  const handleLevelRowDelete = async (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleLevelRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const handleLevelRowUpdate = (row) => {
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleLevelRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleLevelRowView = (row) => {
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const confirmLevelDelete = async () => {
    const response = await request(`/delete-network-level-entry`, { method: 'DELETE', params: deleteId });
    if (response.success) {
      refreshPagination();
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  const confirmLevelRestore = async () => {
    const updatedValues = {
      ...restoreRow,
      isActive: '1'
    };
    const response = await request('/network-level-entry-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <NetworkEntryForm
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setSelectedNetworkId={setSelectedNetworkId}
        selectedParentId={selectedParentId}
        selectedNetworkId={selectedNetworkId}
        setRefresh={setRefresh}
        selectedParent={selectedParent}
        setSelectedParent={setSelectedParent}
        setSelectedParentId={setSelectedParentId}
        projectData={projectData}
        user={user}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedNetworkId && (
        <TableForm
          hideAddButton
          hideImportButton={false}
          data={networkLevelData}
          columns={columns}
          count={networkCount}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handleRowRestore={handleLevelRowRestore}
          handleRowDelete={handleLevelRowDelete}
          handleRowUpdate={handleLevelRowUpdate}
          handleRowHistory={handleLevelRowHistory}
          handleRowView={handleLevelRowView}
          listType={listType}
          setListType={setListTypeData}
          sortConfig={{ sort, setSort }}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          importConfig={{
            apiBody: { projectId: selectedProject, levelId: selectedNetworkId, parentId: selectedParentId, tableName: 'gaa_level_entries' }
          }}
          setSelectedParentId={setSelectedParentId}
          exportConfig={{
            tableName: 'network_level_entries',
            fileName: 'network-level-entry',
            apiQuery: { listType, networkId: selectedNetworkId, filterObject: filterObjectForApi }
          }}
          disableDeleteIcon={
            user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90' ? false : true
          }
          componentFrom={'network-level-entry'}
        />
      )}
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmLevelDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      <ConfirmModal
        open={openRestoreModal}
        handleClose={() => setOpenRestoreModal(false)}
        handleConfirm={confirmLevelRestore}
        title="Confirm Restore"
        message="Are you sure you want to restore?"
        confirmBtnTitle="Restore"
      />
      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} scroll="paper" disableEscapeKeyDown maxWidth="lg">
        <TableForm
          isHistory
          title={record?.name}
          data={historyLevelEntryData}
          columns={columns}
          count={historyLevelEntryCounts}
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

export default NetworkLevelEntry;
