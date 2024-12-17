import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PAGINATION_CONST } from '../../../constants';
import { getDropdownSupplier, getSupplier } from '../../../store/actions';
import CreateNewSupplier from './create-new-supplier';
import { useSupplier } from './useSupplier';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const Supplier = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getSupplier());
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSupplier({ pageIndex, pageSize }));
    dispatch(getDropdownSupplier());
  }, [dispatch, pageIndex, pageSize]);

  const { supplier } = useSupplier();
  const { data, count } = useMemo(
    () => ({
      data: supplier.supplierObject?.rows || [],
      count: supplier.supplierObject?.count || 0,
      isLoading: supplier.loading || false
    }),
    [supplier]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Supplier Type',
        accessor: 'type'
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
        Header: 'Website',
        accessor: 'website'
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
        Header: 'Aadhar Number',
        accessor: 'aadharNumber'
      },
      {
        Header: 'PAN Number',
        accessor: 'panNumber'
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
    infoValue.title = 'Delete Supplier';
    infoValue.deleteURL = '/delete-supplier';
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
        <CreateNewSupplier
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Supplier"
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

export default Supplier;
