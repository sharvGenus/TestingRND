import { useMemo, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getMasterMakersLovsList, getProjectMasterMakerLovHistory } from '../../../store/actions/projectMasterMakerLovAction';
import { useProjectMasterMaker } from '../project-master-maker/useProjectMasterMaker';
import { useProjects } from '../project/useProjects';
import CreateNewProjectMasterLOV from './create-new-project-master-lov';
import { useProjectMasterMakerLov } from './useProjectMasterMakerLov';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import { getDropdownProjects, getMasterMakerProjects } from 'store/actions';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const ProjectMasterMakerLov = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedProjectMaster, setSelectedProjectMaster] = useState('');
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

  useEffect(() => {
    if (record?.id) {
      dispatch(getProjectMasterMakerLovHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  useEffect(() => {
    dispatch(
      getMasterMakerProjects({
        selectedProject: selectedProject
      })
    );
  }, [dispatch, selectedProject]);

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
      getMasterMakersLovsList({
        pageIndex,
        pageSize,
        listType,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0],
        sortOrder: sort?.[1],
        selectedProjectMaster,
        filterObject: filterObjectForApi
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    listType,
    selectedProjectMaster,
    forceUpdate,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { masterMakerProjects } = useProjectMasterMaker();
  const projectMastersData = masterMakerProjects?.masterMakerProjectsObject?.rows || [];

  const { masterMakersLovsList, projectMasterMakerLovHistory } = useProjectMasterMakerLov();
  const { data, count } = useMemo(
    () => ({
      data: masterMakersLovsList.projectMasterMakersListObject?.rows || [],
      count: masterMakersLovsList.projectMasterMakersListObject?.count || 0,
      isLoading: masterMakersLovsList.loading || false
    }),
    [masterMakersLovsList]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: projectMasterMakerLovHistory.projectMasterMakerLovHistoryObject?.rows || [],
      historyCounts: projectMasterMakerLovHistory.projectMasterMakerLovHistoryObject?.count || 0,
      isLoading: projectMasterMakerLovHistory.loading || false
    }),
    [projectMasterMakerLovHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Master Name',
        accessor: 'project_master_maker.name'
      },
      {
        Header: 'LOV Name',
        accessor: 'name',
        filterProps: {
          tableName: 'project_master_maker_lovs',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject,
          masterId: selectedProjectMaster
        }
      },
      {
        Header: 'LOV Code',
        accessor: 'code',
        filterProps: {
          tableName: 'project_master_maker_lovs',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject,
          masterId: selectedProjectMaster
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
        filterProps: {
          tableName: 'project_master_maker_lovs',
          getColumn: 'description',
          customAccessor: 'description',
          projectId: selectedProject,
          masterId: selectedProjectMaster
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
          tableName: 'project_master_maker_lovs',
          getColumn: 'updated_by',
          customAccessor: 'updatedBy',
          projectId: selectedProject,
          masterId: selectedProjectMaster
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
          tableName: 'project_master_maker_lovs',
          getColumn: 'created_by',
          customAccessor: 'createdBy',
          projectId: selectedProject,
          masterId: selectedProjectMaster
        }
      }
    ],
    [selectedProject, selectedProjectMaster]
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
    setSelectedProject(projectData[0].id);
    setSelectedProjectMaster(row.masterId);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleRowUpdate = (row) => {
    setSelectedProject(projectData[0].id);
    setSelectedProjectMaster(row.masterId);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-project-master-maker-lov`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/project-master-maker-lov-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewProjectMasterLOV
        refreshPagination={refreshPagination}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedProjectMaster={selectedProjectMaster}
        setSelectedProjectMaster={setSelectedProjectMaster}
        setRefresh={setRefresh}
        projectData={projectData}
        projectMastersData={projectMastersData}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
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
            tableName: 'project_master_maker_lovs',
            projectMasterMakerLov: { projectId: selectedProject, masterId: selectedProjectMaster }
          }
        }}
        exportConfig={{
          tableName: 'project_master_maker_lovs',
          fileName: 'project-master-lov',
          apiQuery: { listType, masterId: selectedProjectMaster, filterObject: filterObjectForApi }
        }}
      />
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

export default ProjectMasterMakerLov;
