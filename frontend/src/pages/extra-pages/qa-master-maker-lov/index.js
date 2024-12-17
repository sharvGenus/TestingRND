import { useMemo, useState, useEffect, useCallback } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useProjects } from '../project/useProjects';
import { useQAMasterMaker } from '../qa-master-maker/useQAMasterMaker';
import CreateNewQAMasterLOV from './create-new-qa-master-lov';
import { useQAMasterMakerLov } from './useQAMasterMakerLov';
import { getMasterMakerQAs, getQAMasterMakerLov, getQAMasterMakerLovHistory } from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import { getDropdownProjects } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const QAMasterMakerLov = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMeterType, setSelectedMeterType] = useState(null);
  const [selectedQAMaster, setSelectedQAMaster] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [meterTypeData, setMeterTypeData] = useState([]);
  const [observationTypeData, setObservationTypeData] = useState([]);
  const [observationSeverityData, setObservationSeverityData] = useState([]);
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
      dispatch(getQAMasterMakerLovHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  useEffect(() => {
    selectedProject &&
      selectedMeterType &&
      dispatch(
        getMasterMakerQAs({
          projectId: selectedProject,
          meterTypeId: selectedMeterType
        })
      );
  }, [selectedProject, selectedMeterType, dispatch]);

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
    let observeType = await getMasterMakerLovDataByMasterId('4a219c23-9458-410f-a56e-85d7eb7dc4fe');
    setObservationTypeData(observeType);
    let severityType = await getMasterMakerLovDataByMasterId('0d6f899e-443d-46d6-a855-d609da7d2bd8');
    setObservationSeverityData(severityType);
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
      selectedQAMaster &&
      dispatch(
        getQAMasterMakerLov({
          pageIndex,
          pageSize,
          listType,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          sortBy: sort?.[0],
          sortOrder: sort?.[1],
          selectedQAMaster,
          filterObject: filterObjectForApi
        })
      );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    listType,
    selectedQAMaster,
    forceUpdate,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort,
    selectedProject,
    selectedMeterType,
    getDropdownDetails
  ]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const { masterMakerQAs } = useQAMasterMaker();
  const qaMastersData = masterMakerQAs?.qaMasterMakerObject?.rows || [];

  const { qaMasterMakerLovs, qaMasterMakerLovHistory } = useQAMasterMakerLov();
  const { data, count } = useMemo(
    () => ({
      data: qaMasterMakerLovs.qaMasterMakerLovsObject?.rows || [],
      count: qaMasterMakerLovs.qaMasterMakerLovsObject?.count || 0,
      isLoading: qaMasterMakerLovs.loading || false
    }),
    [qaMasterMakerLovs]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: qaMasterMakerLovHistory.qaMasterMakerLovHistoryObject?.rows || [],
      historyCounts: qaMasterMakerLovHistory.qaMasterMakerLovHistoryObject?.count || 0,
      isLoading: qaMasterMakerLovHistory.loading || false
    }),
    [qaMasterMakerLovHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Master Name',
        accessor: 'qa_master_maker.name'
      },
      {
        Header: 'Major Contributor',
        accessor: 'majorContributor',
        filterProps: {
          tableName: 'qa_master_maker_lovs',
          getColumn: 'major_contributor',
          customAccessor: 'majorContributor',
          // projectId: selectedProject,
          masterId: selectedQAMaster
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'qa_master_maker_lovs',
          getColumn: 'code',
          customAccessor: 'code',
          // projectId: selectedProject,
          masterId: selectedQAMaster
        }
      },
      {
        Header: 'Priority',
        accessor: 'priority',
        filterProps: {
          tableName: 'qa_master_maker_lovs',
          getColumn: 'priority',
          customAccessor: 'priority',
          // projectId: selectedProject,
          masterId: selectedQAMaster
        }
      },
      {
        Header: 'Defect',
        accessor: 'defect',
        filterProps: {
          tableName: 'qa_master_maker_lovs',
          getColumn: 'defect',
          customAccessor: 'defect',
          // projectId: selectedProject,
          masterId: selectedQAMaster
        }
      },
      {
        Header: 'Observation Type',
        accessor: 'observation_type.name',
        filterProps: {
          tableName: 'master_maker_lovs',
          getColumn: 'name',
          customAccessor: 'observationType'
          // projectId: selectedProject,
          // masterId: selectedQAMaster
        }
      },
      {
        Header: 'Observation Severity',
        accessor: 'observation_severity.name',
        filterProps: {
          tableName: 'master_maker_lovs',
          getColumn: 'name',
          customAccessor: 'observationSeverity'
          // projectId: selectedProject,
          // masterId: selectedQAMaster
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
          tableName: 'qa_master_maker_lovs',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          // projectId: selectedProject,
          masterId: selectedQAMaster
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
          tableName: 'qa_master_maker_lovs',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          // projectId: selectedProject,
          masterId: selectedQAMaster
        }
      }
    ],
    [selectedQAMaster]
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

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-qa-master-maker-lov`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/qa-master-maker-lov-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  useEffect(() => {
    // setSelectedMeterType('');
    setSelectedQAMaster('');
  }, [selectedProject]);

  useEffect(() => {
    setSelectedQAMaster('');
  }, [selectedMeterType]);

  return (
    <>
      <CreateNewQAMasterLOV
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedMeterType={selectedMeterType}
        setSelectedMeterType={setSelectedMeterType}
        selectedQAMaster={selectedQAMaster}
        setSelectedQAMaster={setSelectedQAMaster}
        setRefresh={setRefresh}
        projectData={projectData}
        meterTypeData={meterTypeData || []}
        qaMastersData={qaMastersData}
        observationTypeData={observationTypeData || []}
        observationSeverityData={observationSeverityData || []}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      {selectedProject && selectedMeterType && selectedQAMaster && (
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
          hideImportButton={false}
          listType={listType}
          setListType={setListTypeData}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          importConfig={{
            apiBody: {
              tableName: 'qa_master_maker_lovs'
              // masterId: selectedQAMaster
            }
          }}
          exportConfig={{
            tableName: 'qa_master_maker_lovs',
            fileName: 'qa-master-lov',
            apiQuery: { listType, masterId: selectedQAMaster, filterObject: filterObjectForApi }
          }}
          importQA
          importCompeted={refreshPagination}
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

export default QAMasterMakerLov;
