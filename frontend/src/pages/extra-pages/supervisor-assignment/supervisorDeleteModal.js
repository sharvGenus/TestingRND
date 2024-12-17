import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField } from 'hook-form';
import request from 'utils/request';

export const SupervisorDeleteModal = ({ refreshPagination, deleteId, setOpenDeleteModal, fetchUsers }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        dateTo: Validations.other
      })
    ),
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue('dateTo', new Date().toISOString().slice(0, 10));
  }, [setValue]);

  const onFormSubmit = async (values) => {
    values.isActive = '0';
    let response = await request('/supervisor-assignments-update', { method: 'PUT', body: values, params: deleteId });
    if (response.success) {
      methods.reset();
      fetchUsers();
      setOpenDeleteModal(false);
      refreshPagination();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          Delete Supervisor Assignment
        </Grid>
        <Grid item md={12}>
          <RHFTextField name="dateTo" label="Deletion Date" type="date" required={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button size="small" variant="outlined" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button size="small" type="submit" variant="contained">
            Delete
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

SupervisorDeleteModal.propTypes = {
  refreshPagination: PropTypes.func,
  deleteId: PropTypes.string,
  setOpenDeleteModal: PropTypes.func,
  fetchUsers: PropTypes.func
};
