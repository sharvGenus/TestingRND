import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { getFormIntegrationBlockById } from 'store/actions';
import { FormProvider, RHFTextField } from 'hook-form';
import request from 'utils/request';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';

const AddAuthForm = () => {
  const theme = useTheme();
  const [deleteObject, setDeleteObject] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [payload, setPayload] = useState([]);
  const { formId, blockId } = useParams();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        key: Validations.other,
        value: Validations.other
      })
    ),
    mode: 'all'
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'key'
      },
      {
        Header: 'Value',
        accessor: 'value'
      }
    ],
    []
  );

  useEffect(() => {
    if (blockId) {
      dispatch(getFormIntegrationBlockById(blockId));
    }
  }, [dispatch, blockId]);

  const { formIntegrationBlockById } = useDefaultFormAttributes();
  const { data } = useMemo(
    () => ({
      data: formIntegrationBlockById?.formIntegrationBlockByIdObject || []
    }),
    [formIntegrationBlockById]
  );

  const { handleSubmit } = methods;

  useEffect(() => {
    let jsonString = data?.auth;
    if (jsonString === null || jsonString === undefined || jsonString === '') {
      setPayload([]);
    } else {
      setPayload(JSON.parse(jsonString));
    }
  }, [data]);

  const onFormSubmit = async (values) => {
    if (Object.prototype.hasOwnProperty.call(values, 'key') && Object.prototype.hasOwnProperty.call(values, 'value')) {
      payload.push([values.key, values.value]);
    }
    const updatedData = structuredClone(data);
    updatedData.auth = JSON.stringify(payload);
    const response = await request('/attribute-integration-block-update', {
      method: 'PUT',
      body: updatedData,
      params: blockId
    });
    if (response.success) {
      methods.reset({
        key: '',
        value: ''
      });
      if (blockId) {
        dispatch(getFormIntegrationBlockById(blockId));
      }
    }
  };

  const handleRowDelete = (value) => {
    setDeleteObject(value);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    const updatedPayload = payload.filter((arr) => !(arr[0] === deleteObject.key && arr[1] === deleteObject.value));
    const updatedData = structuredClone(data);
    updatedData.auth = JSON.stringify(updatedPayload);
    const response = await request('/attribute-integration-block-update', {
      method: 'PUT',
      body: updatedData,
      params: blockId
    });
    if (response.success) {
      methods.reset({
        key: '',
        value: ''
      });
      if (blockId) {
        dispatch(getFormIntegrationBlockById(blockId));
      }
      setOpenDeleteModal(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          maxHeight: '85vh',
          minHeight: '85vh',
          overflow: 'auto',
          border: '1px solid',
          borderRadius: 1,
          borderColor: theme.palette.grey.A800,
          boxShadow: 'inherit'
        }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Grid sx={{ position: 'absolute', top: 0, width: '100%', background: 'white', zIndex: 10, p: 2, pb: 0 }}>
            <Grid container>
              <Grid item md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">API Authorization</Typography>
                <Grid item sx={{ display: 'flex', gap: 2 }}>
                  <Button component={Link} to={'/form-integration-rules/' + formId} size="small" variant="outlined" color="primary">
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid container spacing={4} sx={{ pl: 4, pr: 4, pt: 2, mt: 5, mb: 2 }}>
            <Grid item md={2.5} xl={2.5}>
              <RHFTextField name="key" type="text" label="Key" required={true} />
            </Grid>
            <Grid item md={2.5} xl={2.5}>
              <RHFTextField name="value" type="text" label="Value" required={true} />
            </Grid>
            <Grid item md={2} xl={2} sx={{ mt: 4 }}>
              <Button size="small" type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
        <Grid container sx={{ pl: 4, pr: 4, pt: 4, mb: 4 }}>
          <Grid item md={6} xl={6}>
            <TableForm
              hidePagination
              hideHistoryIcon
              hideViewIcon
              hideEditIcon
              handleRowDelete={handleRowDelete}
              hideEmptyTable
              data={payload.map((pair) => {
                return {
                  key: pair[0],
                  value: pair[1]
                };
              })}
              columns={columns}
              count={payload?.length}
            />
          </Grid>
          <Grid item md={6} xl={6} sx={{ pl: 4, pr: 4 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 16, mb: 1, textDecoration: 'underline' }}>Authorization</Typography>
            <pre>
              {payload.length === 0
                ? '{}'
                : JSON.stringify(
                    payload.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                    null,
                    2
                  )}
            </pre>
          </Grid>
        </Grid>
      </Card>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
    </>
  );
};

export default AddAuthForm;
