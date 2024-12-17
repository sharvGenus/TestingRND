import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useRef, useState } from 'react';
import CreateFormWiseMapping from './create-form-wise-mapping';
import { useTicketMapping } from './useTicketMapping';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getDropdownProjects, getFormWiseTicketMapping, getLovsForMasterName } from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import ConfirmModal from 'components/modal/ConfirmModal';

const FormWiseMapping = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const formWiseMappingTable = [
    {
      Header: 'Project',
      accessor: (list) => projectData.filter((project) => project.id === list?.projectId)[0]?.name
    },
    {
      Header: 'Form Name',
      accessor: 'form.name'
    },
    {
      Header: 'Form Type',
      accessor: (list) => formTypeData.filter((type) => type.id === list?.formTypeId)[0]?.name
    },
    {
      Header: 'Search Columns',
      accessor: (list) =>
        list?.['searchFields']?.map((field, index) => (
          <Fragment key={field.id}>
            {field.name} {index < list?.['searchFields'].length - 1 ? <br /> : <></>}
          </Fragment>
        ))
    },
    {
      Header: 'Web Display Columns',
      accessor: (list) =>
        list?.['displayFields']?.map((field, index) => (
          <Fragment key={field.id}>
            {field.name} {index < list?.['displayFields'].length - 1 ? <br /> : <></>}
          </Fragment>
        ))
    },
    {
      Header: 'Mobile Display Columns',
      accessor: (list) =>
        list?.['mobileFields']?.map((field, index) => (
          <Fragment key={field.id}>
            {field.name} {index < list?.['mobileFields'].length - 1 ? <br /> : <></>}
          </Fragment>
        ))
    },
    {
      Header: 'Geo Location Field',
      accessor: 'geoLocationField.name'
    }
  ];

  const dispatch = useDispatch();
  const deleteId = useRef();
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { formWiseTicketMapping } = useTicketMapping();
  const formWiseTicketMappingData = formWiseTicketMapping?.formWiseTicketMappingObject?.rows || [];
  const formWiseTicketMappingDataCount = formWiseTicketMapping?.formWiseTicketMappingObject?.count || [];

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
    dispatch(getFormWiseTicketMapping());
  }, [dispatch]);

  const onAddHandler = () => {
    setShowForm(true);
  };

  const onConfirmDeleteHandler = async () => {
    setOpenDeleteModal(false);
    const response = await request('/delete-form-wise-ticket-mapping', { method: 'DELETE', params: deleteId.current });
    if (response.success) {
      dispatch(getFormWiseTicketMapping());
      toast('Form wise ticket Mapping deleted successfully.', { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onEditHandler = (e) => {
    setEditRow(formWiseTicketMappingData.filter((data) => data.id === e.id)[0]);
    setShowForm(true);
  };

  return (
    <>
      {showForm ? (
        <CreateFormWiseMapping
          editRow={editRow}
          onBack={() => {
            setShowForm(false);
            setEditRow();
          }}
        />
      ) : (
        <TableForm
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          hideHistoryIcon
          hideViewIcon
          hideEmptyTable
          hideExportButton
          onClick={onAddHandler}
          handleRowDelete={(id) => {
            deleteId.current = id;
            setOpenDeleteModal(true);
          }}
          handleRowUpdate={onEditHandler}
          data={formWiseTicketMappingData}
          columns={formWiseMappingTable}
          count={formWiseTicketMappingDataCount}
        />
      )}
      {openDeleteModal && (
        <ConfirmModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleConfirm={onConfirmDeleteHandler}
          title="Confirm Delete"
          message="Are you sure you want to delete?"
          confirmBtnTitle="Delete"
        />
      )}
    </>
  );
};

export default FormWiseMapping;
