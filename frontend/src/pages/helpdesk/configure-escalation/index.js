import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CreateEscalationMatrix from './create-escalation-matrix';
import { useEscalation } from './useEscalation';
import { getEscalationMatrix } from 'store/actions';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import usePagination from 'hooks/usePagination';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

const escalationMatrixTableHeader = [
  {
    Header: 'Project',
    accessor: 'project.name'
  },
  {
    Header: 'Email Template',
    accessor: 'ticket_email_template.templateName'
  }
];

const ConfigureEscalation = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [rowData, setRowData] = useState();
  const [edit, setEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteIdRef = useRef();

  const { escalationMatrix } = useEscalation();
  const escalationMatrixData = escalationMatrix?.escalationMatrixObject?.rows || [];
  const escalationMatrixCount = escalationMatrix?.escalationMatrixObject?.count || 0;

  const onConfirmDeleteHandler = async () => {
    const response = await request('/delete-escalation-matrix', { method: 'DELETE', params: deleteIdRef.current });
    if (response.success) {
      setOpenDeleteModal(false);
      getEscalationMatrixList();
      toast('Successfully deleted selected escalation matrix', { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const getEscalationMatrixList = useCallback(() => {
    dispatch(getEscalationMatrix({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    getEscalationMatrixList();
  }, [getEscalationMatrixList]);

  return (
    <>
      {showForm ? (
        <CreateEscalationMatrix
          rowData={rowData}
          edit={edit}
          onBack={(isChanged) => {
            setShowForm(false);
            setEdit(false);
            setRowData();
            if (isChanged) {
              getEscalationMatrixList();
            }
          }}
        />
      ) : (
        <>
          <TableForm
            title="Configured Escalation List"
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            data={escalationMatrixData}
            columns={escalationMatrixTableHeader}
            count={escalationMatrixCount}
            hideHistoryIcon
            hideExportButton
            onClick={() => {
              setShowForm(true);
            }}
            handleRowDelete={(e) => {
              deleteIdRef.current = e;
              setOpenDeleteModal(true);
            }}
            handleRowUpdate={(e) => {
              setEdit(true);
              setRowData(e);
              setShowForm(true);
            }}
            handleRowView={(e) => {
              setRowData(e);
              setShowForm(true);
            }}
          />
        </>
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

export default ConfigureEscalation;
