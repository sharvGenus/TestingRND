import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField } from 'hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const ptpGrnTransactionTypeId = 'c384a987-d92c-481f-9223-605dd3d05338';

export const EditModal = ({ setOpen, rowData, title, refreshPagination, editPlaceOfSupply, grnTransactionTypeId, isPtp }) => {
  const txtBox = (name, label, type, req, placeholder, disable) => {
    return (
      <Stack spacing={1}>
        <RHFTextField name={name} type={type} label={label} placeholder={placeholder} disabled={disable} {...(req && { required: true })} />
      </Stack>
    );
  };
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        eWayBillNumber: Validations.other,
        eWayBillDate: Validations.other,
        ...(editPlaceOfSupply && { placeOfSupply: Validations.other })
      })
    ),
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  const isMin = !!grnTransactionTypeId;

  useEffect(() => {
    setValue('eWayBillNumber', rowData.eWayBillNumber ? rowData.eWayBillNumber : '');
    setValue('eWayBillDate', rowData.eWayBillDate ? rowData.eWayBillDate.split('T')[0] : '');
    if (editPlaceOfSupply) {
      setValue('placeOfSupply', rowData.placeOfSupply ? rowData.placeOfSupply : '');
    }
  }, [setValue, rowData, editPlaceOfSupply]);

  const onFormSubmit = async (values) => {
    const valuesToUpdate = {
      eWayBillNumber: values.eWayBillNumber,
      eWayBillDate: values.eWayBillDate,
      ...(editPlaceOfSupply && { placeOfSupply: values.placeOfSupply })
    };

    if (isMin) {
      // Update values in corresponding GRN on update of MIN
      const payload = {
        projectId: rowData?.stock_ledgers?.[0].projectId,
        requestNumber: rowData?.stock_ledgers?.[0].requestNumber,
        transactionTypeId: grnTransactionTypeId,
        storeId: rowData?.toStoreId
      };
      const grnTransaction = await request('/stock-ledger-list', { method: 'GET', query: payload });
      const grnTransactionId = grnTransaction?.data?.data?.rows?.[0]?.stockLedgerDetailId;
      const grnUpdateResponse = await request('/e-way-bill-update', { method: 'PUT', body: valuesToUpdate, params: grnTransactionId });
      if (!grnUpdateResponse?.success) {
        toast('There was an error updating the transaction!', { variant: 'error' });
        return;
      }
    } else if (isPtp) {
      // Update values in corresponding PTP-GRN Transaction on update of PTP
      const payload = {
        projectId: rowData?.stock_ledgers?.[0]?.other_project_id,
        requestNumber: rowData?.stock_ledgers?.[0]?.referenceDocumentNumber,
        transactionTypeId: ptpGrnTransactionTypeId,
        storeId: rowData?.stock_ledgers?.[0]?.other_store_id,
        isCancelled: false
      };
      const ptpGrnTransaction = await request('/stock-ledger-list', { method: 'GET', query: payload });
      const ptpGrnTransactionId = ptpGrnTransaction?.data?.data?.rows?.[0]?.stockLedgerDetailId;

      if (ptpGrnTransactionId) {
        // We update the PTP-GRN transaction only if it exists
        const ptpGrnUpdateResponse = await request('/e-way-bill-update', {
          method: 'PUT',
          body: valuesToUpdate,
          params: ptpGrnTransactionId
        });

        if (!ptpGrnUpdateResponse?.success) {
          toast('There was an error updating the transaction!', { variant: 'error' });
          return;
        }
      }
    }

    // Update the main transaction
    const response = await request('/e-way-bill-update', { method: 'PUT', body: valuesToUpdate, params: rowData?.id });
    if (!response?.success) {
      toast('There was an error updating the transaction!', { variant: 'error' });
      return;
    }

    methods.reset();
    setOpen(false);

    if (typeof refreshPagination === 'function') {
      refreshPagination();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          Edit {title} Receipt
        </Grid>
        <Grid item md={12}>
          {txtBox('eWayBillNumber', 'E-Way Bill Number', 'text', true)}
        </Grid>
        <Grid item md={12}>
          {txtBox('eWayBillDate', 'E-Way Bill Date', 'date', true)}
        </Grid>
        {editPlaceOfSupply && (
          <Grid item md={12}>
            {txtBox('placeOfSupply', 'Place Of Supply', 'text', true)}
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button size="small" type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

EditModal.defaultProps = {
  isPtp: false
};

EditModal.propTypes = {
  setOpen: PropTypes.func,
  rowData: PropTypes.object,
  refreshPagination: PropTypes.func,
  grnTransactionTypeId: PropTypes.string,
  transactionTypeId: PropTypes.string,
  pageIndex: PropTypes.string,
  pageSize: PropTypes.string,
  editPlaceOfSupply: PropTypes.bool,
  title: PropTypes.string,
  isPtp: PropTypes.bool
};
