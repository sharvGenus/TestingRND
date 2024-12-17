import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { Box, Button, Grid, IconButton, Tooltip } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getMasterMakerLov, getDetailsByRefNoThird } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const Actions = ({ values, onEdit, index }) => {
  return (
    <div>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values, index)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func,
  index: PropTypes.number
};

const CreateNewCancelReturnMRN = () => {
  const [response, setResponse] = useState(null);
  const [reqReturnMRNData, setReqReturnMRNData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape()),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELMRN');
  const transactionTypeId2 = fetchTransactionType(transactionTypeData, 'CANCELRETURNMRN');
  const mrnTransactionTypeId = fetchTransactionType(transactionTypeData, 'MRN');

  const { refDataThird } = useStockLedger();
  const { responseReq } = useMemo(
    () => ({
      responseReq: refDataThird?.refDataThirdObject?.rows || [],
      count: refDataThird?.refDataThirdObject?.count || 0
    }),
    [refDataThird]
  );

  const { handleSubmit } = methods;

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqReturnMRNData([]);
    setResponse(null);
    navigate('/cancel-mrn');
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

  useEffect(() => {
    if (reqReturnMRNData && reqReturnMRNData.length > 0) {
      dispatch(
        getDetailsByRefNoThird({
          transactionTypeId: mrnTransactionTypeId,
          referenceDocumentNumber: reqReturnMRNData?.[0]?.requestNumber,
          storeId:
            reqReturnMRNData[0]?.otherStoreId && reqReturnMRNData[0]?.otherStoreId !== null
              ? reqReturnMRNData[0]?.otherStoreId
              : reqReturnMRNData[0]?.stock_ledger_detail?.toStoreId,
          projectId: reqReturnMRNData[0]?.projectId
        })
      );
    }
  }, [reqReturnMRNData, dispatch, mrnTransactionTypeId]);

  const filterData = responseReq;

  const getIds = (arr) => {
    let rspArr = [];
    arr && arr.length > 0 && arr.map((vl) => rspArr.push(vl.id));
    return rspArr;
  };

  const makeRequest = () => {
    const returnMrnStockLedgerArray = [];
    const mrnStockLedgerArray = [];

    reqReturnMRNData.map((stockData) => {
      returnMrnStockLedgerArray.push({
        transactionTypeId: transactionTypeId2,
        projectId: stockData?.projectId,
        requestNumber: stockData?.referenceDocumentNumber,
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

    filterData.map((stockData) => {
      mrnStockLedgerArray.push({
        transactionTypeId: transactionTypeId,
        projectId: stockData?.projectId,
        requestNumber: stockData?.referenceDocumentNumber,
        organizationId: stockData?.organizationId,
        storeId: stockData?.storeId,
        storeLocationId: stockData?.storeLocationId,
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
      transactionTypeId: transactionTypeId2,
      returnMrnTxnCreatedAt: reqReturnMRNData?.[0]?.createdAt,
      returnMrnIds: [...getIds(reqReturnMRNData)],
      returnMrnDetailId: reqReturnMRNData[0]?.stock_ledger_detail?.id,
      mrnIds: [...getIds(filterData)],
      mrnDetailId: filterData[0]?.stock_ledger_detail?.id,
      mrn_stock_ledgers: mrnStockLedgerArray,
      returnmrn_stock_ledgers: returnMrnStockLedgerArray
    };
    return stockLedgerDetails;
  };

  const positiveQuantity = reqReturnMRNData.map((x) => ({
    ...x,
    quantity: Math.abs(x.quantity)
  }));

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();

    const resp = await request('/cancel-return-mrn', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;
    const referenceDocNo = resp?.data?.referenceDocNo;

    toast(
      referenceDocumentNumber
        ? `Transaction cancelled with reference number: ${referenceDocumentNumber}`
        : (referenceDocNo &&
            `Transaction cancelled with reference numbers ${referenceDocNo.CANCELMRN} and ${referenceDocNo.CANCELRETURNMRN}`) ||
            'Transaction cancelled successfully!',
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
    setReqReturnMRNData(response);
  }, [response]);

  return (
    <>
      {pending && <Loader />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel RETURN MRN(Return Material Return Note)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="RETURNMRN"
            fromStoreLabel="Company Store"
            fromStoreType="COMPANY"
            showFromStoreAddress
            disableAll={!!response?.length}
            setReqData={setResponse}
            setProjectId={() => {}}
          />
          {response && response.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <TableForm
                title={'Cancel RETURNMRN'}
                hideHeader
                hidePagination
                data={positiveQuantity}
                count={reqReturnMRNData.length}
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

export default CreateNewCancelReturnMRN;
