import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getDropdownProjects, getNetworkHistory, getNetworkProjects } from '../../../store/actions';
import { useProjects } from '../project/useProjects';
import CreateNewNetwork from './create-new-network';
import { useNetworks } from './useNetworks';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const defaultSort = ['rank', 'ASC'];

const Network = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

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
  const [sort, setSort] = useState(defaultSort);
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getNetworkHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
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

    if (selectedProject) {
      dispatch(
        getNetworkProjects({
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

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { networkProjects, networkHistory } = useNetworks();
  const { data, count } = useMemo(
    () => ({
      data: networkProjects.networkProjectsObject?.rows || [],
      count: networkProjects.networkProjectsObject?.count || 0,
      isLoading: networkProjects.loading || false
    }),
    [networkProjects]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: networkHistory.networkHistoryObject?.rows || [],
      historyCounts: networkHistory.networkHistoryObject?.count || 0,
      isLoading: networkHistory.loading || false
    }),
    [networkHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Level ID',
        accessor: 'id',
        filterProps: {
          tableName: 'networkLevel',
          getColumn: 'id',
          customAccessor: 'id',
          projectId: selectedProject
        }
      },
      {
        Header: 'Level Name',
        accessor: 'name',
        filterProps: {
          tableName: 'networkLevel',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject
        }
      },
      {
        Header: 'Level Code',
        accessor: 'code',
        filterProps: {
          tableName: 'networkLevel',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject
        }
      },
      {
        Header: 'Rank',
        accessor: 'rank',
        filterProps: {
          tableName: 'networkLevel',
          getColumn: 'rank',
          customAccessor: 'rank',
          projectId: selectedProject
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
          tableName: 'networkLevel',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject
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
          tableName: 'networkLevel',
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
    if (row.levelType === 'gaa') {
      toast('Update action is not allowed for GAA mapping level.', { variant: 'warning' });
      return;
    }
    setUpdate(true);
    setView(false);
    setRowData(row);
  };
  const handleRowView = (row) => {
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-network-hierarchies`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/network-hierarchies-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewNetwork
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
          hideDeleteIcon
          hideRestoreIcon
          hideAddButton
          hideType
          hideSearch
          hideImportButton
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
          sortConfig={{ sort, setSort, defaultSort }}
          exportConfig={{
            tableName: 'network_hierarchies',
            fileName: 'network-level',
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
export default Network;
