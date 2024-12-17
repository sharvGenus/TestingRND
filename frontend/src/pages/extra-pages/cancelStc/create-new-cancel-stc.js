import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import {
  getMasterMakerLov,
  getDropdownProjects,
  getOrganizationStores,
  getDropdownOrganization,
  getOrganizationStoresSecond
} from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const CreateNewCancelStc = () => {
  const [reqUtilityData, setReqUtilityData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [response, setResponse] = useState();
  const [reqUtilityDataNegative, setReqUtilityDataNegative] = useState();
  const [pending, setPending] = useState(false);
  const [storeId, setStoreId] = useState(null);

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
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELSTC');
  const customerId = fetchTransactionType(transactionTypeData, 'CUSTOMER');
  const cutomerStoreId = fetchTransactionType(transactionTypeData, 'CUSTOMER');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (companyId) dispatch(getOrganizationStores({ organizationType: companyId }));
  }, [dispatch, companyId]);
  useEffect(() => {
    if (customerId) dispatch(getDropdownOrganization(customerId));
  }, [dispatch, customerId]);
  useEffect(() => {
    if (cutomerStoreId) dispatch(getOrganizationStoresSecond({ organizationType: cutomerStoreId }));
  }, [dispatch, cutomerStoreId]);

  const { handleSubmit, setValue } = methods;

  const organizationName = reqUtilityData?.[0]?.organization?.name;
  const organizationStoreName = reqUtilityData?.[0]?.organization_store?.name;

  useEffect(() => {
    if (!organizationStoreName?.length) return;
    setValue('fromStore', organizationStoreName);
  }, [organizationStoreName, setValue]);

  useEffect(() => {
    if (!organizationName?.length) return;
    setValue('customerId', organizationName);
  }, [organizationName, setValue]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    reqUtilityData && handleSetValues(reqUtilityData);
  }, [reqUtilityData, setValue]);

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqUtilityData([]);
    setReqUtilityDataNegative([]);
    setResponse(undefined);
    navigate('/cancel-utility');
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
    const creditStockLedgerArray = [];
    const debitStockLedgerArray = [];
    reqUtilityDataNegative.map((stockData) => {
      creditStockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        requestNumber: stockData?.referenceDocumentNumber,
        projectId: stockData.projectId,
        organizationId: stockData?.organizationId,
        storeId: stockData?.storeId,
        storeLocationId: stockData?.storeLocationId,
        otherStoreId: stockData?.otherStoreId,
        otherStoreLocationId: stockData?.otherStoreLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        quantity: Math.abs(stockData.quantity),
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax,
        serialNumber: createSerialNumbers(stockData.material_serial_numbers)
      });
    });

    reqUtilityData.map((stockData) => {
      debitStockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        requestNumber: stockData?.referenceDocumentNumber,
        projectId: stockData?.projectId,
        organizationId: stockData?.organizationId,
        storeId: stockData?.storeId,
        storeLocationId: stockData?.storeLocationId,
        otherStoreId: stockData?.otherStoreId,
        otherStoreLocationId: stockData?.otherStoreLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        quantity: stockData.quantity > 0 ? -stockData.quantity : stockData.quantity,
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax,
        serialNumber: createSerialNumbers(stockData.material_serial_numbers)
      });
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      transactionCreatedAt: reqUtilityData[0]?.createdAt,
      stcIds: getIds(response),
      stcLedgerDetailId: reqUtilityData?.[0]?.stock_ledger_detail?.id,
      credit_stock_ledgers: creditStockLedgerArray,
      debit_stock_ledgers: debitStockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async (values) => {
    setPending(true);
    const req = makeRequest(values);
    const resp = await request('/cancel-utility', { method: 'POST', body: req, timeoutOverride: 120000 });

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
    setReqUtilityData(response.filter((item) => item.quantity > 0 && item.otherStoreId === storeId));
    setReqUtilityDataNegative(
      response
        .filter((item) => item.quantity < 0 && item.storeId === storeId)
        .map((item) => ({ ...item, quantity: Math.abs(item.quantity) }))
    );
  }, [response, storeId]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel STC(Store to Customer)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="STC"
            fromStoreLabel="Company Store"
            fromStoreType="COMPANY"
            showFromStoreAddress
            ignoreStoreId
            disableAll={!!response?.length}
            setReqData={setResponse}
            setFromStoreId={setStoreId}
          />

          {response && response.length > 0 && (
            <>
              <Grid container spacing={4} alignItems="center" sx={{ mb: 2, mt: 1 }}>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="customerId" label="Customer" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="fromStore" label="Customer Site Store" disabled />
                </Grid>
              </Grid>
              <TableForm
                title={'Cancel STC'}
                hideHeader
                hidePagination
                data={reqUtilityData}
                count={reqUtilityData.length}
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
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default CreateNewCancelStc;
