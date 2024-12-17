import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import CreateNewOrganiationLocation from './create-new-organization-location';
import TableForm from 'tables/table';
import { getLovsForMasterName, getOrganizationsHistory, getOrganizationsLocation } from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const OrganizationLocation = () => {
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
  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);
  const { masterMakerOrgType } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerOrgType?.masterObject;
  const transactionTypeId = fetchTransactionType(transactionTypeData, orgType.toUpperCase());

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  useEffect(() => {
    if (!transactionTypeId) return;
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
      getOrganizationsLocation({
        pageIndex,
        pageSize,
        transactionTypeId,
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
    transactionTypeId,
    listType,
    searchStringTrimmed,
    sort,
    accessorsRef,
    forceSearch,
    filterObjectForApi,
    prevFilterObjectForApi,
    prevSort,
    refreshPagination
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getOrganizationsHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const { organizationsLocation, organizationHistory } = useOrganizations();

  const { data } = useMemo(
    () => ({
      data: (!organizationsLocation.loading && organizationsLocation.organizationLocationObject?.rows) || [],
      isLoading: organizationsLocation.loading || false
    }),
    [organizationsLocation]
  );

  const { historyData, historyCounts } = useMemo(
    () => ({
      historyData: (!organizationHistory.loading && organizationHistory.organizationHistoryObject?.rows) || [],
      historyCounts: organizationHistory.organizationHistoryObject?.count || 0,
      isLoading: organizationHistory.loading || false
    }),
    [organizationHistory]
  );

  const columns = useMemo(
    () => [
      {
        Header: orgType,
        accessor: 'parent.name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'contractorName'
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'name',
          customAccessor: 'name'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'code',
          customAccessor: 'code'
        }
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'integration_id',
          customAccessor: 'integrationId'
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'email',
          customAccessor: 'email'
        }
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'mobile_number',
          customAccessor: 'mobileNumber'
        }
      },
      {
        Header: 'Telephone',
        accessor: 'telephone',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'telephone',
          customAccessor: 'telephone'
        }
      },
      {
        Header: 'GSTIN',
        accessor: 'gstNumber',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'gst_number',
          customAccessor: 'getNumber'
        }
      },
      {
        Header: 'Address',
        accessor: 'address',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'address',
          customAccessor: 'address'
        }
      },
      {
        Header: 'Country',
        accessor: 'cities.state.country.name',
        filterProps: {
          tableName: 'countries',
          getColumn: 'name',
          customAccessor: 'countryId'
        }
      },
      {
        Header: 'State',
        accessor: 'cities.state.name',
        filterProps: {
          tableName: 'states',
          getColumn: 'name',
          customAccessor: 'stateId'
        }
      },
      {
        Header: 'City',
        accessor: 'cities.name',
        filterProps: {
          tableName: 'cities',
          getColumn: 'name',
          customAccessor: 'cityId'
        }
      },
      {
        Header: 'Pincode',
        accessor: 'pinCode',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'pincode',
          customAccessor: 'pincode'
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        exportAccessor: 'isActive'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        filterProps: {
          tableName: 'organizations',
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
    const response = await request(`/delete-organization`, { method: 'DELETE', params: deleteId });
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
    const response = await request('/organization-update', { method: 'PUT', body: updatedValues, params: updatedValues.id });
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
        <CreateNewOrganiationLocation
          refreshPagination={refreshPagination}
          onClick={onBack}
          title={orgType + ' Branch Office'}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title={orgType + ' Branch Office'}
          data={data}
          count={data.length}
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
          searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
          sortConfig={{ sort, setSort }}
          cleanupTrigger={orgType}
          exportConfig={{
            tableName: `${orgType.toLowerCase()}_branch`,
            apiQuery: { organizationTypeId: transactionTypeId, listType, filterObject: filterObjectForApi }
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

export default OrganizationLocation;
