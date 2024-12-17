import { Button, Dialog, Grid } from '@mui/material';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { ActionButtons } from 'components/transactions-report/buttons/ActionButtons';
import Loadable from 'components/Loadable';
import useSearch from 'hooks/useSearch';
import { getDevolutionList } from 'store/actions';
import { useDevolution } from 'pages/extra-pages/devolution/useDevolution';
import FileSections from 'components/attachments/FileSections';
import MainCard from 'components/MainCard';
import { FormProvider } from 'hook-form';
import Validations from 'constants/yupValidations';
import { hasChanged } from 'utils';
import { useFilterContext } from 'contexts/FilterContext';
import usePrevious from 'hooks/usePrevious';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import FilesDisplayModal from 'components/modal/FilesDisplayModal';
import PrintOldSerialModal from 'components/transactions-report/printOldSerialModal';

const ReceiptPreview = Loadable(lazy(() => import('components/transactions-report/preview')));

const columns = [
  {
    Header: 'Actions',
    accessor: 'actionButtons',
    disableSortBy: true
  },
  {
    Header: 'Devolution Number',
    accessor: 'devolutionDocNo',
    filterProps: {
      tableName: 'devolutions',
      getColumn: 'devolution_doc_no',
      customAccessor: 'devolutionDocNo'
    }
  },
  {
    Header: 'Project',
    accessor: 'project.name',
    filterProps: {
      tableName: 'projects',
      getColumn: 'name',
      customAccessor: 'projectId'
    }
  },
  {
    Header: 'Form',
    accessor: 'form.name',
    filterProps: {
      tableName: 'forms',
      getColumn: 'name',
      customAccessor: 'formId'
    }
  },
  {
    Header: 'Customer',
    accessor: 'organization.name',
    filterProps: {
      tableName: 'organizations',
      getColumn: 'name',
      customAccessor: 'customerId'
    }
  },
  {
    Header: 'Customer Store',
    accessor: 'organization_store.name',
    filterProps: {
      tableName: 'organization_stores',
      getColumn: 'name',
      customAccessor: 'customerStoreId'
    }
  },
  {
    Header: 'Status',
    accessor: 'status',
    exportAccessor: 'approvalStatus',
    disableSortBy: true
  },
  {
    Header: 'Files',
    accessor: 'files',
    disableSortBy: true
  },
  {
    Header: 'Created By',
    accessor: 'created.name',
    filterProps: {
      tableName: 'devolutions',
      getColumn: 'created_by',
      customAccessor: 'createdBy'
    }
  },
  {
    Header: 'Created On',
    accessor: 'createdAt'
  },
  {
    Header: 'Updated By',
    accessor: 'updated.name',
    filterProps: {
      tableName: 'devolutions',
      getColumn: 'updated_by',
      customAccessor: 'updatedBy'
    }
  },
  {
    Header: 'Updated On',
    accessor: 'updatedAt'
  }
];

