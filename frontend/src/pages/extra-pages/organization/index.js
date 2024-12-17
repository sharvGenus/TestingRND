import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from './useOrganizations';
import CreateNewOrganizations from './create-new-organizations';
import TableForm from 'tables/table';
import { getOrganizations, getOrganizationsHistory } from 'store/actions/organizationMasterAction';
import { getMasterMakerLov } from 'store/actions';
import request from 'utils/request';
import ConfirmModal from 'components/modal/ConfirmModal';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import { hasChanged } from 'utils';

const Organization = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const { orgType } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, orgType.toUpperCase());
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
      getOrganizations({
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
    forceUpdate,
    refreshPagination,
    prevFilterObjectForApi,
    filterObjectForApi,
    prevSort
  ]);

  useEffect(() => {
    if (record?.id) {
      dispatch(getOrganizationsHistory({ pageIndex, pageSize, listType, recordId: record?.id }));
    }
  }, [dispatch, pageIndex, pageSize, listType, record, forceUpdate]);

  const { organizations, organizationHistory } = useOrganizations();

  const { data, count } = useMemo(
    () => ({
      data: (!organizations.loading && organizations.organizationObject?.rows) || [],
      count: (!organizations.loading && organizations.organizationObject?.count) || 0,
      isLoading: organizations.loading || false
    }),
    [organizations]
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
        Header: 'GSTIN',
        accessor: 'gstNumber',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'gst_number',
          customAccessor: 'gstNumber'
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
        Header: 'Registered Address',
        accessor: 'registeredOfficeAddress',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'registered_office_address',
          customAccessor: 'registeredOfficeAddress'
        }
      },
      {
        Header: 'Registered Country',
        accessor: 'register_office_cities.state.country.name',
        filterProps: {
          tableName: 'countries',
          getColumn: 'name',
          customAccessor: 'registeredCountry'
        }
      },
      {
        Header: 'Registered State',
        accessor: 'register_office_cities.state.name',
        filterProps: {
          tableName: 'states',
          getColumn: 'name',
          customAccessor: 'registeredState'
        }
      },
      {
        Header: 'Registered City',
        accessor: 'register_office_cities.name',
        filterProps: {
          tableName: 'cities',
          getColumn: 'name',
          customAccessor: 'registeredCity'
        }
      },
      {
        Header: 'Registered Pincode',
        accessor: 'registeredOfficePinCode',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'pincode',
          customAccessor: 'registeredPincode'
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
        Header: 'Title',
        accessor: 'organization_title.name',
        filterProps: {
          tableName: 'organizationType',
          getColumn: 'name',
          customAccessor: 'titleName'
        }
      },
      {
        Header: 'Authorised Distributor',
        accessor: 'authorisedDistributor',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'authorised_distributor',
          customAccessor: 'authorisedDistributor'
        }
      },
      {
        Header: 'Firm Type',
        accessor: 'firmType',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'firm_type',
          customAccessor: 'firmType'
        }
      },
      {
        Header: 'MD/CEO Name',
        accessor: 'owner',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'owner',
          customAccessor: 'owner'
        }
      },
      {
        Header: 'Category Of Industry',
        accessor: 'categoryOfIndustry',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'category_of_industry',
          customAccessor: 'categoryOfIndustry'
        }
      },
      {
        Header: 'GST Status',
        accessor: 'gst_status.name',
        filterProps: {
          tableName: 'organizationType',
          getColumn: 'name',
          customAccessor: 'gstStatus'
        }
      },
      {
        Header: 'PAN Number',
        accessor: 'panNumber',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'pan_number',
          customAccessor: 'panNumber'
        }
      },
      {
        Header: 'PAN Reference',
        accessor: 'panReference',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'pan_reference',
          customAccessor: 'panReference'
        }
      },
      {
        Header: 'Date Of Birth',
        accessor: 'dateOfBirth'
      },
      {
        Header: 'Annual Turnover Of First Year',
        accessor: 'annualTurnoverOfFirstYear',
        filterProps: {
          tableName: 'organizations',
          getColumn: 'annual_turnover_of_first_year',
          customAccessor: 'annualFirstYearTurnOver'
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
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

  useEffect(() => {
    setShowAdd(false);
    setListType(1);
  }, [orgType]);

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
  return (
    <>
      {showAdd ? (
        <CreateNewOrganizations
          onClick={onBack}
          refreshPagination={refreshPagination}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title={orgType}
          data={data}
          columns={columns}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
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
            tableName: orgType.toLowerCase(),
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

export default Organization;
