import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSmtp } from '../../../store/actions';
import CreateNewSmtp from './create-new-smtp';
import { useSmtp } from './useSmtp';
import TableForm from 'tables/table';
import DeleteModal from 'components/modal/DeleteModal';
import usePagination from 'hooks/usePagination';

const columns = [
  {
    Header: 'Server',
    accessor: 'server'
  },
  {
    Header: 'Port',
    accessor: 'port'
  },
  {
    Header: 'Encryption',
    accessor: 'encryption'
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Remarks',
    accessor: 'remarks'
  }
];

const SmtpConfiguraton = () => {
  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();

  const refreshDelete = () => {
    refreshPagination();
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getSmtp({
        pageIndex,
        pageSize
      })
    );
  }, [dispatch, pageIndex, pageSize, forceUpdate]);

  const { smtp } = useSmtp();
  const { data, count } = useMemo(
    () => ({
      data: smtp.smtpObject?.rows || [],
      count: smtp.smtpObject?.count || 0,
      isLoading: smtp.loading || false
    }),
    [smtp]
  );

  const setRefresh = () => {
    setShowAdd(false);
    setView(false);
    setUpdate(false);
    setRowData(null);
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
    infoValue.title = 'Delete Smtp';
    infoValue.deleteURL = '/smtp-configuration-delete';
    setDeleteInfo(infoValue);
    setOpenDeleteModal(true);
  };
  const handleRowUpdate = (row) => {
    setShowAdd(true);
    setUpdate(true);
    setView(false);
    setRowData(row);
  };

  const onBack = () => {
    setView(false);
    setUpdate(false);
    setShowAdd(!showAdd);
  };

  return (
    <>
      {showAdd ? (
        <CreateNewSmtp
          refreshPagination={refreshPagination}
          setRefresh={setRefresh}
          {...(rowData && { data: rowData })}
          {...(view && { view: view, update: false })}
          {...(update && { update: update, view: false })}
        />
      ) : (
        <>
          <TableForm
            title="SMTP Configuration"
            onClick={onBack}
            data={data}
            columns={columns}
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            handleRowDelete={handleRowDelete}
            handleRowUpdate={handleRowUpdate}
            handleRowView={handleRowView}
            exportConfig={{
              tableName: 'smtp'
            }}
          />
          <DeleteModal
            open={openDeleteModal}
            handleClose={() => setOpenDeleteModal(false)}
            deleteInfo={deleteInfo}
            dispatchData={refreshDelete}
          />
        </>
      )}
    </>
  );
};

export default SmtpConfiguraton;
