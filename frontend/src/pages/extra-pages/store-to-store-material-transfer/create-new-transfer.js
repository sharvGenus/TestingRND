import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import ApproverRemarks from 'components/ApproverRemarks';

const CreateNewMaterialTransferToStore = ({ reqSTRData, setFormData, disableAll, setDisableAll }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        transporterName: Validations.inventoryNameOptional,
        transporterContactNumber: Validations.mobileNumberOptional,
        vehicleNumber: Validations.vehicleNumberOptional,
        invoiceDate: Validations.date
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const transactionTypeId = 'fadec802-92aa-4127-8ba1-e3d9b6bd4936';
  const strTransactionTypeId = 'ba23b5a7-2ed1-44f6-a673-c924cae9ba8a';
  const [storeData, setStoreData] = useState([]);

  const selectBox = (name, label, menus, onChange, req, disabled) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          disable={disabled}
          {...(typeof onChange === 'function' && { onChange: onChange })}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(disableAll && { disable: true })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true, disabled, handleChange) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          disabled={disabled}
          InputLabelProps={{ shrink: shrink }}
          {...(typeof handleChange === 'function' && { handleChange: handleChange })}
          {...(disableAll && { disabled: true })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const onInitialSubmit = (values) => {
    setDisableAll(true);
    values['transactionTypeId'] = transactionTypeId;
    values['strTransactionTypeId'] = strTransactionTypeId;
    setFormData(values);
  };

  useEffect(() => {
    if (reqSTRData && reqSTRData.length > 0) {
      setValue('storeId', reqSTRData?.[0]?.toStoreId);
      setValue('invoiceDate', reqSTRData?.[0]?.createdAt.split('T')[0]);
      setStoreData([reqSTRData?.[0]?.to_store]);
    }
  }, [reqSTRData, setValue]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={4}>
        {reqSTRData && reqSTRData.length > 0 && (
          <>
            <Grid item md={3} xl={2}>
              {selectBox('storeId', 'Place Of Transfer', storeData, undefined, true, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('invoiceDate', 'Invoice Date', 'date', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('transporterName', 'Transporter Name', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('transporterContactNumber', 'Contact Number', 'number', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('vehicleNumber', 'Vehicle Number', 'text', false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('lrNumber', 'LR Number', 'text')}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('placeOfSupply', 'Place Of Supply', 'text', false, false)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
            <Grid item md={3} xl={4}>
              <ApproverRemarks data={reqSTRData} />
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                {!disableAll && (
                  <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                    Next
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 3, mb: 3 }}>
              <Grid item md={12} xl={12}>
                <Divider />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </FormProvider>
  );
};

CreateNewMaterialTransferToStore.propTypes = {
  setFormData: PropTypes.func,
  reqSTRData: PropTypes.object,
  disableAll: PropTypes.bool,
  setDisableAll: PropTypes.func
};

export default CreateNewMaterialTransferToStore;
