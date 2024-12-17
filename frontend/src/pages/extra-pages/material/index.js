import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getMaterial, getMaterialHistory } from '../../../store/actions';
import CreateNewMaterial from './create-new-material';
import { useMaterial } from './useMaterial';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const Material = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

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
      getMaterial({
        pageIndex,
        pageSize,
        listType,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0],
        sortOrder: sort?.[1],
        filterObject: filterObjectForApi
      })
    );
  }, [
    accessorsRef,
    dispatch,
    listType,
    pageIndex,
    pageSize,
    searchStringTrimmed,
    sort,
    forceUpdate,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getMaterialHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const { material, materialHistory } = useMaterial();
  const { data, count } = useMemo(
    () => ({
      data: material.materialObject?.rows?.map((item) => ({ ...item, isSerialNumberText: item.isSerialNumber ? 'Yes' : 'No' })) || [],
      count: material.materialObject?.count || 0,
      isLoading: material.loading || false
    }),
    [material]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: materialHistory.materialHistoryObject?.rows || [],
      historyCounts: materialHistory.materialHistoryObject?.count || 0,
      isLoading: materialHistory.loading || false
    }),
    [materialHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Material Type',
        accessor: 'material_type.name',
        filterProps: {
          tableName: 'master_maker_lovs',
          getColumn: 'name',
          customAccessor: 'materialType'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'materials',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'materials',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'materials',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
        filterProps: {
          tableName: 'materials',
          getColumn: 'description',
          customAccessor: 'description'
        }
      },
      {
        Header: 'Long Description',
        accessor: 'longDescription',
        filterProps: {
          tableName: 'materials',
          getColumn: 'long_description',
          customAccessor: 'longDescription'
        }
      },
      {
        Header: 'UOM',
        accessor: 'material_uom.name',
        filterProps: {
          tableName: 'organisationType',
          getColumn: 'name',
          customAccessor: 'uom'
        }
      },
      {
        Header: 'HSN Code',
        accessor: 'hsnCode',
        filterProps: {
          tableName: 'materials',
          getColumn: 'hsn_code',
          customAccessor: 'hsnCode'
        }
      },
      {
        Header: 'Is Serialized',
        accessor: 'isSerialNumberText',
        filterProps: {
          tableName: 'materials',
          getColumn: 'is_serial_number',
          customAccessor: 'isSerialised'
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'materials',
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
    setView(false);
    setListType(1);
    setRowData(null);
    setUpdate(false);
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

  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const handleRowHistory = (row) => {
    setRecord(row);
    setOpenHistoryModal(true);
  };

  const confirmDelete = async () => {
    const response = await request('/delete-material', { method: 'DELETE', params: deleteId });
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
    const response = await request('/material-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      {showAdd ? (
        <CreateNewMaterial
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Material"
          data={data}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          columns={columns}
          onClick={onBack}
          handleRowView={handleRowView}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          handleRowRestore={handleRowRestore}
          listType={listType}
          setListType={setListTypeData}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: 'materials',
            apiQuery: { listType, filterObject: filterObjectForApi }
          }}
          handleRowHistory={handleRowHistory}
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

export default Material;
