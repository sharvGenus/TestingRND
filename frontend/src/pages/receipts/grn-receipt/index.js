import { Dialog } from '@mui/material';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../../extra-pages/stock-ledger/useStockLedger';
import { fetchStockLedgerDetailList, getLovsForMasterName } from 'store/actions';
import { fetchTransactionType, pickKeyFromResponseObject, prepareResponseForReceipt } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { ActionButtons } from 'components/transactions-report/buttons/ActionButtons';
import Loadable from 'components/Loadable';
import { EditModal } from 'components/transactions-report/editModal';
import FilesDisplayModal from 'components/modal/FilesDisplayModal';
import PrintSerialModal from 'components/transactions-report/printSerialModal';
import useSearch from 'hooks/useSearch';

const ReceiptPreview = Loadable(lazy(() => import('components/transactions-report/preview')));

const columns = [
  {
    Header: 'Actions',
    accessor: 'actionButtons'
  },
  {
    Header: 'Receipt Number',
    accessor: 'referenceDocumentNumber'
  },
  {
    Header: 'Supplier',
    accessor: 'supplierName'
  },
  {
    Header: 'Project',
    accessor: 'toProject.name'
  },
  {
    Header: 'Invoice Number',
    accessor: 'invoiceNumber'
  },
  {
    Header: 'Invoice Date',
    accessor: 'invoiceDate'
  },
  {
    Header: 'Receiving Store',
    accessor: 'toStore.name'
  },
  {
    Header: 'Status',
    accessor: 'status',
    exportAccessor: 'isActive'
  },
  {
    Header: 'PO Number',
    accessor: 'poNumber'
  },
  {
    Header: 'PO Date',
    accessor: 'poDate'
  },
  {
    Header: 'Transporter Name',
    accessor: 'transporterName'
  },
  {
    Header: 'Transporter Contact Number',
    accessor: 'transporterContactNumber'
  },
  {
    Header: 'Vehicle Number',
    accessor: 'vehicleNumber'
  },
  {
    Header: 'LR Number',
    accessor: 'lrNumber'
  },
  {
    Header: 'E-Way Bill Number',
    accessor: 'eWayBillNumber'
  },
  {
    Header: 'E-Way Bill Date',
    accessor: 'eWayBillDate'
  },
  {
    Header: 'Actual Receipt Date',
    accessor: 'actualReceiptDate'
  },
  {
    Header: 'Files',
    accessor: 'files'
  },
  {
    Header: 'Created Date',
    accessor: 'createdAt'
  },
  {
    Header: 'Updated Date',
    accessor: 'updatedAt'
  },
  {
    Header: 'Remarks',
    accessor: 'remarks'
  }
];

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const GRNReceipt = () => {
  const dispatch = useDispatch();

  const [previewAction, setPreviewAction] = useState('closed');
  const [editAction, setEditAction] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [selectedIndexForSerialModal, setSelectedIndexForSerialModal] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [sort, setSort] = useState(null);

  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    setPageIndex,
    refreshPagination,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const { stockLedgerDetailList } = useStockLedger();
  const { masterMakerOrgType } = useMasterMakerLov();

  const lovsData = masterMakerOrgType?.masterObject;

  const { data, count } = useMemo(
    () => ({
      data:
        prepareResponseForReceipt(stockLedgerDetailList?.stockLedgerDetailListObject?.rows)?.map((item, index) => {
          const isMinBased = !!pickKeyFromResponseObject(item, 'requestNumber');
          return {
            ...item,
            ...(item?.stock_ledgers[0]?.isCancelled === true
              ? { status: 'Cancelled' }
              : item?.stock_ledgers[0]?.isProcessed === true
              ? { status: 'Processed' }
              : { status: null }),
            isMinBased,
            supplierName: !isMinBased ? `${item?.toOrganization?.name}-${item?.toOrganization?.code}` : '',
            serialNumber: (pageIndex * pageSize - pageSize + index + 1).toString(),
            files: item?.attachments?.length && (
              <FilesDisplayModal view fileFields={fileFields} tasks={[]} data={{ attachments: item.attachments }} />
            ),
            actionButtons: (
              <ActionButtons
                item={item}
                editButton={true}
                openPreview={() => openModalWithIndex(index)}
                initiatePrint={() => initiatePrint(index)}
                initiateDownload={() => initiateDownload(index)}
                updateReceipt={() => editReceipt(item)}
                viewSerialNumbers={() => {
                  setSelectedIndexForSerialModal(index);
                }}
                noMargins
              />
            )
          };
        }) || [],
      count: stockLedgerDetailList?.stockLedgerDetailListObject?.count,
      isLoading: stockLedgerDetailList?.loading,
      error: stockLedgerDetailList?.error
    }),
    [
      pageIndex,
      pageSize,
      stockLedgerDetailList?.error,
      stockLedgerDetailList?.loading,
      stockLedgerDetailList?.stockLedgerDetailListObject?.count,
      stockLedgerDetailList?.stockLedgerDetailListObject?.rows
    ]
  );

  const selectedMaterialList = data?.[selectedIndexForSerialModal]?.materialData || [];
  const selectedTransactionId = data?.[selectedBlockIndex]?.id;
  const selectedReferenceDocumentNumber = data?.[selectedBlockIndex]?.referenceDocumentNumber;

  const transactionTypeId = fetchTransactionType(lovsData, 'GRN');

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    transactionTypeId &&
      dispatch(
        fetchStockLedgerDetailList({
          pageIndex,
          pageSize,
          transactionTypeId,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          sortBy: sort?.[0] || 'createdAt',
          sortOrder: sort?.[1] || 'DESC'
        })
      );
  }, [accessorsRef, dispatch, pageIndex, forceUpdate, pageSize, searchStringTrimmed, sort, transactionTypeId, forceSearch]);

  const editReceipt = (row) => {
    setRowData(row);
    setEditAction(true);
    setOpen(true);
  };

  const openModalWithIndex = (index) => {
    setSelectedBlockIndex(index);
    setPreviewAction('view');
  };

  const closeModal = () => {
    setSelectedBlockIndex(null);
    setPreviewAction('hidden');
  };

  const initiateDownload = (index) => {
    setSelectedBlockIndex(index);
    setPreviewAction('download');
  };

  const initiatePrint = (index) => {
    setSelectedBlockIndex(index);
    setPreviewAction('print');
  };

  return (
    <>
      {previewAction !== 'closed' && (
        <ReceiptPreview
          fetchFromRoute="/grn-receipt"
          apiParams={selectedTransactionId}
          previewAction={previewAction}
          onClose={closeModal}
          fileNameForDownload={selectedReferenceDocumentNumber}
        />
      )}

      {editAction && (
        <Dialog open={open} onClose={() => setOpen(false)} scroll="paper" maxWidth="xs" disableEscapeKeyDown>
          <EditModal rowData={rowData} setOpen={setOpen} refreshPagination={refreshPagination} title="GRN" />
        </Dialog>
      )}

      {selectedIndexForSerialModal !== null && (
        <PrintSerialModal
          selectedMaterialList={selectedMaterialList}
          onClose={() => {
            setSelectedIndexForSerialModal(null);
          }}
        />
      )}

      <TableForm
        title="GRN Receipt"
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        columns={columns}
        data={transactionTypeId ? data : []}
        count={transactionTypeId ? count : 0}
        hideAddButton
        hideActions
        searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
        sortConfig={{ sort, setSort }}
        exportConfig={{
          tableName: 'grn_receipt',
          apiQuery: { transactionTypeId }
        }}
      />
    </>
  );
};

export default GRNReceipt;
