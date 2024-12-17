import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getMasterMakerLov, getDropdownProjects } from '../../../store/actions';
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

const CreateNewCancelLtl = () => {
  const [reqLTLData, setReqLTLData] = useState([]);
  const [reqNegativeLTLData, setReqNegativeLTLData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [response, setResponse] = useState([]);
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
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELLTL');

  const { handleSubmit } = methods;

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqLTLData([]);
    setResponse(undefined);
    navigate('/cancel-ltl');
  };

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
    reqNegativeLTLData.map((stockData) => {
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
      transactionCreatedAt: reqLTLData[0]?.createdAt,
      fromStoreLocationId: reqLTLData[0]?.storeLocationId,
      ltlIds: getIds(response),
      ltlLedgerDetailId: reqLTLData?.[0]?.stock_ledger_detail?.id,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();
    const resp = await request('/cancel-ltl-transaction-create', { method: 'POST', body: req });

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
    setReqLTLData(response.filter((item) => item.quantity > 0));
    setReqNegativeLTLData(response.filter((item) => item.quantity < 0).map((item) => ({ ...item, quantity: Math.abs(item.quantity) })));
  }, [response]);

  return (
    <>
      {pending && <Loader />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel LTL(Location To Location)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="LTL"
            fromStoreLabel="Organization Store"
            showOrgType
            showFromStoreAddress
            disableAll={!!response?.length}
            setReqData={setResponse}
          />

          {reqLTLData && reqLTLData.length > 0 && (
            <>
              <TableForm
                title={'Cancel LTL'}
                hideHeader
                hidePagination
                data={reqLTLData?.filter((val) => val.quantity > 0)}
                count={reqLTLData.length}
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

export default CreateNewCancelLtl;
