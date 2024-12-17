import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Dialog } from '@mui/material';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CreateNewOrganizationStoreLocation from './create-new-organization-store-location';
import { useOrganizationStoreLocation } from './useOrganizationStoreLocation';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import {
  getCompanyStoreLocations,
  getFirmStoreLocations,
  getOrganizationStoreLocationsHistory
} from 'store/actions/organizationStoreLocationActions';
import { getLovsForMasterName } from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const OrganizationStoreLocation = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const { orgType } = useParams();

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

  const { companyStoreLocations, firmStoreLocations, organizationStoreLocationsHistory } = useOrganizationStoreLocation();
  const {
    masterMakerOrgType: { masterObject: organziationTypesData }
  } = useMasterMakerLov();

  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };

  const organizationTypeId = fetchTransactionType(organziationTypesData, orgType.toUpperCase());

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

    const payload = {
      pageIndex,
      pageSize,
      organizationType: organizationTypeId,
      listType,
      ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
      sortBy: sort?.[0] || 'updatedAt',
      sortOrder: sort?.[1] || 'DESC',
      filterObject: filterObjectForApi
    };

    if (orgType.toUpperCase() === 'CONTRACTOR') {
      dispatch(getFirmStoreLocations(payload));
    } else if (orgType.toUpperCase() === 'COMPANY') {
      dispatch(getCompanyStoreLocations(payload));
    }
  }, [
    dispatch,
    pageIndex,
    pageSize,
    forceUpdate,
    organizationTypeId,
    orgType,
    listType,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getOrganizationStoreLocationsHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const organizationStoreLocations = orgType.toUpperCase() === 'CONTRACTOR' ? firmStoreLocations : companyStoreLocations;

  const { data, count } = useMemo(
    () =>
      orgType.toUpperCase() === 'CONTRACTOR'
        ? {
            data: organizationStoreLocations?.firmStoreLocationsObject?.rows || [],
            count: organizationStoreLocations?.firmStoreLocationsObject?.count || 0,
            isLoading: organizationStoreLocations?.firmStoreLocationsObject?.loading || false
          }
        : {
            data: organizationStoreLocations?.companyStoreLocationsObject?.rows || [],
            count: organizationStoreLocations?.companyStoreLocationsObject?.count || 0,
            isLoading: organizationStoreLocations?.companyStoreLocationsObject?.loading || false
          },
    [organizationStoreLocations, orgType]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: organizationStoreLocationsHistory.organizationStoreLocationsHistoryObject?.rows || [],
      historyCounts: organizationStoreLocationsHistory.organizationStoreLocationsHistoryObject?.count || 0,
      isLoading: organizationStoreLocationsHistory.loading || false
    }),
    [organizationStoreLocationsHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'master_maker_lov.name'
      },
      {
        Header: 'Store Name',
        accessor: 'organization_store.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'storeName'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'Is Restricted',
        accessor: 'restricted',
        exportAccessor: 'isRestricted',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'is_restricted',
          customAccessor: 'isRestricted'
        }
      },
      {
        Header: 'Is Faulty',
        accessor: 'faulty',
        exportAccessor: 'isFaulty',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'is_faulty',
          customAccessor: 'isFaulty'
        }
      },
      {
        Header: 'Is Scrap',
        accessor: 'scrap',
        exportAccessor: 'isScrap',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'is_scrap',
          customAccessor: 'isScrap'
        }
      },
      {
        Header: 'Is Installed',
        accessor: 'installed',
        exportAccessor: 'isInstalled',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'is_installed',
          customAccessor: 'isInstalled'
        }
      },
      {
        Header: 'For Installer',
        accessor: 'installer',
        exportAccessor: 'forInstaller',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'for_installer',
          customAccessor: 'forInstaller'
        }
      },
      {
        Header: 'Is Old',
        accessor: 'old',
        exportAccessor: 'isOld',
        filterProps: {
          tableName: 'organization_store_locations',
          getColumn: 'is_old',
          customAccessor: 'isOld'
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'organization_store_locations',
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
    const response = await request('/organization-store-location-delete', { method: 'DELETE', params: deleteId });
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
    const response = await request('/organization-store-location-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
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

  const addField = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push({
          ...val,
          restricted: val.isRestricted ? 'True' : 'False',
          faulty: val.isFaulty ? 'True' : 'False',
          scrap: val.isScrap ? 'True' : 'False',
          installed: val.isInstalled ? 'True' : 'False',
          installer: val.forInstaller ? 'True' : 'False',
          old: val.isOld ? 'True' : 'False'
        });
      });
    return newArr;
  };

  return (
    <>
      {showAdd ? (
        <CreateNewOrganizationStoreLocation
          refreshPagination={refreshPagination}
          onClick={onBack}
          organizationTypeId={organizationTypeId}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title={`${orgType} Store Location`}
          data={addField(data)}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onClick={onBack}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          handleRowView={handleRowView}
          handleRowRestore={handleRowRestore}
          listType={listType}
          setListType={setListTypeData}
          handleRowHistory={handleRowHistory}
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          cleanupTrigger={orgType}
          exportConfig={{
            tableName: `${orgType?.toLowerCase()}_store_locations`,
            apiQuery: { organizationType: organizationTypeId, listType, filterObject: filterObjectForApi }
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
          data={addField(historyData)}
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

export default OrganizationStoreLocation;
