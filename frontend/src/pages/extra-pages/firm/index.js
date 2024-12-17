import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getFirms } from '../../../store/actions/firmMasterAction';
import { PAGINATION_CONST } from '../../../constants';
import { useFirms } from './useFirms';
import CreateNewFirm from './create-new-firm';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const Firm = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getFirms());
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFirms({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);
  const { firms } = useFirms();
  const { data, count } = useMemo(
    () => ({
      data: firms.firmsObject?.rows || [],
      count: firms.firmsObject?.count || 0,
      isLoading: firms.loading || false
    }),
    [firms]
  );

  const columns = useMemo(
    () => [
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
        Header: 'GSTIN',
        accessor: 'gstNumber'
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
        Header: 'Address',
        accessor: 'registeredOfficeAddress'
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
        accessor: 'registeredOfficePincode'
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
    infoValue.title = 'Delete Firm';
    infoValue.deleteURL = '/delete-firm';

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
        <CreateNewFirm
          onClick={onBack}
          refreshPagination={refreshPagination}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="CONTRACTOR"
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

export default Firm;
