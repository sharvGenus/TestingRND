import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { PAGINATION_CONST } from '../../../constants';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const CreateNewCancelPTP = () => {
  const [reqPTPData, setReqPTPData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [response, setResponse] = useState(null);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape()),
    defaultValues: {},
    mode: 'all'
  });

  const transactionTypeId = 'd4b6ec03-9614-4ed1-ad27-b08b1afed817'; //Cancel PTP

  const { handleSubmit } = methods;

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqPTPData([]);
    setResponse(undefined);
    navigate('/stock-ledger');
  };

  const subColumns = useMemo(
    () => [
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
    ],
    []
  );

  const createSerialNumbers = (arr) => {
    if (arr && arr.length > 0) {
      let resp = arr.map((val) => val.serialNumber);
      return resp;
    } else return [];
  };

  const getIds = (arr) => {
    let rspArr = [];
    arr && arr.length > 0 && arr.map((vl) => rspArr.push(vl.id));
    return rspArr;
  };

  const makeRequest = () => {
    const stockLedgerArray = [];
    reqPTPData.map((stockData) => {
      stockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        projectId: stockData.projectId,
        requestNumber: stockData.referenceDocumentNumber,
        organizationId: stockData?.organizationId,
        storeId: stockData.storeId,
        storeLocationId: stockData.storeLocationId,
        otherProjectId: stockData?.otherProjectId,
        otherStoreId: stockData?.otherStoreId,
        otherStoreLocationId: stockData?.otherStoreLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        quantity: stockData.quantity < 0 ? -stockData.quantity : stockData.quantity,
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax,
        serialNumber: createSerialNumbers(stockData.material_serial_numbers)
      });
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      stoIds: getIds(reqPTPData),
      stoLedgerDetailId: reqPTPData?.[0]?.stock_ledger_detail?.id,
      stock_ledgers: stockLedgerArray
    };

    return stockLedgerDetails;
  };

  const onFormSubmit = async (values) => {
    setPending(true);
    const req = makeRequest(values);
    const resp = await request('/cancel-sto-transaction-create', { method: 'POST', body: req });

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
    setReqPTPData(response);
  }, [response]);

  const positiveQuantityData = reqPTPData.map((x) => ({
    ...x,
    quantity: Math.abs(x.quantity)
  }));

  return (
    <>
      {pending && <Loader />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel PTP(Project To Project)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="PTP"
            fromStoreLabel="Company Store"
            fromStoreType="COMPANY"
            showFromStoreAddress
            disableAll={!!response?.length}
            setReqData={setResponse}
            getNegativeOnly
          />

          {response && response.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <TableForm
                title={'Cancel STO'}
                hideHeader
                hidePagination
                data={positiveQuantityData}
                count={reqPTPData.length}
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

export default CreateNewCancelPTP;
