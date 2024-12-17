import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getRuralLevelEntryHistory, getRuralLevelProjects } from '../../../store/actions';
import { getDropdownProjects } from '../../../store/actions';
import { useProjects } from '../project/useProjects';
import RuralLevelEntryForm from '../rural-level-entry/rural-entry-form';
import { useRural } from '../rural/useRural';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import usePrevious from 'hooks/usePrevious';
import { useFilterContext } from 'contexts/FilterContext';
import { hasChanged } from 'utils';
import useAuth from 'hooks/useAuth';

const RuralLevelEntry = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [selectedRuralId, setSelectedRuralId] = useState('');
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
  const [selectedProject, setSelectedProject] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    dispatch(getDropdownProjects());
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

    if (selectedRuralId) {
      dispatch(
        getRuralLevelProjects({
          pageIndex,
          pageSize,
          listType,
          ruralId: selectedRuralId,
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
    selectedRuralId,
    forceUpdate,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    refreshPagination
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getRuralLevelEntryHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { ruralLevelProjects, ruralLevelEntryHistory } = useRural();

  const { ruralLevelData, ruralCount } = useMemo(
    () => ({
      ruralLevelData: ruralLevelProjects.ruralLevelProjectsObject?.rows || [],
      ruralCount: ruralLevelProjects.ruralLevelProjectsObject?.count || 0,
      isLoading: ruralLevelProjects.loading || false
    }),
    [ruralLevelProjects]
  );

  const { historyLevelEntryData, historyLevelEntryCounts } = useMemo(
    () => ({
      historyLevelEntryData: ruralLevelEntryHistory.ruralLevelEntryHistoryObject?.rows || [],
      historyLevelEntryCounts: ruralLevelEntryHistory.ruralLevelEntryHistoryObject?.count || 0,
      isLoading: ruralLevelEntryHistory.loading || false
    }),
    [ruralLevelEntryHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Entry ID',
        accessor: 'id',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'id',
          customAccessor: 'id',
          projectId: selectedProject,
          levelId: selectedRuralId
        }
      },
      {
        Header: 'Entry Name',
        accessor: 'name',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject,
          levelId: selectedRuralId
        }
      },
      {
        Header: 'Entry Code',
        accessor: 'code',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject,
          levelId: selectedRuralId
        }
      },
      {
        Header: 'Parent ID',
        accessor: (data) => data.parent?.id,
        exportAccessor: 'parent.id',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'parent_id',
          customAccessor: 'parentId',
          projectId: selectedProject,
          levelId: selectedRuralId
        }
      },
      {
        Header: 'Parent Name',
        accessor: (data) => data.parent?.name,
        exportAccessor: 'parent.name',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'name',
          customAccessor: 'parentName',
          projectId: selectedProject,
          levelId: selectedParentId
        }
      },
      {
        Header: 'Approval Status',
        accessor: 'approvalStatus',
        exportAccessor: 'approval_status',
        filterProps: {
          tableName: 'ruralEntry',
          getColumn: 'approval_status',
          customAccessor: 'approvalStatus',
          projectId: selectedProject,
          levelId: selectedRuralId
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
          tableName: 'ruralEntry',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject,
          levelId: selectedRuralId
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
          tableName: 'ruralEntry',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          projectId: selectedProject,
          levelId: selectedRuralId
        }
      }
    ],
    [selectedRuralId, selectedProject, selectedParentId]
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

  const handleLevelRowView = (row) => {
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleLevelRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const confirmLevelDelete = async () => {
    const response = await request(`/delete-rural-level-entry`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/rural-level-entry-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <RuralLevelEntryForm
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setSelectedRuralId={setSelectedRuralId}
        setSelectedParentId={setSelectedParentId}
        projectData={projectData}
        setRefresh={setRefresh}
        user={user}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedRuralId && (
        <TableForm
          hideAddButton
          hideImportButton={false}
          data={ruralLevelData}
          columns={columns}
          count={ruralCount}
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
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          importConfig={{
            apiBody: { projectId: selectedProject, levelId: selectedRuralId, parentId: selectedParentId, tableName: 'urban_level_entries' }
          }}
          exportConfig={{
            tableName: 'rural_level_entries',
            fileName: 'rural-level-entry',
            apiQuery: { listType, urbanId: selectedRuralId, filterObject: filterObjectForApi }
          }}
          setSelectedParentId={setSelectedParentId}
          disableDeleteIcon={
            user?.id === '577b8900-b333-42d0-b7fb-347abc3f0b5c' || user?.id === '57436bed-c176-4625-96af-aaeec88cdc90' ? false : true
          }
          componentFrom={'rural-level-entry'}
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

export default RuralLevelEntry;
