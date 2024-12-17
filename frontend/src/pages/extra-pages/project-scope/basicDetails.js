import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';

const BasicDetails = ({ basicData }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const text = (name, label, type, required, disabled) => {
    return (
      <Grid item md={3} xl={3}>
        <RHFTextField name={name} label={label} type={type} required={required} InputLabelProps={{ shrink: true }} disabled={disabled} />
      </Grid>
    );
  };

  const { setValue } = methods;

  useEffect(() => {
    Object.entries(basicData).forEach(([fieldName, value]) => {
      if (fieldName.includes('Date')) setValue(fieldName, value?.split('T')[0]);
      else setValue(fieldName, value);
    });
  }, [basicData, setValue]);

  const basicDetails = () => {
    return (
      <>
        <FormProvider methods={methods}>
          <Grid container spacing={3}>
            {text('company.name', 'Company Name', 'text', false, true)}
            {text('customer.name', 'Customer Name', 'text', false, true)}
            {text('name', 'Project Name', 'text', false, true)}
            {text('schemeName', 'Scheme Name', 'text', false, true)}
            {text('code', 'Code', 'text', false, true)}
            {text('poWorkOrderNumber', 'PO Work Order Number', 'text', false, true)}
            {text('poStartDate', 'PO Start Date', 'date', false, true)}
            {text('closureDate', 'Contract Signed Date', 'date', false, true)}
            {text('poEndDate', 'PO End Date', 'date', false, true)}
            {text('fmsStartDate', 'FMS Start Date', 'date', false, true)}
            {text('fmsYears', 'FMS (months)', 'text', false, true)}
            {text('fmsEndDate', 'FMS End Date', 'date', false, true)}
          </Grid>
        </FormProvider>
      </>
    );
  };

  return <>{basicDetails()}</>;
};

BasicDetails.propTypes = {
  basicData: PropTypes.object
};

export default BasicDetails;
