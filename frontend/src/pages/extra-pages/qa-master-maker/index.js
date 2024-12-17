import { useMemo, useState, useEffect, useCallback } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useProjects } from '../project/useProjects';
import CreateNewQAMaster from './create-new-qa-master';
import { useQAMasterMaker } from './useQAMasterMaker';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import { getDropdownProjects, getMasterMakerQAs, getQAMasterMakerHistory } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const ProjectMasterMaker = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMeterType, setSelectedMeterType] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [meterTypeData, setMeterTypeData] = useState([]);
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

  useEffect(() => {
    if (record?.id) {
      dispatch(getQAMasterMakerHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  const getMasterMakerLovDataByMasterId = useCallback(async (masterId) => {
    const response = await request('/master-maker-lovs-list', {
      method: 'GET',
      query: {
        masterId,
        forDropdown: '1'
      }
    });
    if (response.success) {
      return response?.data?.data?.rows;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    if (error) toast(error);
  }, []);

  const getDropdownDetails = useCallback(async () => {
    let meterType = await getMasterMakerLovDataByMasterId('0eba82dc-29af-4694-b943-af7d86fc686f');
    setMeterTypeData(meterType);
  }, [getMasterMakerLovDataByMasterId]);

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

    getDropdownDetails();

    selectedProject &&
      selectedMeterType &&
      dispatch(
        getMasterMakerQAs({
          pageIndex,
          pageSize,
          listType,
          projectId: selectedProject,
          meterTypeId: selectedMeterType,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          sortBy: sort?.[0],
          sortOrder: sort?.[1],
          filterObject: filterObjectForApi
        })
      );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    listType,
    selectedProject,
    selectedMeterType,
    forceUpdate,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    getDropdownDetails
  ]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { masterMakerQAs, qaMasterMakerHistory } = useQAMasterMaker();
  const { data, count } = useMemo(
    () => ({
      data: masterMakerQAs.qaMasterMakerObject?.rows || [],
      count: masterMakerQAs.qaMasterMakerObject?.count || 0,
      isLoading: masterMakerQAs.loading || false
    }),
    [masterMakerQAs]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: qaMasterMakerHistory.qaMasterMakerHistoryObject?.rows || [],
      historyCounts: qaMasterMakerHistory.qaMasterMakerHistoryObject?.count || 0,
      isLoading: qaMasterMakerHistory.loading || false
    }),
    [qaMasterMakerHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Master ID',
        accessor: 'id',
        filterProps: {
          tableName: 'qa_master_makers',
          getColumn: 'id',
          customAccessor: 'masterId',
          projectId: selectedProject
        }
      },
      {
        Header: 'Master Name',
        accessor: 'name',
        filterProps: {
          tableName: 'qa_master_makers',
          getColumn: 'name',
          customAccessor: 'name',
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
          tableName: 'qa_master_makers',
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
          tableName: 'qa_master_makers',
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

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const handleRowRestore = async (value) => {
    setRestoreRow(value);
    setOpenRestoreModal(true);
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
    const response = await request(`/delete-qa-master-maker`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/qa-master-maker-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewQAMaster
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        setRefresh={setRefresh}
        projectData={projectData}
        meterTypeData={meterTypeData || []}
        setSelectedMeterType={setSelectedMeterType}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedProject && selectedMeterType && (
        <TableForm
          hideAddButton
          data={data}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handleRowDelete={handleRowDelete}
          handleRowRestore={handleRowRestore}
          handleRowUpdate={handleRowUpdate}
          handleRowHistory={handleRowHistory}
          handleRowView={handleRowView}
          listType={listType}
          setListType={setListTypeData}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: 'qa_master_makers',
            fileName: 'qa-master',
            apiQuery: { listType, projectId: selectedProject, meterTypeId: selectedMeterType, filterObject: filterObjectForApi }
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

export default ProjectMasterMaker;
