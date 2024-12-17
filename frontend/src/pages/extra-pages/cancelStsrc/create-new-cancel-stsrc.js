import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getMasterMakerLov, getDropdownProjects } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';
import { parseAddressFromObject } from 'utils';

const CreateNewCancelStsrc = () => {
  const [reqStsrcData, setReqStsrcData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [response, setResponse] = useState();
  const [reqStsrcDataNegative, setReqStsrcDataNegative] = useState();
  const [pending, setPending] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [supplierAddress, setSupplierAddress] = useState('');

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
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELSTSRC');

  const { handleSubmit, setValue } = methods;

  const organizationName = reqStsrcData?.[0]?.organization?.name;
  const organizationStoreName = reqStsrcData?.[0]?.organization_store?.name;

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
    reqStsrcData && handleSetValues(reqStsrcData);
  }, [reqStsrcData, setValue]);

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqStsrcData([]);
    setReqStsrcDataNegative([]);
    setResponse(undefined);
    navigate('/cancel-stsrc');
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
    reqStsrcDataNegative.map((stockData) => {
      stockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        projectId: stockData.projectId,
        requestNumber: stockData.referenceDocumentNumber,
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
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      transactionCreatedAt: reqStsrcData[0]?.createdAt,
      fromStoreLocationId: reqStsrcData[0]?.storeLocationId,
      ltlIds: getIds(response),
      ltlLedgerDetailId: reqStsrcData?.[0]?.stock_ledger_detail?.id,
      supplierId: reqStsrcData?.[0]?.stock_ledger_detail?.supplier?.id,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async (values) => {
    setPending(true);
    const req = makeRequest(values);
    const resp = await request('/cancel-ltl-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

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
    setReqStsrcData(response.filter((item) => item.quantity > 0 && item.otherStoreId === storeId));
    setReqStsrcDataNegative(
      response
        .filter((item) => item.quantity < 0 && item.storeId === storeId)
        .map((item) => ({ ...item, quantity: Math.abs(item.quantity) }))
    );
  }, [response, storeId]);

  useEffect(() => {
    if (response) {
      setSupplierAddress(parseAddressFromObject(response?.[0]?.stock_ledger_detail?.supplier));
      setValue('supplierId', response?.[0]?.stock_ledger_detail?.supplier?.id);
      setValue('supplier', response?.[0]?.stock_ledger_detail?.supplier?.name);
      setValue('serviceCenterLocationId', response?.[0]?.other_store_location?.id);
      setValue('serviceCenterLocationName', response?.[0]?.other_store_location?.name);
    }
  }, [response, setValue]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel STSRC(Store to Supplier Repair Center)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="STSRC"
            fromStoreLabel="Organization Store"
            fromStoreType=""
            showFromStoreAddress
            showOrgType
            disableAll={!!response?.length}
            setReqData={setResponse}
            setFromStoreId={setStoreId}
          />

          {response && response.length > 0 && (
            <>
              <Grid container spacing={4} alignItems="center" sx={{ mb: 4, mt: 1 }}>
                <Grid item md={3} xl={2} sx={{ display: 'none' }}>
                  <RHFTextField name="supplierId" label="SupplierId" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="supplier" label="Supplier" disabled />
                </Grid>
                <Grid item md={9} xl={10}>
                  <Typography>Address: </Typography>
                  <Typography mt={2}>{supplierAddress}</Typography>
                </Grid>
                <Grid item md={3} xl={2} sx={{ display: 'none' }}>
                  <RHFTextField name="serviceCenterLocationId" label="Service Center Location Id" disabled />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="serviceCenterLocationName" label="Service Center Location" disabled />
                </Grid>
              </Grid>
              <TableForm
                title={'Cancel STSRC'}
                hideHeader
                hidePagination
                data={reqStsrcData}
                count={reqStsrcData.length}
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

export default CreateNewCancelStsrc;
