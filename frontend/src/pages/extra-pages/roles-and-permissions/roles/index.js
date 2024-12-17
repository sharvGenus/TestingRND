import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getDropdownProjects, getRoleProjects, getRolesHistory } from '../../../../store/actions';
import { useProjects } from '../../project/useProjects';
import { useRoles } from '../useRoles';
import CreateNewRole from './create-new-role';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const Role = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreRow, setRestoreRow] = useState(null);
  const [listType, setListType] = useState(1);
  const [selectedProject, setSelectedProject] = useState('');
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getRolesHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
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

    dispatch(
      getRoleProjects({
        pageIndex,
        pageSize,
        listType,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0],
        sortOrder: sort?.[1],
        filterObject: filterObjectForApi,
        selectedProject
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    listType,
    selectedProject,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceUpdate,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { roleProjects, rolesHistory } = useRoles();
  const { data, count } = useMemo(
    () => ({
      data: roleProjects.roleProjectsObject?.rows || [],
      count: roleProjects.roleProjectsObject?.count || 0,
      isLoading: roleProjects.loading || false
    }),
    [roleProjects]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: rolesHistory.rolesHistoryObject?.rows || [],
      historyCounts: rolesHistory.rolesHistoryObject?.count || 0,
      isLoading: rolesHistory.loading || false
    }),
    [rolesHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Role Name',
        accessor: 'name',
        filterProps: {
          tableName: 'roles',
          getColumn: 'name',
          customAccessor: 'name',
          projectId: selectedProject
        }
      },
      {
        Header: 'Ticket Creator',
        accessor: 'addTicket',
        skipSearch: true,
        Cell: (list) => <input type="radio" checked={list.row.original['addTicket']} />
      },
      {
        Header: 'Ticket Resolver',
        accessor: 'forTicket',
        skipSearch: true,
        Cell: (list) => <input type="radio" checked={list.row.original['forTicket']} />
      },
      {
        Header: 'Import',
        accessor: 'isImport',
        skipSearch: true,
        Cell: (list) => <input type="radio" checked={list.row.original['isImport']} />
      },
      {
        Header: 'Export',
        accessor: 'isExport',
        skipSearch: true,
        Cell: (list) => <input type="radio" checked={list.row.original['isExport']} />
      },
      {
        Header: 'Update',
        accessor: 'isUpdate',
        skipSearch: true,
        Cell: (list) => <input type="radio" checked={list.row.original['isUpdate']} />
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'roles',
          getColumn: 'code',
          customAccessor: 'code',
          projectId: selectedProject
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
        filterProps: {
          tableName: 'roles',
          getColumn: 'description',
          customAccessor: 'description',
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
          tableName: 'roles',
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
          tableName: 'roles',
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

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
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

  const confirmDelete = async () => {
    const response = await request(`/delete-role`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/role-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewRole
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
            tableName: 'roles',
            fileName: 'roles',
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

export default Role;
