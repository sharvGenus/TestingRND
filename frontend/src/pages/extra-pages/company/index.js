import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCompanies } from '../../../store/actions/companyMasterAction';
import { PAGINATION_CONST } from '../../../constants';
import CreateNewCompany from './create-new-company';
import { useCompanies } from './useCompanies';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const Company = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getCompanies());
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCompanies({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  const handleRowDelete = async (values) => {
    const infoValue = {};
    infoValue.deleteID = values;
    infoValue.title = 'Delete Company';
    infoValue.deleteURL = '/delete-company';

    setDeleteInfo(infoValue);
    setOpenDeleteModal(true);
  };
  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };
  const { companies } = useCompanies();
  const { data, count } = useMemo(
    () => ({
      data: companies.companiesObject?.rows || [],
      count: companies.companiesObject?.count || 0,
      isLoading: companies.loading || false
    }),
    [companies]
  );
  const handleRowView = (row) => {
    setShowAdd(true);
    setView(true);
    setUpdate(false);
    setRowData(row);
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Company Name',
        accessor: 'name'
      },
      {
        Header: 'Company Code',
        accessor: 'code'
      },
      {
        Header: 'Parent Company',
        accessor: 'parent_company.name'
      },
      {
        Header: 'GST No',
        accessor: 'gstNumber'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Integration ID',
        accessor: 'integrationId'
      },
      {
        Header: 'Mobile Number',
        accessor: 'mobileNumber'
      },
      {
        Header: 'Telephone Number',
        accessor: 'telephone'
      },
      {
        Header: 'Registered Office Address',
        accessor: 'registeredOfficeAddress'
      },
      {
        Header: 'Registered Office Country',
        accessor: 'registered_office_city.state.country.name'
      },
      {
        Header: 'Registered Office State',
        accessor: 'registered_office_city.state.name'
      },
      {
        Header: 'Registered Office City',
        accessor: 'registered_office_city.name'
      },
      {
        Header: 'Registered Office Pincode',
        accessor: 'registeredOfficePincode'
      },
      {
        Header: 'Office Address',
        accessor: 'currentOfficeAddress'
      },
      {
        Header: 'Office Country',
        accessor: 'current_office_city.state.country.name'
      },
      {
        Header: 'Office State',
        accessor: 'current_office_city.state.name'
      },
      {
        Header: 'Office City',
        accessor: 'current_office_city.name'
      },
      {
        Header: 'Office Pincode',
        accessor: 'currentOfficePincode'
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

  return (
    <>
      {showAdd ? (
        <CreateNewCompany
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Company"
          data={data}
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

export default Company;
