import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog } from '@mui/material';
import { getProjects, getProjectsHistory } from '../../../store/actions/projectMasterAction';
import CreateNewProject from './create-new-project';
import { useProjects } from './useProjects';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { hasChanged } from 'utils';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import ImageCard from 'pages/form-configurator/responses/response-images';

const Project = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, forceSearch, accessorsRef, setAccessors, setSearchString, searchStringTrimmed } = useSearch();

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
  const [fileList, setFileList] = useState([]);
  const [openImage, setOpenImage] = useState(false);
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
      getProjects({
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
    listType,
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

  useEffect(() => {
    if (record?.id) {
      dispatch(getProjectsHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { projects, projectsHistory } = useProjects();
  const { data, count } = useMemo(
    () => ({
      data: projects.projectsObject?.rows || [],
      count: projects.projectsObject?.count || 0,
      isLoading: projects.loading || false
    }),
    [projects]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: projectsHistory.projectsHistoryObject?.rows || [],
      historyCounts: projectsHistory.projectsHistoryObject?.count || 0,
      isLoading: projectsHistory.loading || false
    }),
    [projectsHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Company',
        accessor: 'company.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'orgId'
        }
      },
      {
        Header: 'Customer Name',
        accessor: 'customer.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'customerOrgId'
        }
      },
      {
        Header: 'Project Name',
        accessor: 'name',
        filterProps: {
          tableName: 'projects',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Scheme Name',
        accessor: 'schemeName',
        filterProps: {
          tableName: 'projects',
          getColumn: 'scheme_name',
          customAccessor: 'schemeName'
        }
      },
      {
        Header: 'Project Code',
        accessor: 'code',
        filterProps: {
          tableName: 'projects',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'projects',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'PO/Work Order Number',
        accessor: 'poWorkOrderNumber',
        filterProps: {
          tableName: 'projects',
          getColumn: 'po_work_order_number',
          customAccessor: 'poNumber'
        }
      },
      {
        Header: 'PO Start Date',
        accessor: 'poStartDate'
      },
      {
        Header: 'Contract Signed Date',
        accessor: 'closureDate'
      },
      {
        Header: 'PO End Date',
        accessor: 'poEndDate'
      },
      {
        Header: 'PO Extension Date',
        accessor: 'poExtensionDate'
      },
      {
        Header: 'FMS Start Date',
        accessor: 'fmsStartDate'
      },
      {
        Header: 'FMS (Months)',
        accessor: 'fmsYears',
        filterProps: {
          tableName: 'projects',
          getColumn: 'fms_years',
          customAccessor: 'fmsYears'
        }
      },
      {
        Header: 'E-way Bill Limit',
        accessor: 'eWayBillLimit',
        filterProps: {
          tableName: 'projects',
          getColumn: 'e_way_bill_limit',
          customAccessor: 'eWayLimit'
        }
      },
      {
        Header: 'FMS End Date',
        accessor: 'fmsEndDate'
      },
      {
        Header: 'Logo One',
        accessor: 'logoOne'
      },
      {
        Header: 'Logo Two',
        accessor: 'logoTwo'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'projects',
          getColumn: 'remarks',
          customAccessor: 'remarks'
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
    setListType(1);
    setView(false);
    setUpdate(false);
    setRowData(null);
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

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const confirmDelete = async () => {
    const response = await request(`/delete-project`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/project-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  const updateColumnUtil = (columnArr = []) =>
    columnArr.map((item) => {
      let column = structuredClone(item);

      if (column.accessor === 'logoOne' || column.accessor === 'logoTwo') {
        return {
          ...column,
          Cell: (list) =>
            list?.row?.original?.[column.accessor]?.length &&
            (list?.row?.original?.logoOne.length > 0 || list?.row?.original?.logoTwo.length > 0) ? (
              <Button
                onClick={() => {
                  setOpenImage(true);
                  setFileList([`/project-logo?logoType=${column.accessor === 'logoOne' ? 'logo-one' : 'logo-two'}`]);
                }}
                size="small"
                variant="outlined"
                color="primary"
              >
                View
              </Button>
            ) : (
              <>{'-'}</>
            )
        };
      }
      return column;
    });

  return (
    <>
      {showAdd ? (
        <CreateNewProject
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <>
          <TableForm
            title="Project"
            data={data.map((projectDetails) => ({
              ...projectDetails,
              logoOne: JSON.parse(projectDetails.logoOne),
              logoTwo: JSON.parse(projectDetails.logoTwo)
            }))}
            columns={updateColumnUtil(columns)}
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onClick={onBack}
            handleRowRestore={handleRowRestore}
            handleRowDelete={handleRowDelete}
            handleRowUpdate={handleRowUpdate}
            handleRowHistory={handleRowHistory}
            handleRowView={handleRowView}
            listType={listType}
            setListType={setListTypeData}
            searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
            sortConfig={{ sort, setSort }}
            exportConfig={{
              tableName: 'projects',
              apiQuery: { listType, filterObject: filterObjectForApi }
            }}
          />
          <Dialog open={openImage} onClose={() => setOpenImage(false)} scroll="paper" disableEscapeKeyDown>
            <ImageCard imageList={fileList} />
          </Dialog>
        </>
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

export default Project;
