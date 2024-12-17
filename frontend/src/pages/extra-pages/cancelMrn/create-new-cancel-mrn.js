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
import { getMasterMakerLov } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
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

const CreateNewCancelMRN = () => {
  const [response, setResponse] = useState(null);
  const [reqMRNData, setReqMRNData] = useState([]);
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

  const { handleSubmit } = methods;

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqMRNData([]);
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

  const getIds = (arr) => {
    let rspArr = [];
    arr && arr.length > 0 && arr.map((vl) => rspArr.push(vl.id));
    return rspArr;
  };

  const makeRequest = () => {
    const stockLedgerArray = [];
    reqMRNData.map((stockData) => {
      stockLedgerArray.push({
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
      transactionTypeId: transactionTypeId,
      mrnLedgerIds: [...getIds(reqMRNData)],
      mrnLedgerDetailId: reqMRNData[0]?.stock_ledger_detail?.id,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const positiveQuantity = reqMRNData.map((x) => ({
    ...x,
    quantity: Math.abs(x.quantity)
  }));

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();

    const resp = await request('/cancel-mrn', { method: 'POST', body: req, timeoutOverride: 120000 });

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
    setReqMRNData(response);
  }, [response]);

  return (
    <>
      {pending && <Loader />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel MRN(Material Return Note)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="stockLedger"
            transactionType="MRN"
            fromStoreLabel="Contractor Store"
            fromStoreType="CONTRACTOR"
            showFromStoreAddress
            disableAll={!!response?.length}
            setReqData={setResponse}
            setProjectId={() => {}}
          />
          {response && response.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <TableForm
                title={'Cancel MRN'}
                hideHeader
                hidePagination
                data={positiveQuantity}
                count={reqMRNData.length}
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

export default CreateNewCancelMRN;
