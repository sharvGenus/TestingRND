import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getLocationSiteStore } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import CreateNewLocationSiteStore from './create-new-location-site-store';
import { useLocationSiteStore } from './useLocationSiteStore';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const LocationSiteStore = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getLocationSiteStore());
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLocationSiteStore());
  }, [dispatch]);

  const { locationSiteStore } = useLocationSiteStore();
  const { data, count } = useMemo(
    () => ({
      data: locationSiteStore.locationSiteStoreObject?.rows || [],
      count: locationSiteStore.locationSiteStoreObject?.count || 0,
      isLoading: locationSiteStore.loading || false
    }),
    [locationSiteStore]
  );
  const columns = useMemo(
    () => [
      {
        Header: 'Project Site Store',
        accessor: 'project_site_store.name'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId'
      },
      {
        Header: 'Address',
        accessor: 'address'
      },
      {
        Header: 'Country',
        accessor: 'city.state.country.name'
      },
      {
        Header: 'State',
        accessor: 'city.state.name'
      },
      {
        Header: 'City',
        accessor: 'city.name'
      },
      {
        Header: 'Pincode',
        accessor: 'pinCode'
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
        accessor: 'updatedBy'
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      },
      {
        Header: 'Created By',
        accessor: 'createdBy'
      }
    ],
    []
  );

  const [showAdd, setShowAdd] = useState(false);

  const onBack = () => {
    setView(false);
    setUpdate(false);
    setShowAdd(!showAdd);
  };

  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };

  const handleRowDelete = async (values) => {
    const infoValue = {};
    infoValue.deleteID = values;
    infoValue.title = 'Delete Firm';
    infoValue.deleteURL = '/delete-location-site-store';

    setDeleteInfo(infoValue);
    setOpenDeleteModal(true);
  };

  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  return (
    <>
      {showAdd ? (
        <CreateNewLocationSiteStore
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Location Site Store"
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
        />
      )}
      <DeleteModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        deleteInfo={deleteInfo}
        dispatchData={refreshDelete}
      />
    </>
  );
};

export default LocationSiteStore;
