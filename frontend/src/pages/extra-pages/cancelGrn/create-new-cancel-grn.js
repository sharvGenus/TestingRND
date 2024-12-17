import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getMasterMakerLov, getDropdownProjects, getOrganizationStores } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const subColumns = [
  {
    Header: 'Name',
    accessor: 'material.name'
  },
  {
    Header: 'Code',
    accessor: 'material.code'
  },
  {
    Header: 'Quantity',
    accessor: 'quantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  }
];

const CreateNewCancelGRN = () => {
  const [storeId, setStoreId] = useState(null);
  const [reqGRNData, setReqGRNData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [response, setResponse] = useState();
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELGRN');
  const grnTransactionTypeId = fetchTransactionType(transactionTypeData, 'GRN');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  useEffect(() => {
    if (companyId) dispatch(getOrganizationStores({ organizationType: companyId }));
  }, [dispatch, companyId]);
  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    reqGRNData && handleSetValues(reqGRNData);
  }, [reqGRNData, setValue]);

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqGRNData([]);
    setResponse(undefined);
    navigate('/cancel-grn');
  };

  const makeRequest = () => {
    const stockLedgerArray = [];
    const ledgerIds = [];
    reqGRNData.map((stockData) => {
      ledgerIds.push(stockData.id);
      stockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        projectId: stockData.projectId,
        requestNumber: stockData.referenceDocumentNumber,
        organizationId: stockData?.organizationId,
        storeId: storeId,
        storeLocationId: stockData?.storeLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        quantity: stockData.quantity,
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax
      });
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      requestTransactionTypeId: grnTransactionTypeId,
      toOrganizationId: requestOrganizationId,
      requestNumber: reqGRNData[0]?.referenceDocumentNumber,
      projectId: reqGRNData[0].projectId,
      storeId: storeId,
      transactionCreatedAt: reqGRNData[0].createdAt,
      remarks: reqGRNData[0].remarks,
      grnLedgerDetailId: reqGRNData[0]?.stock_ledger_detail?.id,
      grnIds: ledgerIds,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();
    const resp = await request('/cancel-grn-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(
      referenceDocumentNumber
        ? `Transaction cancelled with reference number: ${referenceDocumentNumber}`
        : 'Transaction cancelled successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/stock-ledger');
  };

  useEffect(() => {
    if (!response?.length) return;
    setReqGRNData(response);
  }, [response]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel GRN(Goods Receive Note)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="GRN"
            fromStoreLabel="Company Store"
            fromStoreType="COMPANY"
            showFromStoreAddress
            setFromStoreId={setStoreId}
            setFromOrganizationId={setRequestOrganizationId}
            disableAll={!!response?.length}
            setReqData={setResponse}
          />

          {response && response.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <TableForm
                title={'Cancel GRN'}
                hideHeader
                hidePagination
                data={reqGRNData}
                count={reqGRNData.length}
                columns={subColumns}
                hideActions={true}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
              <Grid item md={12} xl={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button onClick={onBack} size="small" variant="outlined" color="primary">
                    Back
                  </Button>
                  <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                    Reverse
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default CreateNewCancelGRN;
