import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import CreateProjectWiseMapping from './create-project-wise-mapping';
import { useTicketMapping } from './useTicketMapping';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { getProjectWiseTicketMapping } from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';

const projectWiseMappingTable = [
  {
    Header: 'Project',
    accessor: 'project.name'
  },
  {
    Header: 'Prefix',
    accessor: 'prefix'
  },
  {
    Header: 'Ticket Index Number',
    accessor: 'ticketIndex'
  },
  {
    Header: 'Ticket Issue Types',
    accessor: (list) =>
      list?.['issueFields']?.map((field) => (
        <Typography sx={{ whiteSpace: 'nowrap' }} key={field.id}>
          {field.name}
        </Typography>
      ))
  },
  {
    Header: 'O&M Forms',
    accessor: (list) =>
      list?.['forms']?.map((form) => (
        <Typography sx={{ whiteSpace: 'nowrap' }} key={form.id}>
          {form.name}
        </Typography>
      ))
  }
];

const ProjectWiseMapping = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const deleteId = useRef();
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { projectWiseTicketMapping } = useTicketMapping();
  const projectWiseTicketMappingData = projectWiseTicketMapping?.projectWiseTicketMappingObject?.rows || [];
  const projectWiseTicketMappingDataCount = projectWiseTicketMapping?.projectWiseTicketMappingObject?.count || 0;

  useEffect(() => {
    dispatch(getProjectWiseTicketMapping());
  }, [dispatch]);

  const onAddHandler = () => {
    setShowForm(true);
  };

  const onConfirmDeleteHandler = async () => {
    setOpenDeleteModal(false);
    const response = await request('/delete-project-wise-ticket-mapping', { method: 'DELETE', params: deleteId.current });
    if (response.success) {
      dispatch(getProjectWiseTicketMapping());
      toast('Successfully deleted project wise ticket mapping.', { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const handleRowUpdate = (e) => {
    setEditRow(projectWiseTicketMappingData.filter((data) => data.id === e.id)[0]);
    setShowForm(true);
  };

  return (
    <>
      {showForm ? (
        <CreateProjectWiseMapping
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
          handleRowUpdate={handleRowUpdate}
          data={projectWiseTicketMappingData}
          columns={projectWiseMappingTable}
          count={projectWiseTicketMappingDataCount}
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

export default ProjectWiseMapping;
