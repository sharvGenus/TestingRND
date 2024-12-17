import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProjects } from '../project/useProjects';
import MaterialInputs from './material-input';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import { getDropdownProjects } from 'store/actions';
import { numberToWords } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import Validations from 'constants/yupValidations';

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: true,
    multiple: true
  }
];

const BillSubmission = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState(null);
  const [update, setUpdate] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newData, setNewData] = useState([]);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        invoiceNumber: Validations.invoiceNumber,
        invoiceDate: Validations.date,
        workOrder: Validations.workOrderNumber,
        bankName: Validations.bankName,
        ifscCode: Validations.ifscCode,
        accountNumber: Validations.accountNumber
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset } = methods;
  useEffect(() => {
    setValue('totalAmount', Math.round(totalAmount));
    setValue('totalAmountWord', numberToWords(Math.round(totalAmount)));
  }, [totalAmount, setValue]);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);
  const {
    projectsDropdown: { projectsDropdownObject: projectData }
  } = useProjects();

  const onFormSubmit = async (values) => {
    values.billing_material_details = newData;
    let response;
    values = preparePayloadForFileUpload(values, tasks);

    if (update) {
      response = await request('/bill-submissions-update', { method: 'PUT', body: values });
    } else {
      response = await request('/bill-submissions-create', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Bill updated successfully!' : 'Bill created successfully!';
      navigate('/bill-submission');
      newData.length = 0;
      reset();
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Bill Submission'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" menus={projectData || []} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="invoiceNumber" label="Invoice Number" type="text" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="invoiceDate" label="Invoice Date" type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="workOrder" label="Work Order" type="text" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="bankName" label="Bank Name" type="text" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="ifscCode" label="IFSC CODE" type="text" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="accountNumber" label="Account Number" type="text" InputLabelProps={{ shrink: true }} required />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={2} xl={2} mt={3}>
            <Typography variant="h4">Material Details</Typography>
          </Grid>
          <MaterialInputs setTotalAmount={setTotalAmount} setUpdate={setUpdate} update={update} setNewData={setNewData} newData={newData} />
          <Grid container spacing={4} flexDirection="row-reverse">
            <Grid item md={5} xl={5} mt={1}>
              <Grid container spacing={1}>
                <Grid item md={6} xl={6} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ p: 1, mt: 1.5, ml: '59px' }}>Total Amount</Typography>
                </Grid>
                <Grid item md={6} xl={6}>
                  <RHFTextField name="totalAmount" type="number" InputLabelProps={{ shrink: true }} disabled={true} />
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={6} xl={6} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ p: 1, mt: 1.5 }}>Total Amount in Words</Typography>
                </Grid>
                <Grid item md={6} xl={6}>
                  <RHFTextField
                    name="totalAmountWord"
                    type="text"
                    multiline
                    InputLabelProps={{ shrink: true, 'margin-left': '59px' }}
                    disabled={true}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 1, ml: 2 }}>
              <Grid item md={6} xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <FileSections fileFields={fileFields} tasks={tasks} setTasks={setTasks} setValue={setValue} />
              </Grid>
              <Grid item md={6} xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mb: '15px' }}>
                <Button type="submit" size="small" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

export default BillSubmission;
