import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSupplierRepairCenter } from '../../../store/actions/supplierRepairCenterAction';
import { PAGINATION_CONST } from '../../../constants';
import CreateNewSupplierRepairCenter from './create-new-supplier-repair-center';
import { useSupplierRepairCenter } from './useSupplierRepairCenter';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const SupplierRepairCenter = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getSupplierRepairCenter());
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSupplierRepairCenter());
  }, [dispatch]);

  const { supplierRepairCenter } = useSupplierRepairCenter();

  const { data, count } = useMemo(
    () => ({
      data: supplierRepairCenter.supplierCenterObject?.rows || [],
      count: supplierRepairCenter.supplierCenterObject?.count || 0,
      isLoading: supplierRepairCenter.loading || false
    }),
    [supplierRepairCenter]
  );
  const columns = useMemo(
    () => [
      {
        Header: 'Supplier ID',
        accessor: 'supplier.name'
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
        Header: 'Photo',
        accessor: 'photo'
      },

      {
        Header: 'Mobile No',
        accessor: 'mobileNumber'
      },
      {
        Header: 'Telephone No',
        accessor: 'telephone'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Registered Country',
        accessor: 'register_office_cities.state.country.name'
      },
      {
        Header: 'Registered State',
        accessor: 'register_office_cities.state.name'
      },
      {
        Header: 'Registered City',
        accessor: 'register_office_cities.name'
      },
      {
        Header: 'Registered Pincode',
        accessor: 'registeredOfficePinCode'
      },
      {
        Header: 'Office Address',
        accessor: 'currentOfficeAddress'
      },
      {
        Header: 'Office Country',
        accessor: 'current_office_cities.state.country.name'
      },
      {
        Header: 'Office State',
        accessor: 'current_office_cities.state.name'
      },
      {
        Header: 'Office City',
        accessor: 'current_office_cities.name'
      },
      {
        Header: 'Office Pincode',
        accessor: 'currentOfficePinCode'
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
    infoValue.title = 'Delete Supplier Repair Center';
    infoValue.deleteURL = '/delete-supplier-repair-center';

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
        <CreateNewSupplierRepairCenter
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Supplier Repair Center"
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

export default SupplierRepairCenter;
