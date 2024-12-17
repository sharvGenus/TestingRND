import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getDropdownProjects, getUrbanLevelEntryHistory, getUrbanLevelProjects } from '../../../store/actions';
import { useProjects } from '../project/useProjects';
import { useUrbans } from '../urban/useUrbans';
import UrbanLevelEntryForm from './urban-entry-form';
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

const UrbanLevelEntry = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [selectedUrbanId, setSelectedUrbanId] = useState('');
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
      dispatch(getUrbanLevelEntryHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
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

    if (selectedUrbanId) {
      dispatch(
        getUrbanLevelProjects({
          pageIndex,
          pageSize,
          listType,
          urbanId: selectedUrbanId,
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
    selectedUrbanId,
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

  const { urbanLevelProjects, urbanLevelEntryHistory } = useUrbans();

  const { urbanLevelData, urbanCount } = useMemo(
    () => ({
      urbanLevelData: urbanLevelProjects.urbanLevelProjectsObject?.rows || [],
      urbanCount: urbanLevelProjects.urbanLevelProjectsObject?.count || 0,
      isLoading: urbanLevelProjects.loading || false
    }),
    [urbanLevelProjects]
  );

  const { historyLevelEntryData, historyLevelEntryCounts } = useMemo(
    () => ({
      historyLevelEntryData: urbanLevelEntryHistory.urbanLevelEntryHistoryObject?.rows || [],
      historyLevelEntryCounts: urbanLevelEntryHistory.urbanLevelEntryHistoryObject?.count || 0,
      isLoading: urbanLevelEntryHistory.loading || false
    }),
    [urbanLevelEntryHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Entry ID',
        accessor: 'id',
        filterProps: {
          tableName: 'urbanEntry',
          getColumn: 'id',
          customAccessor: 'id',
          projectId: selectedProject,
          levelId: selectedUrbanId
        }
      },
      {
        Header: 'Entry Name',
        accessor: 'name',
        filterProps: {
          tableName: 'urbanEntry',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject,
          levelId: selectedUrbanId
        }
      },
      {
        Header: 'Entry Code',
        accessor: 'code',
        filterProps: {
          tableName: 'urbanEntry',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject,
          levelId: selectedUrbanId
        }
      },
      {
        Header: 'Parent ID',
        accessor: (data) => data.parent?.id,
        exportAccessor: 'parent.id',
        filterProps: {
          tableName: 'urbanEntry',
          getColumn: 'parent_id',
          customAccessor: 'parentId',
          projectId: selectedProject,
          levelId: selectedUrbanId
        }
      },
      {
        Header: 'Parent Name',
        accessor: (data) => data.parent?.name,
        exportAccessor: 'parent.name',
        filterProps: {
          tableName: 'urbanEntry',
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
          tableName: 'urbanEntry',
          getColumn: 'approval_status',
          customAccessor: 'approvalStatus',
          projectId: selectedProject,
          levelId: selectedUrbanId
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
          tableName: 'urbanEntry',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject,
          levelId: selectedUrbanId
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
          tableName: 'urbanEntry',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          projectId: selectedProject,
          levelId: selectedUrbanId
        }
      }
    ],
    [selectedUrbanId, selectedProject, selectedParentId]
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
    const response = await request(`/delete-urban-level-entry`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/urban-level-entry-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <UrbanLevelEntryForm
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setSelectedUrbanId={setSelectedUrbanId}
        selectedParentId={selectedParentId}
        selectedUrbanId={selectedUrbanId}
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
      {selectedUrbanId && (
        <TableForm
          hideAddButton
          hideImportButton={false}
          data={urbanLevelData}
          columns={columns}
          count={urbanCount}
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
            apiBody: { projectId: selectedProject, levelId: selectedUrbanId, parentId: selectedParentId, tableName: 'urban_level_entries' }
          }}
          setSelectedParentId={setSelectedParentId}
          exportConfig={{
            tableName: 'urban_level_entries',
            fileName: 'urban-level-entry',
            apiQuery: { listType, urbanId: selectedUrbanId, filterObject: filterObjectForApi }
          }}
          disableDeleteIcon={
            user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90' ? false : true
          }
          componentFrom={'urban-level-entry'}
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

export default UrbanLevelEntry;
