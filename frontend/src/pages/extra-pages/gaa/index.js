import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getGAAHistory, getGaaProjects } from '../../../store/actions';
import { getDropdownProjects } from '../../../store/actions';
import { useProjects } from '../project/useProjects';
import CreateNewGAA from './create-new-gaa';
import { useGaa } from './useGaa';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const Gaa = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState('');
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

    if (selectedProject) {
      dispatch(
        getGaaProjects({
          pageIndex,
          pageSize,
          listType,
          projectId: selectedProject,
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
    selectedProject,
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
    if (record?.id) {
      dispatch(getGAAHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { gaaProjects, gaaHistory } = useGaa();
  const { data, count } = useMemo(
    () => ({
      data: gaaProjects.gaaProjectsObject?.rows || [],
      count: gaaProjects.gaaProjectsObject?.count || 0,
      isLoading: gaaProjects.loading || false
    }),
    [gaaProjects]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: gaaHistory.gaaHistoryObject?.rows || [],
      historyCounts: gaaHistory.gaaHistoryObject?.count || 0,
      isLoading: gaaHistory.loading || false
    }),
    [gaaHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Level ID',
        accessor: 'id',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'id',
          customAccessor: 'id',
          projectId: selectedProject
        }
      },
      {
        Header: 'Level Name',
        accessor: 'name',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject
        }
      },
      {
        Header: 'Level Code',
        accessor: 'code',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject
        }
      },
      {
        Header: 'Rank',
        accessor: 'rank',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'rank',
          customAccessor: 'rank',
          projectId: selectedProject
        }
      },
      {
        Header: 'Mapping',
        accessor: (item) => (item.isMapped == 0 ? '-' : 'Yes'),
        exportAccessor: 'isMapped'
      },
      {
        Header: 'Updated On',
        accessor: 'updatedAt'
      },
      {
        Header: 'Updated By',
        accessor: 'updated.name',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject
        }
      },
      {
        Header: 'Created On',
        accessor: 'createdAt',
        projectId: selectedProject
      },
      {
        Header: 'Created By',
        accessor: 'created.name',
        filterProps: {
          tableName: 'gaaLevel',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          projectId: selectedProject
        }
      }
    ],
    [selectedProject]
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

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleRowView = (row) => {
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-gaa-hierarchies`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/gaa-hierarchies-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewGAA
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setRefresh={setRefresh}
        projectData={projectData}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedProject && (
        <TableForm
          hideAddButton
          hideRestoreIcon
          hideDeleteIcon
          hideType
          hideSearch
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
          sortConfig={{ sort, setSort, defaultSort: ['rank', 'ASC'] }}
          exportConfig={{
            tableName: 'gaa_hierarchies',
            fileName: 'gaa-level',
            apiQuery: { listType, projectId: selectedProject, filterObject: filterObjectForApi }
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

export default Gaa;
