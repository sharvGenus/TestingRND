import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { getCities, getCitiesHistory } from '../../../store/actions';
import CreateNewCity from './create-new-city';
import { useCities } from './useCities';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const City = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, forceSearch, accessorsRef, setAccessors, setSearchString, searchStringTrimmed } = useSearch();

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
      getCities({
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
    dispatch,
    pageIndex,
    pageSize,
    listType,
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
      dispatch(getCitiesHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, forceUpdate, listType, record]);

  const { cities, citiesHistory } = useCities();
  const { data, count } = useMemo(
    () => ({
      data: cities.citiesObject?.rows || [],
      count: cities.citiesObject?.count || 0,
      isLoading: cities.loading || false
    }),
    [cities]
  );
  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: citiesHistory.citiesHistoryObject?.rows || [],
      historyCounts: citiesHistory.citiesHistoryObject?.count || 0,
      isLoading: citiesHistory.loading || false
    }),
    [citiesHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Country Name',
        accessor: 'state.country.name',
        filterProps: {
          tableName: 'countries',
          getColumn: 'name',
          customAccessor: 'countryId'
        }
      },
      {
        Header: 'State Name',
        accessor: 'state.name',
        filterProps: {
          tableName: 'states',
          getColumn: 'name',
          customAccessor: 'stateId'
        }
      },
      {
        Header: 'City Name',
        accessor: 'name',
        filterProps: {
          tableName: 'cities',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'cities',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'states',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
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
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'updatedBy'
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
          tableName: 'users',
          getColumn: 'name',
          customAccessor: 'createdBy'
        }
      }
    ],
    []
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
    const response = await request(`/delete-city`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/city-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  return (
    <>
      <CreateNewCity
        refreshPagination={refreshPagination}
        setRefresh={setRefresh}
        {...(rowData && { data: rowData })}
        {...(view && { view: view, update: false })}
        {...(update && { update: update, view: false })}
      />
      <TableForm
        title="City"
        hideAddButton
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
        sortConfig={{ sort, setSort }}
        exportConfig={{
          tableName: 'cities',
          apiQuery: { listType, filterObject: filterObjectForApi }
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

export default City;
