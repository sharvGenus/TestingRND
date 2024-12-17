import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PAGINATION_CONST } from '../../../constants';
import { getFirmLocation } from '../../../store/actions/firmLocationMasterAction';
import { useFirmLocations } from './useFirmsLocation';
import CreateNewFirmLocation from './create-new-firm-location';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const FirmLocation = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getFirmLocation());
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFirmLocation({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);
  const { firmLocations } = useFirmLocations();
  const { data, count } = useMemo(
    () => ({
      data: firmLocations.firmLocationsObject?.rows || [],
      count: firmLocations.firmLocationsObject?.count || 0,
      isLoading: firmLocations.loading || false
    }),
    [firmLocations]
  );
  const columns = useMemo(
    () => [
      {
        Header: 'Contractor',
        accessor: 'firm.name'
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber'
      },
      {
        Header: 'Telephone',
        accessor: 'telephone'
      },
      {
        Header: 'GSTIN',
        accessor: 'gstNumber'
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
        accessor: 'pincode'
      },
      {
        Header: 'Status',
        accessor: 'status',
        exportAccessor: 'isActive'
      },
      {
        Header: 'Remarks',
        accessor: 'Remarks'
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
    infoValue.title = 'Delete Contractor Location';
    infoValue.deleteURL = '/delete-firm-location';

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
        <CreateNewFirmLocation
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Contractor Location"
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

export default FirmLocation;