const DevolutionView = () => {
  const dispatch = useDispatch();

  const [previewAction, setPreviewAction] = useState('closed');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [editAction, setEditAction] = useState(false);
  const [selectedMaterialForSerialModal, setSelectedMaterialForSerialModal] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [sort, setSort] = useState(null);

  const { fileFields } = useMemo(
    () => ({
      fileFields: [
        {
          name: 'attachments',
          label: 'Attachments',
          accept: '*',
          required: true,
          multiple: true
        }
      ]
    }),
    []
  );

  const { filterObjectForApi } = useFilterContext();
  const prevFilterObjectForApi = usePrevious(filterObjectForApi);
  const prevSort = usePrevious(sort);

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    refreshPagination,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, searchStringTrimmed } = useSearch();

  const { devolutionList } = useDevolution();

  const { data, count } = useMemo(
    () => ({
      data:
        devolutionList?.stocksObject?.rows?.map((item, index) => ({
          ...item,
          ...(item?.approvalStatus === '2'
            ? { status: 'Pending' }
            : item?.approvalStatus === '1'
            ? { status: 'Approved' }
            : item?.approvalStatus === '0'
            ? { status: 'Rejected' }
            : { status: null }),
          // serialNumber: (pageIndex * pageSize - pageSize + index + 1).toString(),
          files: item?.attachments?.length && (
            <FilesDisplayModal view fileFields={fileFields} tasks={[]} data={{ attachments: item.attachments }} />
          ),
          actionButtons: (
            <ActionButtons
              uploadButton={true}
              disableUpload={item?.approvalStatus === '0' ? true : false}
              openPreview={() => openModalWithIndex(index)}
              initiatePrint={() => initiatePrint(index)}
              initiateDownload={() => initiateDownload(index)}
              uploadAttachments={() => uploadAttachments(item)}
              viewSerialNumbers={() => {
                setSelectedMaterialForSerialModal(item);
              }}
              noMargins
            />
          )
        })) || [],
      count: devolutionList?.stocksObject?.count,
      isLoading: devolutionList?.loading,
      error: devolutionList?.error
    }),
    [devolutionList, fileFields]
  );

  const selectedTransactionId = data?.[selectedBlockIndex]?.id;
  const selectedReferenceDocumentNumber = data?.[selectedBlockIndex]?.referenceDocumentNumber;

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        ...(fileFields.find((item) => item.name === 'attachments')?.required && {
          attachments: Validations.requiredWithLabel('Attachments')
        })
      })
    )
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (
      [
        [prevFilterObjectForApi, filterObjectForApi],
        [prevSort, sort]
      ].some(hasChanged)
    ) {
      refreshPagination();
      return;
    }
    dispatch(
      getDevolutionList({
        pageIndex,
        pageSize,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
        filterObject: filterObjectForApi
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchStringTrimmed,
    filterObjectForApi,
    prevFilterObjectForApi,
    prevSort,
    refreshPagination,
    accessorsRef,
    sort
  ]);

  const onFileUpload = async (values) => {
    const response = await request('/devolution-update', {
      method: 'PUT',
      timeoutOverride: 20 * 60000,
      body: {
        attachments: values['attachments-paths']
      },
      params: rowData.id
    });
    if (response.success) {
      setOpen(false);
      setPageIndex(pageIndex);
      toast(`Attachments upload successfully.`, { variant: 'success' });
      dispatch(
        getDevolutionList({
          pageIndex,
          pageSize,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          filterObject: filterObjectForApi
        })
      );
    } else toast(response?.error?.message);
  };

  const openModalWithIndex = (index) => {
    setPreviewAction('view');
    setSelectedBlockIndex(index);
  };

  const uploadAttachments = (row) => {
    setRowData(row);
    setEditAction(true);
    setOpen(true);
  };

  const closeModal = () => {
    setPreviewAction('hidden');
    setSelectedBlockIndex(null);
  };

  const initiateDownload = (index) => {
    setPreviewAction('download');
    setSelectedBlockIndex(index);
  };

  const initiatePrint = (index) => {
    setPreviewAction('print');
    setSelectedBlockIndex(index);
  };

  return (
    <>
      {previewAction !== 'closed' && (
        <ReceiptPreview
          fetchFromRoute="/devolution-view"
          apiParams={selectedTransactionId}
          previewAction={previewAction}
          onClose={closeModal}
          fileNameForDownload={selectedReferenceDocumentNumber}
        />
      )}

      {selectedMaterialForSerialModal !== null && (
        <PrintOldSerialModal
          selectedMaterial={selectedMaterialForSerialModal}
          onClose={() => {
            setSelectedMaterialForSerialModal(null);
          }}
        />
      )}

      {editAction && (
        <Dialog open={open} onClose={() => setOpen(false)} scroll="paper" maxWidth="xs" disableEscapeKeyDown>
          {/* <EditModal rowData={rowData} setOpen={setOpen} refreshPagination={refreshPagination} title="CTS" editPlaceOfSupply /> */}
          {/* <DevolutionUploadModal rowData={rowData} refreshPagination={refreshPagination} /> */}
          <MainCard title={'Upload Attachments'}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onFileUpload)}>
              <Grid container spacing={2} alignItems={'center'}>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                  <FileSections disabled={false} multiple={true} fileFields={fileFields} setValue={setValue} />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button variant="contained" type="submit">
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          </MainCard>
        </Dialog>
      )}

      <TableForm
        title="Devolution View"
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        columns={columns}
        data={data}
        count={count}
        hideAddButton
        hideActions
        searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
        sortConfig={{ sort, setSort }}
        exportConfig={{
          tableName: 'devolutions',
          fileName: 'devolutions',
          apiQuery: { filterObject: filterObjectForApi, listType: 1 }
        }}
      />
    </>
  );
};

export default DevolutionView;
