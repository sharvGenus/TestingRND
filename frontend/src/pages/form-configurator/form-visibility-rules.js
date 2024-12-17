import { Grid, Typography, Button, IconButton, Tooltip, Card, useTheme, Divider, CircularProgress } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { RHFSelectTags, FormProvider } from 'hook-form';
import { getFormAttributes, getFormVisibilityBlock } from 'store/actions';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { formAttributesSlice } from 'store/reducers/formMasterSlice';

const VisibilityRule = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const methods = useForm({
    mode: 'all'
  });
  useEffect(() => {
    if (formId) {
      dispatch(getFormVisibilityBlock(formId));
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
    };
  }, [dispatch, formId]);
  const { formAttributes } = useDefaultFormAttributes();
  const columnData = formAttributes?.formAttributesObject?.rows || [];

  const confirmDelete = async () => {
    const response = await request('/attribute-visibility-block-delete', { method: 'DELETE', params: deleteInfo });
    if (response.success) {
      deleteInfo;
      setOpenDeleteModal(false);
      dispatch(getFormVisibilityBlock(formId));
    } else {
      toast(response.error.message);
    }
  };

  const { formVisibilityBlock } = useDefaultFormAttributes();
  const { data, formName } = useMemo(
    () => ({
      data: formVisibilityBlock.formVisibilityBlockObject?.rows || [],
      formName: formVisibilityBlock.formVisibilityBlockObject?.formName || ''
    }),
    [formVisibilityBlock]
  );
  React.useEffect(() => {
    methods.reset({
      value: data.map((x) => ({ visibleColumns: x.visibleColumns, nonVisibleColumns: x.nonVisibleColumns }))
    });
  }, [data, methods]);
  const handleEditField = (blockData) => {
    navigate('/add-new-visibility/' + formId, { state: { blockData } });
  };

  const handleDeleteField = (id) => {
    setDeleteInfo(id);
    setOpenDeleteModal(true);
  };
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
                  <Typography variant="h4">{formName} &gt; Visibility Rules</Typography>

                  <Grid item sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to={'/update-form/features/' + formId} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                    <Button
                      component={Link}
                      size="small"
                      to={'/add-new-visibility/' + formId}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Add New
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
              <Grid container rowSpacing={2} alignItems="center" sx={{ mt: 2, pl: 2, pr: 2 }}>
                <Grid item md={1.5}>
                  <Typography sx={{ fontWeight: 'bold' }}>Actions</Typography>
                </Grid>
                <Grid item md={2.5}>
                  <Typography sx={{ fontWeight: 'bold' }}>Rule Name</Typography>
                </Grid>
                {/* <Grid item md={2}>
                <Typography sx={{ fontWeight: 'bold' }}>Type</Typography>
              </Grid> */}
                <Grid item md={8}>
                  <Typography sx={{ fontWeight: 'bold' }}>Column(s) Visibility</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ ml: 2, mr: 2, mt: 1.5, mb: 0 }} />
            </Grid>
            {data.map((item, index) => (
              <>
                <Grid container key={item.id} alignItems="flex-start" sx={{ p: 4, pt: 2, pb: 2 }}>
                  <Grid item md={1.5} sx={{ pt: 1 }}>
                    <Tooltip title="Edit" placement="bottom">
                      <IconButton color="secondary" onClick={() => handleEditField(item)}>
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="bottom">
                      <IconButton color="secondary" onClick={() => handleDeleteField(item?.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item md={2.5} sx={{ pt: 2 }}>
                    <Typography>{item.name}</Typography>
                  </Grid>
                  {/* <Grid item md={2}>
                  <Typography>{item.type.toUpperCase()}</Typography>
                </Grid> */}
                  <Grid item md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <RHFSelectTags
                      name={`value.${index}.visibleColumns`}
                      menus={columnData.filter((obj) => item.visibleColumns?.includes(obj.id))}
                      disable
                      success
                    />
                    <RHFSelectTags
                      name={`value.${index}.nonVisibleColumns`}
                      menus={columnData.filter((obj) => item.nonVisibleColumns?.includes(obj.id))}
                      disable
                      failure
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Divider sx={{ mt: 5 }} />
                  </Grid>
                </Grid>
              </>
            ))}
          </Card>
          <ConfirmModal
            open={openDeleteModal}
            handleClose={() => setOpenDeleteModal(false)}
            handleConfirm={confirmDelete}
            title="Delete Visibility Rule"
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

export default VisibilityRule;
