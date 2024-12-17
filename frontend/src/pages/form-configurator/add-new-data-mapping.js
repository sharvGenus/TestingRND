import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Dialog, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { getFormAttributes, getFormData } from 'store/actions';
import { FormProvider, RHFSelectbox, RHFSelectTags } from 'hook-form';
import Validations from 'constants/yupValidations';
import { formAttributesSlice } from 'store/reducers/formMasterSlice';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const selectBox = (name, label, menus, req, placeholder, onChange) => {
  return (
    <Stack>
      <RHFSelectbox
        name={name}
        placeholder={placeholder}
        label={label}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(req && { required: true })}
      />
    </Stack>
  );
};

const AddDataMapping = ({ formHeaderData, mappingArrayData, formId, screen, setScreen }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [filteredMappingArray, setFilteredMappingArray] = useState([]);
  const [formTableColumns, setFormTableColumns] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openMappingModal, setOpenMappingModal] = useState(false);
  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
    };
  }, [dispatch, formId]);

  const getUpdatedSourceColumns = useCallback(async () => {
    const response = await request('/form-attributes-list', {
      method: 'GET',
      query: { formId: selectedTable, sort: ['createdAt', 'ASC'] }
    });
    if (response.success) {
      return setFormTableColumns(response.data?.data?.rows || []);
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
  }, [selectedTable]);

  useEffect(() => {
    if (selectedTable) {
      getUpdatedSourceColumns();
    }
  }, [dispatch, selectedTable, getUpdatedSourceColumns]);

  useEffect(() => {
    dispatch(getFormData({ sortBy: 'updatedAt', sortOrder: 'DESC', projectId: formHeaderData?.projectId }));
  }, [dispatch, formHeaderData?.projectId]);

  useEffect(() => {
    setSelectedTable(formHeaderData?.mappingTableId);
    setFilteredMappingArray(mappingArrayData.map((x, i) => ({ ...x, index: i })));
    setValue('mappingTableId', formHeaderData?.mappingTableId);
    setValue('searchColumns', formHeaderData?.searchColumns);
    setValue('selfSearchColumns', formHeaderData?.selfSearchColumns);
    // eslint-disable-next-line
  }, [setValue]);

  const { forms } = useDefaultFormAttributes();
  const { formAttributes } = useDefaultFormAttributes();
  const columnData = useMemo(() => formAttributes?.formAttributesObject?.rows || [], [formAttributes?.formAttributesObject?.rows]);

  const fitleredValueForTable = useMemo(() => {
    return filteredMappingArray.filter((item) => item?.mappingColumnId);
  }, [filteredMappingArray]);

  const formsList =
    forms?.formDataObject?.rows
      ?.filter((values) => values.isPublished)
      .map((element) => ({
        id: element.id,
        name: element.name,
        tableName: element.tableName
      })) || [];

  const columns = [
    {
      Header: 'Form Field',
      accessor: (d) => columnData.find((it) => it.id === d.formAttributeId)?.name
    },
    {
      Header: 'Mapping Column',
      accessor: (d) =>
        typeof formTableColumns?.find === 'function' ? formTableColumns?.find((it) => it.id === d.mappingColumnId)?.name : ''
    }
  ];

  const onFormSubmit = async (values) => {
    values.mappingArray = filteredMappingArray;
    values.formId = formId;
    const response = await request('/form-update-data-mapping', { method: 'PUT', body: values });
    if (response.success) {
      toast(response.data.message, { variant: 'success', autoHideDuration: 3000 });
      setScreen({ ...screen, default: 1, dataMapping: 0 });
    } else {
      toast(response.error.message, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const confirmDelete = () => {
    const { index } = deleteInfo;
    const cloneFiltered = structuredClone(filteredMappingArray);
    cloneFiltered[index].mappingColumnId = null;
    setFilteredMappingArray(cloneFiltered.map((x, i) => ({ ...x, index: i })));
    setOpenDeleteModal(false);
  };

  const handleDeleteField = async (row) => {
    setDeleteInfo(row);
    setOpenDeleteModal(true);
  };

  const handleTableId = (e) => {
    setSelectedTable(e.target?.value);
  };

  const subMethods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        oldMeterSN: Validations.other,
        newMeterSN: Validations.other,
        oldMeterMake: Validations.other,
        newMeterMake: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { setValue: subSetValue } = subMethods;
  const [disableMapping, setDisableMapping] = useState(false);

  useEffect(() => {
    subSetValue('oldMeterSN', columnData?.find((x) => x.properties?.oldMeterSN)?.id);
    subSetValue('oldMeterMake', columnData?.find((x) => x.properties?.oldMeterMake)?.id);
    subSetValue('newMeterSN', columnData?.find((x) => x.properties?.oldMeterSN)?.properties?.oldNewMappingColumn);
    subSetValue('newMeterMake', columnData?.find((x) => x.properties?.oldMeterMake)?.properties?.oldNewMappingColumn);
    columnData?.find((x) => x.properties?.oldMeterSN)?.id && setDisableMapping(true);
  }, [subSetValue, columnData]);

  const onSubFormSubmit = async (values) => {
    const firstRecord = columnData?.find((obj) => obj.id === values.oldMeterSN);
    const secondRecord = columnData?.find((obj) => obj.id === values.oldMeterMake);
    if (firstRecord || secondRecord) {
      const requests = [];
      if (firstRecord) {
        values.properties = {
          ...firstRecord.properties,
          oldNewMappingColumn: values.newMeterSN,
          oldMeterSN: true
        };
        requests.push(request('/form-attributes-update', { method: 'PUT', body: values, params: values.oldMeterSN }));
      }
      if (secondRecord) {
        values.properties = {
          ...secondRecord.properties,
          oldNewMappingColumn: values.newMeterMake,
          oldMeterMake: true
        };
        requests.push(request('/form-attributes-update', { method: 'PUT', body: values, params: values.oldMeterMake }));
      }
      try {
        const responses = await Promise.all(requests);
        const allSuccess = responses.every((response) => response.success);
        if (allSuccess) {
          const successMessage = 'O&M Mapping Done Successfully!';
          toast(successMessage, { variant: 'success', autoHideDuration: 5000 });
          setOpenMappingModal(false);
          setScreen({ ...screen, default: 1, dataMapping: 0 });
        } else {
          const errorMessage = responses.find((response) => !response.success)?.error?.message || 'Operation failed. Please try again.';
          toast(errorMessage, { variant: 'error' });
        }
      } catch (error) {
        toast('An error occurred. Please try again.', { variant: 'error' });
      }
    }
  };

  const handleReset = async () => {
    const firstRecord = columnData?.find((x) => x.properties?.oldMeterSN);
    const secondRecord = columnData?.find((x) => x.properties?.oldMeterMake);
    if (firstRecord || secondRecord) {
      const requests = [];
      if (firstRecord) {
        const updatedFirstProperties = {
          ...firstRecord.properties
        };
        delete updatedFirstProperties.oldNewMappingColumn;
        delete updatedFirstProperties.oldMeterSN;
        const updatedFirstRecord = {
          ...firstRecord,
          properties: updatedFirstProperties
        };
        requests.push(request('/form-attributes-update', { method: 'PUT', body: updatedFirstRecord, params: firstRecord.id }));
      }
      if (secondRecord) {
        const updatedSecondProperties = {
          ...secondRecord.properties
        };
        delete updatedSecondProperties.oldNewMappingColumn;
        delete updatedSecondProperties.oldMeterMake;
        const updatedSecondRecord = {
          ...secondRecord,
          properties: updatedSecondProperties
        };
        requests.push(request('/form-attributes-update', { method: 'PUT', body: updatedSecondRecord, params: secondRecord.id }));
      }
      try {
        const responses = await Promise.all(requests);
        const allSuccess = responses.every((response) => response.success);
        if (allSuccess) {
          const successMessage = 'O&M Mapping Reset Successfully!';
          toast(successMessage, { variant: 'success', autoHideDuration: 5000 });
          setOpenMappingModal(false);
          setScreen({ ...screen, default: 1, dataMapping: 0 });
        } else {
          const errorMessage = responses.find((response) => !response.success)?.error?.message || 'Operation failed. Please try again.';
          toast(errorMessage, { variant: 'error' });
        }
      } catch (error) {
        toast('An error occurred. Please try again.', { variant: 'error' });
      }
    }
  };

  return (
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
              <Typography variant="h4">{formHeaderData?.name} &gt; Data Mapping</Typography>
              <Grid item sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() => setScreen({ ...screen, default: 1, dataMapping: 0 })}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Back
                </Button>
                <Button onClick={() => setOpenMappingModal(true)} size="small" variant="outlined" color="primary">
                  O&M Mapping
                </Button>
                <Button size="small" type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </Grid>
        <Grid container spacing={4} sx={{ pl: 4, pr: 4, pt: 2, mt: 5 }}>
          <Grid item md={3} xl={3}>
            {selectBox('mappingTableId', 'Mapping Table', formsList, true, '', handleTableId)}
          </Grid>
          <Grid item md={4} xl={4}>
            <RHFSelectTags name="searchColumns" label="Search Parameters" menus={formTableColumns} required />
          </Grid>
          <Grid item md={4} xl={4}>
            <RHFSelectTags name="selfSearchColumns" label="O&M Search Parameters" menus={columnData} required />
          </Grid>
        </Grid>
      </FormProvider>
      <SubForm
        setMappingArray={setFilteredMappingArray}
        mappingArray={fitleredValueForTable}
        columnData={columnData}
        sourceColumnData={formTableColumns}
      />
      <Grid sx={{ width: '95%', pl: 4, pr: 4, pt: 2, mb: 4 }}>
        <TableForm
          hidePagination
          hideHistoryIcon
          hideViewIcon
          hideEditIcon
          hideHeader
          hideEmptyTable
          data={fitleredValueForTable}
          columns={columns}
          count={fitleredValueForTable.length}
          handleRowDelete={handleDeleteField}
        />
      </Grid>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Delete Condition"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
      <Dialog open={openMappingModal} onClose={() => setOpenMappingModal(false)} scroll="paper" disableEscapeKeyDown>
        <FormProvider methods={subMethods} onSubmit={subMethods.handleSubmit(onSubFormSubmit)}>
          <Grid container spacing={4} sx={{ p: 2 }}>
            <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
              O&M Mapping
            </Grid>
            <Grid item md={6} xl={6}>
              <RHFSelectbox name="oldMeterSN" label="Old Meter Serial Number Field" menus={columnData} required disable={disableMapping} />
            </Grid>
            <Grid item md={6} xl={6}>
              <RHFSelectbox name="newMeterSN" label="New Meter Serial Number Field" menus={columnData} required disable={disableMapping} />
            </Grid>
            <Grid item md={6} xl={6}>
              <RHFSelectbox name="oldMeterMake" label="Old Meter Make Field" menus={columnData} required disable={disableMapping} />
            </Grid>
            <Grid item md={6} xl={6}>
              <RHFSelectbox name="newMeterMake" label="New Meter Make Field" menus={columnData} required disable={disableMapping} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {disableMapping && (
                <Button size="small" variant="outlined" color="error" onClick={() => handleReset()}>
                  Reset
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setOpenMappingModal(false);
                  subMethods.reset();
                }}
              >
                Cancel
              </Button>
              {!disableMapping && (
                <Button size="small" type="submit" variant="contained">
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </FormProvider>
      </Dialog>
    </Card>
  );
};

const SubForm = (props) => {
  const { setMappingArray, columnData, sourceColumnData } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        formAttributeId: Validations.other,
        mappingColumnId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (values) => {
    const { formAttributeId, mappingColumnId } = values;
    const newItem = {
      formAttributeId: formAttributeId,
      mappingColumnId: mappingColumnId
    };
    setMappingArray((pre) => [...pre, { ...newItem, index: pre.length }]);
    methods.reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container alignItems="center" sx={{ pl: 4, pr: 4 }}>
        <Grid container spacing={4} mt={1} mb={3} direction="row">
          <Grid item md={3} xl={3}>
            {selectBox('formAttributeId', 'Select Form Field', columnData, true, 'Select Form Field')}
          </Grid>
          <Grid item md={3} xl={3}>
            {selectBox('mappingColumnId', 'Select Mapping Column', sourceColumnData, true, 'Select Mapping Column')}
          </Grid>
          <Grid item md={3} sx={{ mt: 4 }}>
            <Button variant="contained" size="small" color="primary" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

SubForm.propTypes = {
  mappingArray: PropTypes.array,
  columnData: PropTypes.array,
  sourceColumnData: PropTypes.array,
  setMappingArray: PropTypes.func
};

AddDataMapping.propTypes = {
  formId: PropTypes.string,
  screen: PropTypes.object,
  setScreen: PropTypes.func,
  formHeaderData: PropTypes.object,
  mappingArrayData: PropTypes.array
};

export default AddDataMapping;
