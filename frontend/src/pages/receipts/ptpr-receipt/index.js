import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { useRequest } from '../mrf-receipt/useRequest';
import { fetchRequestDetails, getLovsForMasterName } from 'store/actions';
import { getRequestStatus, getStore } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { ActionButtons } from 'components/transactions-report/buttons/ActionButtons';
import Loadable from 'components/Loadable';
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
    accessor: 'materialData[0].project.name'
  },
  {
    Header: 'From Company Store',
    accessor: 'fromStore.name'
  },
  {
    Header: 'To Project',
    accessor: 'toProject.name'
  },
  {
    Header: 'Status',
    accessor: 'receiptStatus'
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

const groupByRequisionNumber = (data) => {
  if (!data) return [];

  const groupedData = data.reduce((accumulator, currentObject) => {
    const { transactionTypeId, referenceDocumentNumber } = currentObject;

    if (!accumulator[referenceDocumentNumber + transactionTypeId + getStore(currentObject)]) {
      accumulator[referenceDocumentNumber + transactionTypeId + getStore(currentObject)] = [];
    }

    accumulator[referenceDocumentNumber + transactionTypeId + getStore(currentObject)].push(currentObject);

    return accumulator;
  }, {});

  return Object.entries(groupedData).map(([, value]) => ({
    transactionTypeId: value[0].transactionTypeId,
    referenceDocumentNumber: value[0].referenceDocumentNumber,
    fromStore: value[0].from_store,
    projectName: value[0].project.name,
    fromProject: value[0].project,
    toProject: value[0].to_project,
    toStore: value[0].to_store,
    createdAt: value[0].createdAt,
    remarks: value[0].remarks,
    materialData: value
  }));
};

const PTPRReceipt = () => {
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
  const { data, count } = useMemo(
    () => ({
      data:
        groupByRequisionNumber(transactionRequest?.requestDetails?.rows).map((item, index) => ({
          ...item,
          receiptStatus: getRequestStatus(item?.materialData[0]),
          serialNumber: (pageIndex * pageSize - pageSize + index + 1).toString(),
          projectSiteStore: item.materialData?.filter((stlItme) => stlItme.quantity < 0)?.[0]?.organization_store?.name,
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

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);

  const transactionTypeId = fetchTransactionType(lovsData, 'PTPR');

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
  }, [dispatch, transactionId, pageIndex, pageSize, lovsData, transactionTypeId, searchStringTrimmed, sort, accessorsRef, forceSearch]);

  return (
    <>
      {previewAction !== 'closed' && (
        <ReceiptPreview
          fetchFromRoute="/ptpr-receipt"
          apiQuery={{
            referenceDocumentNumber: selectedReferenceDocumentNumber,
            transactionTypeId: data?.[selectedBlockIndex]?.transactionTypeId,
            toStoreId: getStore(data?.[selectedBlockIndex])
          }}
          previewAction={previewAction}
          onClose={closeModal}
          fileNameForDownload={selectedReferenceDocumentNumber}
        />
      )}

      <TableForm
        title="PTPR Receipt"
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
          tableName: 'ptpr_receipt',
          apiQuery: { transactionTypeId }
        }}
      />
    </>
  );
};

export default PTPRReceipt;
