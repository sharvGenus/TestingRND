import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

// material-ui
import {
  Grid,
  Button,
  Divider
  //  Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';

const EditTransactionSection = ({ data, onBack: handleBack, onSubmit: handleFinalSubmit, view }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        endDate: Validations.requiredWithLabel('End Date')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue, handleSubmit } = methods;

  const onFormSubmit = (formValues) => {
    handleFinalSubmit(formValues);
  };

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value || '');
      });
    };

    if (data) {
      handleSetValues(data);
      setValue('name', data.name && data.name !== null ? data?.name : data?.traxnsName);
      setValue('effectiveDate', data?.effectiveDate?.split('T')[0] || '');
      setValue('endDate', data?.endDate?.split('T')[0] || '');
    }
  }, [data, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="name" type="text" label="Name" InputLabelProps={{ shrink: true }} disabled required />
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="traxnsName" type="text" label="TransactionTypeIds" InputLabelProps={{ shrink: true }} disabled required />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'none' }}>
          <RHFTextField
            name="transactionTypeIds"
            type="text"
            label="TransactionTypeId"
            InputLabelProps={{ shrink: true }}
            disabled
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="startRange" type="number" label="Start Range" InputLabelProps={{ shrink: true }} disabled required />
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="endRange" type="number" label="End Range" InputLabelProps={{ shrink: true }} disabled required />
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="effectiveDate" type="date" label="Effective Date" InputLabelProps={{ shrink: true }} disabled required />
        </Grid>
        <Grid item xs={12} sm={3}>
          <RHFTextField name="endDate" type="date" label="End Date" InputLabelProps={{ shrink: true }} disabled={view} required />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Button onClick={handleBack} size="small" variant="outlined" color="primary">
            Back
          </Button>
          {!view && (
            <Button size="small" type="submit" variant="contained" color="primary">
              Update
            </Button>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

EditTransactionSection.propTypes = {
  data: PropTypes.object,
  view: PropTypes.bool,
  onSubmit: PropTypes.func,
  onBack: PropTypes.func
};

export default EditTransactionSection;
