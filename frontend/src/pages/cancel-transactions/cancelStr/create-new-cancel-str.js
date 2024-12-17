import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { FormProvider, RHFSelectbox } from 'hook-form';
import TableForm from 'tables/table';
import { fetchTransactionType, removeUndefinedOrNullFromObject } from 'utils';
import usePagination from 'hooks/usePagination';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
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
    Header: 'Requested Quantity',
    accessor: 'requestedQuantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  }
];

const CreateNewCancelSTR = ({ reqData, setReqData }) => {
  const [pending, setPending] = useState(false);
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  const { masterMakerLovs } = useMasterMakerLov();
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'CANCELSTR');
  const strTransactionTypeId = fetchTransactionType(transactionTypeData, 'STR');
  const toProjectSiteStoreData = useMemo(() => (reqData?.[0]?.to_store && [reqData?.[0]?.to_store]) || [], [reqData]);

  useEffect(() => {
    if (!toProjectSiteStoreData?.length) return;
    setValue('toProjectSiteStoreId', toProjectSiteStoreData?.[0].id);
  }, [setValue, toProjectSiteStoreData]);

  const onBack = () => {
    setReqData([]);
    navigate('./');
  };

  const makeRequest = () => {
    const requestIds = [];
    reqData.map((stockData) => {
      requestIds.push(stockData.id);
    });
    const stockLedgerArray = reqData.map((stockData) => {
      return {
        requestIds: requestIds,
        requestName: 'STR',
        transactionTypeId: transactionTypeId,
        requestNumber: stockData.referenceDocumentNumber,
        requestTransactionTypeId: strTransactionTypeId,
        requestOrganizationId: stockData?.to_store?.organization?.parentId
          ? stockData?.to_store?.organization?.parentId
          : stockData?.to_store?.organization?.id,
        requestStoreId: stockData.to_store?.id,
        projectId: stockData.projectId,
        fromStoreId: stockData.from_store?.id,
        fromStoreLocationId: stockData.fromStoreLocationId,
        toStoreId: stockData.to_store?.id,
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
      };
    });

    return { payload: removeUndefinedOrNullFromObject(stockLedgerArray) };
  };

  const onFormSubmit = async () => {
    setPending(true);
    const req = makeRequest();
    const response = await request('/cancel-request-create', { method: 'POST', body: req });

    if (!response.success) {
      toast(response?.error?.message || 'Operation failed. Please try again!', { variant: 'error', timeoutOverride: 120000 });
      setPending(false);
      return;
    }

    const data = response.data?.data ?? {};
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

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={4} alignItems="center" sx={{ mb: 2, display: 'none' }}>
          <Grid item md={3} xl={2}>
            <RHFSelectbox
              name="toProjectSiteStoreId"
              label="To Company Store"
              menus={toProjectSiteStoreData || []}
              InputLabelProps={{ shrink: true }}
              disable
              required={true}
            />
          </Grid>
        </Grid>
        <TableForm
          title={'Cancel STR'}
          hideHeader
          hidePagination
          data={reqData}
          count={reqData.length}
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
      </FormProvider>
    </>
  );
};

CreateNewCancelSTR.propTypes = {
  reqData: PropTypes.array,
  fromStoreId: PropTypes.string,
  fromOrganizationId: PropTypes.string,
  setReqData: PropTypes.func
};

export default CreateNewCancelSTR;
