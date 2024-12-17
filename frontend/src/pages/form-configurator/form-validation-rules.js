import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CircularProgress, Dialog, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { getFormAttributes, getFormValidationBlock } from 'store/actions';
import Validations from 'constants/yupValidations';
import ConfirmModal from 'components/modal/ConfirmModal';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { formAttributesSlice } from 'store/reducers/formMasterSlice';

const ValidationTableForm = () => {
  const { formId } = useParams();
  const theme = useTheme();
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openOMModal, setOpenOMModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'all'
  });

  useEffect(() => {
    formId && dispatch(getFormValidationBlock(formId));
  }, [dispatch, formId]);

  const handleDeleteField = (id) => {
    setDeleteInfo(id);
    setOpenDeleteModal(true);
  };

  const handleEditField = (blockData) => {
    navigate('/add-new-validation/' + formId, { state: { blockData } });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Column',
        accessor: 'form_attribute.name'
      },
      // {
      //   Header: 'Type',
      //   accessor: (data) => data.type.toUpperCase()
      // },
      {
        Header: 'Error Message',
        accessor: 'message'
      }
    ],
    []
  );

  const confirmDelete = async () => {
    const response = await request('/attribute-validation-block-delete', { method: 'DELETE', params: deleteInfo });
    if (response.success) {
      setOpenDeleteModal(false);
      dispatch(getFormValidationBlock(formId));
    } else {
      toast(response.error.message);
    }
  };

  const { formValidationBlock } = useDefaultFormAttributes();
  const { data, formName } = useMemo(
    () => ({
      data: formValidationBlock.formValidationBlockObject?.rows || [],
      formName: formValidationBlock.formValidationBlockObject?.formName || ''
    }),
    [formValidationBlock]
  );

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
    };
  }, [dispatch, formId, openOMModal]);

  const { formAttributes } = useDefaultFormAttributes();

  const columnData = useMemo(() => {
    return formAttributes?.formAttributesObject?.rows || [];
  }, [formAttributes?.formAttributesObject?.rows]);

  const subMethods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        omField: Validations.other,
        omValue: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue: subSetValue } = subMethods;
  const [disableOM, setDisableOM] = useState(false);
  const [dropdownLOVs, setDropdownLOVs] = useState([]);

  const handleClickOM = () => {
    const omItem = columnData?.find((x) => x.properties?.setValueOM);
    omItem && subSetValue('omField', omItem?.id);
    omItem && fetchLOV(omItem);
    setOpenOMModal(true);
  };

  const fetchLOV = async (item) => {
    const subFormDropdowns = [
      {
        name: item?.name,
        sourceTable: item?.properties?.sourceTable,
        sourceColumn: item?.properties?.sourceColumn,
        type: 'and',
        conditions: item?.properties?.conditions
      }
    ];
    const res = await request('/form-get-dropdown-field-data', { method: 'POST', body: { formId, formDropdowns: subFormDropdowns } });
    if (res.success) {
      setDropdownLOVs(res.data?.dropdownData[0]?.[item?.name]);
      subSetValue('omValue', item?.properties?.setValueOM);
      setDisableOM(true);
    } else {
      toast(res.error.message, { variant: 'error' });
    }
  };

  const onSubFormSubmit = async (values) => {
    const firstRecord = columnData?.find((obj) => obj.id === values.omField);
    if (firstRecord) {
      values.properties = {
        ...firstRecord.properties,
        setValueOM: values.omValue
      };
      const response = await request('/form-attributes-update', { method: 'PUT', body: values, params: values.omField });
      if (response.success) {
        toast('O&M Validation Set Successfully!', { variant: 'success', autoHideDuration: 5000 });
        setOpenOMModal(false);
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      }
    }
  };

  const handleReset = async () => {
    const firstRecord = columnData?.find((x) => x.properties?.setValueOM);
    if (firstRecord) {
      const updatedFirstProperties = {
        ...firstRecord.properties
      };
      delete updatedFirstProperties.setValueOM;
      const updatedFirstRecord = {
        ...firstRecord,
        properties: updatedFirstProperties
      };
      const response = await request('/form-attributes-update', { method: 'PUT', body: updatedFirstRecord, params: firstRecord.id });
      if (response.success) {
        subMethods.resetField('omField');
        subMethods.resetField('omValue');
        toast('O&M Validation Reset Successfully!', { variant: 'success', autoHideDuration: 5000 });
        setTimeout(() => {
          setOpenOMModal(false);
          setTimeout(() => {
            setDropdownLOVs([]);
            setDisableOM(false);
          }, 0);
        }, 1000);
      } else {
        toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      }
    }
  };

  const handleOMField = async (e) => {
    subMethods.resetField('omValue');
    const formDropdowns = [
      {
        name: e?.target?.name,
        sourceTable: e?.target?.row?.properties?.sourceTable,
        sourceColumn: e?.target?.row?.properties?.sourceColumn,
        type: 'and',
        conditions: e?.target?.row?.properties?.conditions
      }
    ];
    const response = await request('/form-get-dropdown-field-data', { method: 'POST', body: { formId, formDropdowns } });
    if (response.success) {
      setDropdownLOVs(response.data?.dropdownData[0]?.[e.target?.name]);
    } else {
      toast(response.error.message, { variant: 'error' });
    }
  };

  return (
    <>
      {formName ? (
        <>
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
                    <Typography variant="h4">{formName} &gt; Validation Rules</Typography>
                    <Grid item sx={{ display: 'flex', gap: 2 }}>
                      <Button onClick={handleClickOM} size="small" variant="outlined" color="primary">
                        O&M Validation
                      </Button>
                      <Button component={Link} to={'/update-form/features/' + formId} size="small" variant="outlined" color="primary">
                        Back
                      </Button>
                      <Button
                        component={Link}
                        size="small"
                        to={'/add-new-validation/' + formId}
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
                  hideViewIcon
                  hideEmptyTable
                  hideHeader
                  miniAction
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
              title="Delete Validation Rule"
              message="Are you sure you want to delete?"
              confirmBtnTitle="Delete"
            />
          </FormProvider>
          <Dialog open={openOMModal} onClose={() => setOpenOMModal(false)} scroll="paper" disableEscapeKeyDown>
            <FormProvider methods={subMethods} onSubmit={subMethods.handleSubmit(onSubFormSubmit)}>
              <Grid container spacing={4} sx={{ p: 2 }}>
                <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
                  O&M Validation
                </Grid>
                <Grid item md={6} xl={6}>
                  <RHFSelectbox
                    name="omField"
                    label="Field"
                    menus={columnData?.filter((i) => i?.default_attribute?.inputType === 'dropdown')}
                    required
                    onChange={handleOMField}
                    disable={disableOM}
                  />
                </Grid>
                <Grid item md={6} xl={6}>
                  <RHFSelectbox name="omValue" label="Value" menus={dropdownLOVs} disable={disableOM} />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  {disableOM && (
                    <Button size="small" variant="outlined" color="error" onClick={() => handleReset()}>
                      Reset
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setOpenOMModal(false);
                      subMethods.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  {!disableOM && (
                    <Button size="small" type="submit" variant="contained">
                      Save
                    </Button>
                  )}
                </Grid>
              </Grid>
            </FormProvider>
          </Dialog>
        </>
      ) : (
        <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Grid>
      )}
    </>
  );
};

export default ValidationTableForm;
