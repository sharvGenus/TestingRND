import { Dialog } from '@mui/material';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../../extra-pages/stock-ledger/useStockLedger';
import { fetchStockLedgerDetailList, getLovsForMasterName } from 'store/actions';
import { fetchTransactionType, prepareResponseForReceipt } from 'utils';
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
    accessor: 'actionButtons',
    disableSortBy: true
  },
  {
    Header: 'Receipt Number',
    accessor: 'referenceDocumentNumber'
  },
  {
    Header: 'Project',
    accessor: 'fromProject.name'
  },
  {
    Header: 'From Organization',
    accessor: 'fromStore.organization.name'
  },
  {
    Header: 'From Store',
    accessor: 'fromStore.name'
  },
  {
    Header: 'Receiving Organization',
    accessor: 'toStore.organization.name'
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
    Header: 'E-Way Bill Number',
    accessor: 'eWayBillNumber'
  },
  {
    Header: 'E-Way Bill Date',
    accessor: 'eWayBillDate'
  },
  {
    Header: 'LR Number',
    accessor: 'lrNumber'
  },
  {
    Header: 'Created Date',
    accessor: 'createdAt'
  },
  {
    Header: 'Updated Date',
    accessor: 'updatedAt'
  },
  // {
  //   Header: 'Actual Receipt Date',
  //   accessor: 'actualReceiptDate'
  // },
  {
    Header: 'Remarks',
    accessor: 'remarks'
  }
];

const CTSReceipt = () => {
  const dispatch = useDispatch();
  const { transactionId } = useParams();

  const [previewAction, setPreviewAction] = useState('closed');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [editAction, setEditAction] = useState(false);
  const [selectedIndexForSerialModal, setSelectedIndexForSerialModal] = useState(null);
  const [open, setOpen] = useState(false);
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

  const selectedMaterialList = data?.[selectedIndexForSerialModal]?.materialData || [];
  const selectedTransactionId = data?.[selectedBlockIndex]?.id;
  const selectedReferenceDocumentNumber = data?.[selectedBlockIndex]?.referenceDocumentNumber;

  const transactionTypeId = fetchTransactionType(lovsData, 'CTS');

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
          fetchFromRoute="/cts-receipt"
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
          <EditModal rowData={rowData} setOpen={setOpen} refreshPagination={refreshPagination} title="CTS" editPlaceOfSupply />
        </Dialog>
      )}

      <TableForm
        title="CTS Receipt"
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
          tableName: 'cts_receipt',
          apiQuery: { transactionTypeId }
        }}
      />
    </>
  );
};

export default CTSReceipt;