import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDevolution } from '../devolution/useDevolution';
import Details from './details';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import { getDevolutionConfig } from 'store/actions';
import usePagination from 'hooks/usePagination';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useSearch from 'hooks/useSearch';

const DevolutionConfigurator = () => {
  const [selectedData, setSelectedData] = useState({});
  const [addOrEdit, setAddOrEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();
  const {
    paginations: { pageSize, pageIndex },
    refreshPagination,
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, searchStringTrimmed } = useSearch();

  const columns = [
    {
      Header: 'Project',
      accessor: 'project.name'
    },
    {
      Header: 'Form',
      accessor: 'form.name'
    },
    {
      Header: 'Devolution Prefix',
      accessor: 'prefix'
    },
    {
      Header: 'Index Number',
      accessor: 'index'
    },
    {
      Header: 'Old Serial Number',
      accessor: 'old_serial_no.name'
    },
    {
      Header: 'Old Make',
      accessor: 'old_make.name'
    },
    {
      Header: 'New Serial Number',
      accessor: 'new_serial_no.name'
    },
    {
      Header: 'New Make',
      accessor: 'new_make.name'
    }
  ];

  const onBack = () => {
    setPageIndex(1);
    setPageSize(25);
    setAddOrEdit(false);
    setSelectedData({});
    dispatch(
      getDevolutionConfig({
        pageIndex,
        pageSize,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
      })
    );
  };

  const onUpdateRow = (vl) => {
    setAddOrEdit(true);
    setSelectedData(vl);
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const onDelete = async () => {
    const response = await request(`/devolution-config-delete`, { method: 'DELETE', params: deleteId });
    if (response.success) {
      toast(`Devolution Config Deleted Successfully`, { variant: 'success' });
      dispatch(
        getDevolutionConfig({
          pageIndex,
          pageSize,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
        })
      );
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  const onAdd = () => {
    setSelectedData({});
    setAddOrEdit(true);
  };

  const {
    devolutionConfigList: {
      stocksObject: { rows: data, count }
    }
  } = useDevolution();

  useEffect(() => {
    dispatch(
      getDevolutionConfig({
        pageIndex,
        pageSize,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
      })
    );
  }, [dispatch, pageIndex, pageSize, refreshPagination, accessorsRef, searchStringTrimmed]);

  return (
    <>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={onDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      {!addOrEdit && (
        <MainCard title={'Devolution Configurator'} sx={{ mb: 2 }}>
          <TableForm
            title=""
            hideHistoryIcon
            hideViewIcon
            hideExportButton
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            handleRowDelete={handleRowDelete}
            handleRowUpdate={onUpdateRow}
            onClick={onAdd}
            data={data || []}
            columns={columns}
            count={count || 0}
            searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
            exportConfig={{
              tableName: 'devolution-configurator',
              fileName: 'devolution-configurator',
              apiQuery: { listType: 1 }
            }}
          />
        </MainCard>
      )}
      {addOrEdit && <Details selectedData={selectedData} onBack={onBack} />}
    </>
  );
};

export default DevolutionConfigurator;
