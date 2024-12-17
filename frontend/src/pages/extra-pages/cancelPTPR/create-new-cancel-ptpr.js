import { PAGINATION_CONST } from 'constants';
import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { getDropdownProjects, getMasterMakerLov, getMaterial, getOrganizationStores } from '../../../store/actions';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import CancelTransactionRequestDropdownSection from 'components/sections/CancelTransactionRequestNumber';
import Loader from 'components/Loader';

const CreateNewCancelPTPR = () => {
  const navigate = useNavigate();
  const [reqPTPRData, setReqPTPRData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const [response, setResponse] = useState();
  const [pending, setPending] = useState(false);

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMaterial());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  const {
    masterMakerLovs: {
      masterMakerLovsObject: { rows: transactionTypeData }
    }
  } = useMasterMakerLov();

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELPTPR');
  const ptprTransactionTypeId = fetchTransactionType(transactionTypeData, 'PTPR');
  const organizationTypeId = fetchTransactionType(transactionTypeData, 'COMPANY');
  useEffect(() => {
    organizationTypeId && dispatch(getOrganizationStores({ organizationType: organizationTypeId }));
  }, [dispatch, organizationTypeId]);

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

  const onBack = () => {
    setShowAdd(!showAdd);
    setReqPTPRData([]);
    setResponse(undefined);
    navigate('/cancel-ptpr');
  };

  const makeRequest = () => {
    const requestIds = [];
    reqPTPRData.map((stockData) => {
      requestIds.push(stockData.id);
    });
    const stockLedgerArray = reqPTPRData.map((stockData) => ({
      requestIds: requestIds,
      requestName: 'PTPR',
      transactionTypeId: transactionTypeId,
      requestTransactionTypeId: ptprTransactionTypeId,
      requestOrganizationId: requestOrganizationId,
      requestStoreId: stockData.fromStoreId,
      requestNumber: stockData.referenceDocumentNumber,
      projectId: stockData.projectId,
      fromStoreId: stockData.fromStoreId,
      fromStoreLocationId: stockData.fromStoreLocationId,
      toProjectId: stockData.toProjectId,
      toStoreId: stockData.toStoreId,
      toStoreLocationId: stockData.toStoreLocationId,
      materialId: stockData.materialId,
      uomId: stockData.uomId,
      requestedQuantity: stockData.requestedQuantity,
      approvedQuantity: stockData.approvedQuantity || 0,
      rate: stockData.rate,
      value: stockData.value,
      tax: stockData.tax,
      serialNumbers: stockData.serialNumbers,
      vehicleNumber: stockData.vehicleNumber,
      remarks: stockData.remarks
    }));
    return { payload: stockLedgerArray };
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
  const selectBox = (name, label, menus, req, disabled, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          {...(typeof onChange === 'function' && { onChange: onChange })}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          disable={disabled}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  useEffect(() => {
    if (!response?.length) return;
    setReqPTPRData(response);
  }, [response]);

  const toProjectData = useMemo(() => (response?.[0]?.to_project ? [response?.[0]?.to_project] : []), [response]);

  useEffect(() => {
    if (!toProjectData?.length) return;

    setValue('toProjectId', toProjectData?.[0]?.id);
  }, [setValue, toProjectData]);

  return (
    <>
      {pending && <Loader />}
      <MainCard title={'Cancel PTPR'} sx={{ mb: 2 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ mb: 4 }}>
            <CancelTransactionRequestDropdownSection
              type="request"
              transactionType="PTPR"
              fromStoreType="COMPANY"
              disableAll={!!response?.length}
              setReqData={setResponse}
              fromStoreLabel="Company Store"
              setFromOrganizationId={setRequestOrganizationId}
              showFromStoreAddress
            />
          </Box>

          {response && response.length > 0 && (
            <>
              <Grid container spacing={4} sx={{ mb: 2 }}>
                <Grid item md={3} xl={2}>
                  {selectBox('toProjectId', 'To Project', toProjectData, true, true)}
                </Grid>
              </Grid>
              <>
                <TableForm
                  title={'Cancel PTPR'}
                  hideHeader
                  hidePagination
                  data={reqPTPRData}
                  count={reqPTPRData.length}
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
            </>
          )}
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewCancelPTPR.propTypes = {
  onClick: PropTypes.func,
  getMaterialList: PropTypes.any,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  saveData: PropTypes.func
};

export default CreateNewCancelPTPR;
