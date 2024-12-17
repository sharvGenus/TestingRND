import { Dialog } from '@mui/material';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useStockLedger } from '../../extra-pages/stock-ledger/useStockLedger';
import { fetchStockLedgerDetailList } from 'store/actions';
import { prepareResponseForReceipt } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { ActionButtons } from 'components/transactions-report/buttons/ActionButtons';
import Loadable from 'components/Loadable';
import { EditModal } from 'components/transactions-report/editModal';
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
    Header: 'Project',
    accessor: 'stock_ledgers[0].project.name'
  },
  {
    Header: 'Organization',
    accessor: 'stock_ledgers[0].organization.name'
  },
  {
    Header: 'Store',
    accessor: 'stock_ledgers[0].organization_store.name'
  },
  {
    Header: 'Status',
    accessor: 'status',
    exportAccessor: 'isActive'
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

const PTPReceipt = () => {
  const dispatch = useDispatch();
  const { transactionId } = useParams();

  const [previewAction, setPreviewAction] = useState('closed');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [editAction, setEditAction] = useState(false);
  const [selectedIndexForSerialModal, setSelectedIndexForSerialModal] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [sort, setSort] = useState(null);
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const {
    paginations: { pageSize, pageIndex, forceUpdate },
    setPageIndex,
    refreshPagination,
    setPageSize
  } = usePagination();

  const { stockLedgerDetailList } = useStockLedger();

  const { data, count } = useMemo(
    () => ({
      data:
        prepareResponseForReceipt(stockLedgerDetailList?.stockLedgerDetailListObject?.rows).map((item, index) => ({
          ...item,
          ...(item?.stock_ledgers[0]?.isCancelled === true
            ? { status: 'Cancelled' }
            : item?.stock_ledgers[0]?.isProcessed === true
            ? { status: 'Processed' }
            : { status: null }),
          serialNumber: (pageIndex * pageSize - pageSize + index + 1).toString(),
          actionButtons: (
            <ActionButtons
              editButton={true}
              openPreview={() => openModalWithIndex(index)}
              initiatePrint={() => initiatePrint(index)}
              initiateDownload={() => initiateDownload(index)}
              updateReceipt={() => editReceipt(item)}
              viewSerialNumbers={() => {
                setSelectedIndexForSerialModal(index);
              }}
              disablePrint={
                +item.sumOfAmounts > item.stock_ledgers?.[0]?.project?.eWayBillLimit && !item.eWayBillDate && !item.eWayBillNumber
              }
              disableDownload={
                +item.sumOfAmounts > item.stock_ledgers?.[0]?.project?.eWayBillLimit && !item.eWayBillDate && !item.eWayBillNumber
              }
              noMargins
            />
          )
        })) || [],
      count: stockLedgerDetailList?.stockLedgerDetailListObject?.count,
      isLoading: stockLedgerDetailList?.loading,
      error: stockLedgerDetailList?.error
    }),
    [stockLedgerDetailList, pageIndex, pageSize]
  );

  const selectedMaterialList = data?.[selectedIndexForSerialModal]?.materialDataNegativeQty || [];
  const selectedTransactionId = data?.[selectedBlockIndex]?.id;
  const selectedReferenceDocumentNumber = data?.[selectedBlockIndex]?.referenceDocumentNumber;

  const transactionTypeId = '22ce5829-2a1e-407c-88f6-5ebc38455519';

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
  }, [dispatch, transactionId, pageIndex, pageSize, forceUpdate, transactionTypeId, searchStringTrimmed, sort, accessorsRef, forceSearch]);

  const openModalWithIndex = (index) => {
    setPreviewAction('view');
    setSelectedBlockIndex(index);
  };

  const editReceipt = (row) => {
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
          fetchFromRoute="/ptp-receipt"
          apiParams={selectedTransactionId}
          previewAction={previewAction}
          onClose={closeModal}
          fileNameForDownload={selectedReferenceDocumentNumber}
        />
      )}

      {selectedIndexForSerialModal !== null && (
        <PrintSerialModal
          selectedMaterialList={selectedMaterialList}
          onClose={() => {
            setSelectedIndexForSerialModal(null);
          }}
        />
      )}

      {editAction && (
        <Dialog open={open} onClose={() => setOpen(false)} scroll="paper" maxWidth="xs" disableEscapeKeyDown>
          <EditModal rowData={rowData} setOpen={setOpen} refreshPagination={refreshPagination} title="PTP" editPlaceOfSupply isPtp />
        </Dialog>
      )}

      <TableForm
        title="PTP Receipt"
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
          tableName: 'ptp_receipt',
          apiQuery: { transactionTypeId }
        }}
      />
    </>
  );
};

export default PTPReceipt;
