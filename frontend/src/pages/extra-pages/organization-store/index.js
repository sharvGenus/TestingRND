import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CreateNewOrganizationStore from './create-new-organization-store';
import { useOrganizationStore } from './useOrganizationStore';
import TableForm from 'tables/table';
import { getOrganizationStores, getOrganizationStoresHistory } from 'store/actions/organizationStoresAction';
import { getMasterMakerLov } from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { hasChanged } from 'utils';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';

const OrganizationStore = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const { orgType } = useParams();
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreRow, setRestoreRow] = useState(null);
  const [listType, setListType] = useState(1);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const orgTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const organizationTypeId = fetchTransactionType(orgTypeData, orgType.toUpperCase());

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  useEffect(() => {
    if (!organizationTypeId) return;
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
      getOrganizationStores({
        pageIndex,
        pageSize,
        listType,
        organizationType: organizationTypeId,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        sortBy: sort?.[0] || 'updatedAt',
        sortOrder: sort?.[1] || 'DESC',
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
    prevSort,
    organizationTypeId
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getOrganizationStoresHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const { organizationStores, organizationStoresHistory } = useOrganizationStore();

  const { data, count } = useMemo(
    () => ({
      data: (!organizationStores.loading && organizationStores.organizationStoreObject?.rows) || [],
      count: organizationStores.organizationStoreObject?.count || 0,
      isLoading: organizationStores.loading || false
    }),
    [organizationStores]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: (!organizationStoresHistory.loading && organizationStoresHistory.organizationStoresHistoryObject?.rows) || [],
      historyCounts: organizationStoresHistory.organizationStoresHistoryObject?.count || 0,
      isLoading: organizationStoresHistory.loading || false
    }),
    [organizationStoresHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: `${orgType} Name`,
        accessor: 'organization.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'orgId'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Type',
        accessor: 'master_maker_lov.name'
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'GSTIN',
        accessor: 'gstNumber'
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'email',
          customAccessor: 'email'
        }
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'mobile_number',
          customAccessor: 'mobileNumber'
        }
      },
      {
        Header: 'Telephone',
        accessor: 'telephone',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'telephone',
          customAccessor: 'telephone'
        }
      },
      {
        Header: 'Address',
        accessor: 'address',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'address',
          customAccessor: 'address'
        }
      },
      {
        Header: 'Country',
        accessor: 'city.state.country.name',
        filterProps: {
          tableName: 'countries',
          getColumn: 'name',
          customAccessor: 'countryId'
        }
      },
      {
        Header: 'State',
        accessor: 'city.state.name',
        filterProps: {
          tableName: 'states',
          getColumn: 'name',
          customAccessor: 'stateId'
        }
      },
      {
        Header: 'City',
        accessor: 'city.name',
        filterProps: {
          tableName: 'cities',
          getColumn: 'name',
          customAccessor: 'cityId'
        }
      },
      {
        Header: 'PinCode',
        accessor: 'pincode',
        filterProps: {
          tableName: 'organization_stores',
          getColumn: 'pincode',
          customAccessor: 'pincode'
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'organization_stores',
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
    [orgType]
  );

  const onBack = () => {
    setView(false);
    setListType(1);
    setRowData(null);
    setUpdate(false);
    setShowAdd(!showAdd);
  };

  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
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
    const response = await request('/organization-store-delete', { method: 'DELETE', params: deleteId });
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
    const response = await request('/organization-store-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
    if (response.success) {
      refreshPagination();
      setOpenRestoreModal(false);
    }
  };

  useEffect(() => {
    setView(false);
    setListType(1);
    setRowData(null);
    setUpdate(false);
    setShowAdd(false);
  }, [orgType]);

  return (
    <>
      {showAdd ? (
        <CreateNewOrganizationStore
          organizationTypeId={organizationTypeId}
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title={orgType + ' Stores'}
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
          handleRowHistory={handleRowHistory}
          cleanupTrigger={orgType}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          exportConfig={{
            tableName: `${orgType?.toLowerCase()}_stores`,
            apiQuery: { listType, organizationType: organizationTypeId, filterObject: filterObjectForApi }
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

export default OrganizationStore;
