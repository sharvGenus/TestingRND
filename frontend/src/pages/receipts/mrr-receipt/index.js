import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useRequest } from '../mrf-receipt/useRequest';
import { fetchRequestDetails, getLovsForMasterName } from 'store/actions';
import { getRequestStatus, getStore } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { ActionButtons } from 'components/transactions-report/buttons/ActionButtons';
import Loadable from 'components/Loadable';
import useSearch from 'hooks/useSearch';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';

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
    accessor: 'project.name'
  },
  {
    Header: 'Contractor',
    accessor: 'from_store.organization.name'
  },
  {
    Header: 'Contractor Store',
    accessor: 'from_store.name'
  },
  {
    Header: 'Company Store',
    accessor: 'to_store.name'
  },
  {
    Header: 'Status',
    accessor: 'receiptStatus'
  },
  {
    Header: 'Supervisor Name',
    accessor: 'contractor_employee.name'
  },
  {
    Header: 'Vehicle Number',
    accessor: 'vehicleNumber'
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

function fetchTransactionType(obj, name) {
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].name === name) {
      return obj[i].id;
    }
  }
  return null;
}

const MRRReceipt = () => {
  const dispatch = useDispatch();
  const { transactionId } = useParams();

  const [previewAction, setPreviewAction] = useState('closed');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [sort, setSort] = useState(null);

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, forceSearch, searchStringTrimmed } = useSearch();

  const { transactionRequest } = useRequest();
  const { masterMakerOrgType } = useMasterMakerLov();

  const lovsData = masterMakerOrgType?.masterObject;
  const { data, count } = useMemo(
    () => ({
      data:
        transactionRequest?.requestDetails?.rows?.map((item, index) => ({
          ...item,
          serialNumber: (pageIndex * pageSize - pageSize + index + 1).toString(),
          actionButtons: (
            <ActionButtons
              openPreview={() => openModalWithIndex(index)}
              initiatePrint={() => initiatePrint(index)}
              initiateDownload={() => initiateDownload(index)}
              noMargins
            />
          )
        })) || [],
      count: transactionRequest?.requestDetails?.count,
      isLoading: transactionRequest?.loading,
      error: transactionRequest?.error
    }),
    [transactionRequest, pageIndex, pageSize]
  );

  const selectedReferenceDocumentNumber = data?.[selectedBlockIndex]?.referenceDocumentNumber;

  const transactionTypeId = useMemo(() => {
    if (lovsData) {
      return fetchTransactionType(lovsData, 'MRR');
    }
    return null;
  }, [lovsData]);

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);

  useEffect(() => {
    transactionTypeId &&
      dispatch(
        fetchRequestDetails({
          pageIndex,
          pageSize,
          transactionTypeId,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) }),
          sortBy: sort?.[0] || 'createdAt',
          sortOrder: sort?.[1] || 'DESC'
        })
      );
  }, [dispatch, transactionId, pageIndex, pageSize, transactionTypeId, searchStringTrimmed, sort, accessorsRef, forceSearch]);

  const openModalWithIndex = (index) => {
    setPreviewAction('view');
    setSelectedBlockIndex(index);
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

  // Add materials list array to the data
  const filteredData = (dataArray) => {
    const respArr = [];
    const jsn = {};
    dataArray.map((val) => {
      val = {
        ...val,
        receiptStatus: getRequestStatus(val)
      };
      const pushedData = {
        name: val.material.name,
        code: val.material.code,
        hsnCode: val.material.hsnCode,
        uom: val.uom.name,
        quantity: val.requestedQuantity,
        remarks: val.remarks
      };
      if (
        jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)] &&
        jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)]['stock_ledgers']
      )
        jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)]['stock_ledgers'].push(pushedData);
      else {
        val['stock_ledgers'] = [];
        val['stock_ledgers'] = [pushedData];
        jsn[val.referenceDocumentNumber + val.transactionTypeId + getStore(val)] = val;
      }
    });
    Object.keys(jsn).forEach((key) => {
      respArr.push(jsn[key]);
    });
    return respArr;
  };

  const filteredDataObject = filteredData(data);

  return (
    <>
      {previewAction !== 'closed' && (
        <ReceiptPreview
          fetchFromRoute="/mrr-receipt"
          apiQuery={{
            referenceDocumentNumber: selectedReferenceDocumentNumber,
            transactionTypeId: data?.[selectedBlockIndex]?.transactionTypeId,
            fromStoreId: getStore(data?.[selectedBlockIndex])
          }}
          previewAction={previewAction}
          onClose={closeModal}
          fileNameForDownload={selectedReferenceDocumentNumber}
        />
      )}

      <TableForm
        title="MRR Receipt"
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        columns={columns}
        data={transactionTypeId ? filteredDataObject : []}
        count={transactionTypeId ? count : 0}
        hideAddButton
        hideActions
        searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
        sortConfig={{ sort, setSort }}
        exportConfig={{
          tableName: 'mrr_receipt',
          apiQuery: { transactionTypeId }
        }}
      />
    </>
  );
};

export default MRRReceipt;
