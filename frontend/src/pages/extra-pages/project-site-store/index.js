import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDropdownProjectSiteStore, getProjectSiteStore } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import CreateNewProjectSiteStore from './create-new-project-site-store';
import { useProjectSiteStore } from './useProjectSiteStore';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';

const ProjectSiteStore = () => {
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const refreshPagination = () => {
    setPageIndex(PAGINATION_CONST.pageIndex);
    setPageSize(PAGINATION_CONST.pageSize);
  };
  const refreshDelete = () => {
    refreshPagination();
    dispatch(getProjectSiteStore());
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjectSiteStore());
    dispatch(getDropdownProjectSiteStore());
  }, [dispatch]);

  const { projectSiteStore } = useProjectSiteStore();
  const { data, count } = useMemo(
    () => ({
      data: projectSiteStore.projectSiteStoreObject?.rows || [],
      count: projectSiteStore.projectSiteStoreObject?.count || 0,
      isLoading: projectSiteStore.loading || false
    }),
    [projectSiteStore]
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
        Header: 'Email Id',
        accessor: 'email'
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
        Header: 'Registered Address',
        accessor: 'registeredOfficeAddress'
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
    infoValue.title = 'Delete Project Site Store';
    infoValue.deleteURL = '/delete-project-site-store';
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
        <CreateNewProjectSiteStore
          refreshPagination={refreshPagination}
          onClick={onBack}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <TableForm
          title="Project Site Store"
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

export default ProjectSiteStore;
