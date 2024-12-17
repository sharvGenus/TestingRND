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
import { getMasterMakerLov, getSerialNumbers } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import { removeUndefinedOrNullFromObject } from 'utils';
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

const CreateNewCancelMRR = () => {
  const [reqMRRData, setReqMRRData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [toStoreId, setToStoreId] = useState(null);
  const [response, setResponse] = useState(null);
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
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELMRR');
  const mrrTransactionTypeId = fetchTransactionType(transactionTypeData, 'MRR');

  const { handleSubmit } = methods;

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqMRRData([]);
    setResponse(undefined);
    navigate('/cancel-mrr');
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
        Header: 'Requested Quantity',
        accessor: 'requestedQuantity'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      }
    ],
    []
  );

  const makeRequest = () => {
    const stockLedgerArray = [];
    const requestIds = [];
    reqMRRData.map((stockData) => {
      requestIds.push(stockData.id);
    });
    reqMRRData.map((stockData) => {
      stockLedgerArray.push({
        requestIds: requestIds,
        requestName: 'MRR',
        transactionTypeId: transactionTypeId,
        requestTransactionTypeId: mrrTransactionTypeId,
        requestOrganizationId: requestOrganizationId,
        requestStoreId: stockData.fromStoreId,
        requestNumber: stockData.referenceDocumentNumber,
        projectId: stockData.projectId,
        fromStoreId: stockData.fromStoreId,
        fromStoreLocationId: stockData.fromStoreLocationId,
        toStoreId: toStoreId,
        toStoreLocationId: stockData.toStoreLocationId,
        materialId: stockData.materialId,
        uomId: stockData.uomId,
        requestedQuantity: stockData.requestedQuantity,
        approvedQuantity: stockData.approvedQuantity || 0,
        rate: stockData.rate || 0,
        value: stockData.value || 0,
        tax: stockData.tax || 0,
        serialNumbers: stockData.serialNumbers,
        vehicleNumber: stockData.vehicleNumber,
        remarks: stockData.remarks
      });
    });

    return { payload: removeUndefinedOrNullFromObject(stockLedgerArray) };
  };

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();
    const resp = await request('/cancel-request-create', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(
      referenceDocumentNumber ? `Request cancelled with reference number: ${referenceDocumentNumber}` : 'Request cancelled successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/stock-ledger');
  };

  useEffect(() => {
    if (!response) return;
    setReqMRRData(response);
    dispatch(getSerialNumbers({ project: response[0]?.projectId, store: response[0]?.fromStoreId }));
  }, [dispatch, response]);

  return (
    <>
      {pending && <Loader />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Cancel MRR (Material Return Request)'} sx={{ mb: 2 }}>
          <CancelTransactionRequestDropdownSection
            type="request"
            transactionType="MRR"
            disableAll={!!response?.length}
            setReqData={setResponse}
            showToStoreDropdown
            showFromStoreAddress
            showToStoreAddress
            fromStoreType="CONTRACTOR"
            toStoreType="COMPANY"
            setFromStoreId={setToStoreId}
            fromStoreLabel="Contractor Store"
            toStoreLabel="Company Store"
            setFromOrganizationId={setRequestOrganizationId}
          />

          {response?.length && (
            <Box sx={{ mt: 4 }}>
              <TableForm
                title={'Cancel MRR'}
                hideHeader
                hidePagination
                data={reqMRRData}
                count={reqMRRData.length}
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

export default CreateNewCancelMRR;
