import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CircularProgress, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { FormProvider } from 'hook-form';
import { getFormIntegrationBlock } from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const IntegrationTableForm = () => {
  const { formId } = useParams();
  const theme = useTheme();
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'all'
  });

  useEffect(() => {
    formId && dispatch(getFormIntegrationBlock(formId));
  }, [dispatch, formId]);

  const handleDeleteField = (id) => {
    setDeleteInfo(id);
    setOpenDeleteModal(true);
  };

  const handleEditField = (blockData) => {
    navigate('/add-new-integration/' + formId, { state: { blockData } });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Endpoint URL',
        accessor: 'endpoint'
      },
      {
        Header: '',
        accessor: 'type',
        Cell: (list) => (
          <Grid sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => navigate(`/add-new-payload/${list.row?.original?.formId}/${list.row?.original?.id}`)}
              size="small"
              variant="outlined"
              color="primary"
            >
              Payload
            </Button>
            <Button
              onClick={() => navigate(`/add-new-auth/${list.row?.original?.formId}/${list.row?.original?.id}`)}
              size="small"
              variant="outlined"
              color="primary"
            >
              Authorization
            </Button>
          </Grid>
        )
      }
    ],
    [navigate]
  );

  const confirmDelete = async () => {
    const response = await request('/attribute-integration-block-delete', { method: 'DELETE', params: deleteInfo });
    if (response.success) {
      setOpenDeleteModal(false);
      dispatch(getFormIntegrationBlock(formId));
    } else {
      toast(response.error.message);
    }
  };

  const { formIntegrationBlock } = useDefaultFormAttributes();
  const { data, formName } = useMemo(
    () => ({
      data: formIntegrationBlock?.formIntegrationBlockObject?.rows || [],
      formName: formIntegrationBlock?.formIntegrationBlockObject?.formName || ''
    }),
    [formIntegrationBlock]
  );

  return (
    <>
      {formName ? (
        <FormProvider methods={methods}>
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
            <Grid sx={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, p: 2 }}>
              <Grid container>
                <Grid item md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h4">{formName} &gt; API Integration Rules</Typography>
                  <Grid item sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to={'/update-form/features/' + formId} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                    <Button
                      component={Link}
                      size="small"
                      to={'/add-new-integration/' + formId}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Add New
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2, mb: 4 }} />
              <TableForm
                hidePagination
                hideHistoryIcon
                miniAction
                hideViewIcon
                hideEmptyTable
                hideHeader
                data={data.filter((item) => item?.isActive != 0)}
                columns={columns}
                count={data.filter((item) => item?.isActive != 0).length}
                handleRowDelete={handleDeleteField}
                handleRowUpdate={handleEditField}
              />
            </Grid>
          </Card>
          <ConfirmModal
            open={openDeleteModal}
            handleClose={() => setOpenDeleteModal(false)}
            handleConfirm={confirmDelete}
            title="Delete Integration Rule"
            message="Are you sure you want to delete?"
            confirmBtnTitle="Delete"
          />
        </FormProvider>
      ) : (
        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Grid>
      )}
    </>
  );
};

export default IntegrationTableForm;
