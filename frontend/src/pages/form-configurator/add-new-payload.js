import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Dialog, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { getDropdownPayloadParent, getFormAttributeIntegrationPayload, getFormAttributes } from 'store/actions';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import request from 'utils/request';
import Validations from 'constants/yupValidations';
import { formAttributeIntegrationPayloadSlice, formAttributesSlice } from 'store/reducers/formMasterSlice';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';

const AddPayloadForm = () => {
  const theme = useTheme();
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [payload, setPayload] = useState({});
  const { formId, blockId } = useParams();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        type: Validations.other
      })
    ),
    defaultValues: {
      parent: null,
      value: null,
      dependency: null
    },
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const splitArray = [
    { id: 'F1', name: 'File Name (F1)', type: 'image' },
    { id: 'F2', name: 'File Path (F2)', type: 'image' },
    { id: 'F1', name: 'File Name (F1)', type: 'file' },
    { id: 'F2', name: 'File Path (F2)', type: 'file' },
    { id: 'F1', name: 'File Name (F1)', type: 'blob' },
    { id: 'F2', name: 'File Path (F2)', type: 'blob' },
    { id: 'L1', name: 'Latitude (L1)', type: 'location' },
    { id: 'L2', name: 'Longitude (L2)', type: 'location' },
    { id: 'L3', name: 'Accuracy (L3)', type: 'location' },
    { id: 'N1', name: 'Sim 1 - RSRP (N1)', type: 'dbm' },
    { id: 'N2', name: 'Sim 1 - RSRQ (N2)', type: 'dbm' },
    { id: 'N3', name: 'Sim 1 - SINR (N3)', type: 'dbm' },
    { id: 'N4', name: 'Sim 1 - ASU (N4)', type: 'dbm' },
    { id: 'N5', name: 'Sim 1 - Provider (N5)', type: 'dbm' },
    { id: 'N6', name: 'Sim 1 - Type (N6)', type: 'dbm' },
    { id: 'N7', name: 'Sim 2 - RSRP (N7)', type: 'dbm' },
    { id: 'N8', name: 'Sim 2 - RSRQ (N8)', type: 'dbm' },
    { id: 'N9', name: 'Sim 2 - SINR (N9)', type: 'dbm' },
    { id: 'N10', name: 'Sim 2 - ASU (N10)', type: 'dbm' },
    { id: 'N11', name: 'Sim 2 - Provider (N11)', type: 'dbm' },
    { id: 'N12', name: 'Sim 2 - Type (N12)', type: 'dbm' },
    { id: 'S1', name: 'Download Speed (S1)', type: 'Mbps' },
    { id: 'S2', name: 'Upload Speed (S2)', type: 'Mbps' }
  ];

  const onFormSubmit = async (values) => {
    if (values.isConcat === 'true') {
      const numberFields = parseInt(values.numberFields, 10);
      values = Object.keys(values).reduce((acc, key) => {
        const match = key.match(/^column(\d+)$/);
        const columnNumber = match ? parseInt(match[1], 10) : null;
        if (
          !match ||
          (columnNumber !== null && columnNumber <= numberFields && values[key] !== null && values[key] !== undefined && values[key] !== '')
        ) {
          acc[key] = values[key];
        }
        return acc;
      }, {});
    }
    setSubmitState(true);
    if (!values.value) {
      values.value = null;
    }
    if (!values.dependency) {
      values.dependency = null;
    } else {
      const dependencyField = columnData?.find((z) => z.id === values.dependency)?.id;
      values.dependency = dependencyField;
    }
    if (values.format && values.format !== 'boolean') {
      delete values.trueValue;
    }
    const { type, name, value, parent, ...otherKeys } = values;
    const newItem = {
      type: type,
      name: name,
      value: value,
      parent: parent,
      integrationBlockId: blockId,
      properties: otherKeys
    };
    const response = await request('/attribute-integration-payload-create', { method: 'POST', body: newItem });
    if (response.success) {
      methods.reset({
        type: '',
        name: '',
        value: null,
        dependency: null,
        fixedValue: '',
        subType: '',
        parent: null,
        format: '',
        trueValue: '',
        numberFields: '',
        separator: ''
      });
      if (blockId) {
        dispatch(getFormAttributeIntegrationPayload(blockId));
        dispatch(getDropdownPayloadParent(blockId));
      }
      setSubmitState(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
      setSubmitState(false);
    }
  };

  const handleRowDelete = (value) => {
    setDeleteId(value);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    const response = await request(`/attribute-integration-payload-delete`, { method: 'DELETE', params: deleteId });
    if (response.success) {
      dispatch(getFormAttributeIntegrationPayload(blockId));
      dispatch(getDropdownPayloadParent(blockId));
      setOpenDeleteModal(false);
    } else {
      toast(response?.error?.message);
    }
  };

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    if (blockId) {
      dispatch(getFormAttributeIntegrationPayload(blockId));
      dispatch(getDropdownPayloadParent(blockId));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
      dispatch(formAttributeIntegrationPayloadSlice.actions.reset());
    };
  }, [dispatch, formId, blockId]);

  const { formAttributes, attributeIntegrationPayload, payloadParentDropdown } = useDefaultFormAttributes();
  const columnData = useMemo(() => formAttributes?.formAttributesObject?.rows || [], [formAttributes?.formAttributesObject?.rows]);

  const { formData } = useMemo(
    () => ({
      formData: attributeIntegrationPayload?.formAttributeIntegrationPayloadObject?.rows || []
    }),
    [attributeIntegrationPayload]
  );

  const { parentData } = useMemo(
    () => ({
      parentData: payloadParentDropdown?.payloadParentDropdownObject || []
    }),
    [payloadParentDropdown]
  );

  useEffect(() => {
    const updatedFormData = updateFormData(formData);
    const payloadData = formatPayload(updatedFormData);
    setPayload(payloadData);
    // eslint-disable-next-line
  }, [formData, columnData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: (list) => {
          const type = list?.type === 'array' ? 'Array of object' : list?.type;
          if (type) {
            return type.charAt(0).toUpperCase() + type.slice(1);
          }
          return '';
        }
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Parent',
        accessor: 'parentName.name'
      },
      {
        Header: 'Hierarchy Field',
        accessor: 'properties.isConcat',
        Cell: ({ cell: { value } }) => {
          return value === 'true' ? 'Yes' : '-';
        }
      },
      {
        Header: 'Value Field',
        accessor: 'valueName.name'
      },
      {
        Header: 'Split Parameter',
        accessor: 'properties.subType'
      },
      {
        Header: 'Fixed Value',
        accessor: 'properties.fixedValue'
      },
      {
        Header: 'Dependency Field',
        accessor: 'properties.dependency'
      },
      {
        Header: 'Format',
        accessor: 'properties.format'
      },
      {
        Header: 'True Value',
        accessor: 'properties.trueValue'
      }
    ],
    []
  );

  const formatPayload = (data) => {
    const groupedByParent = data.reduce((acc, entry) => {
      const { parentId, ...rest } = entry;
      acc[parentId] = acc[parentId] || [];
      acc[parentId].push(rest);
      return acc;
    }, {});

    const processEntries = (parent) =>
      (groupedByParent[parent] || []).reduce((result, { id, name, type, value }) => {
        if (type === 'key') {
          result[name] = value;
        } else if (type === 'object') {
          const processedEntry = processEntries(id);
          if (Array.isArray(result)) {
            result.push(processedEntry);
          } else {
            result[name] = processedEntry;
          }
        } else if (type === 'array') {
          const arr = [];
          (groupedByParent[id] || []).forEach((innerEntry) => {
            const { id: innerName, type: innerType, value: innerValue, name: title } = innerEntry;
            if (innerType === 'key') {
              arr.push({ [title]: innerValue });
            } else if (innerType === 'object') {
              arr.push(processEntries(innerName));
            } else if (innerType === 'array') {
              arr.push(processEntries(innerName));
            }
          });
          result[name] = arr;
        }
        return result;
      }, {});

    return processEntries('');
  };

  const getConcatenatedValue = (itemProperties, columnDataArray) => {
    const getNameFromId = (id) => {
      const col = columnDataArray.find((column) => column.id === id);
      return col ? col.name : '';
    };
    const columnKeys = Object.keys(itemProperties)
      .filter((key) => key.startsWith('column'))
      .sort((a, b) => parseInt(a.slice(-1)) - parseInt(b.slice(-1)))
      .map((key) => getNameFromId(itemProperties[key]));

    return itemProperties?.separator ? columnKeys?.join(itemProperties.separator) : columnKeys?.join('');
  };

  function updateFormData(formDataSample) {
    return formDataSample.map((item) => ({
      ...item,
      value:
        item.properties?.isConcat === 'true'
          ? getConcatenatedValue(item.properties, columnData)
          : item.properties?.fixedValue
          ? item.properties?.fixedValue
          : item.value !== null
          ? item.valueName?.name + (item.properties?.subType ? ' (' + item.properties?.subType + ')' : '')
          : '',
      parent: item.parent !== null ? item.parentName?.name : '',
      parentId: item.parent !== null ? item.parent : '',
      valueName: null,
      parentName: null
    }));
  }

  const typeValue = methods.watch('type');
  useEffect(() => {
    setValue('value', null);
  }, [typeValue, setValue]);

  const arrayLength = methods.watch('numberFields');

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
                <Typography variant="h4">API Payload</Typography>
                <Grid item sx={{ display: 'flex', gap: 2 }}>
                  <Button component={Link} to={'/form-integration-rules/' + formId} size="small" variant="outlined" color="primary">
                    Back
                  </Button>
                  <Button onClick={() => setIsDialogOpen(true)} size="small" variant="contained" color="primary">
                    Table View
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid container spacing={4} sx={{ pl: 4, pr: 4, pt: 2, mt: 5, mb: 2 }}>
            <Grid item md={3}>
              <RHFSelectbox
                name="type"
                label="Type"
                allowClear
                menus={[
                  { name: 'Key', id: 'key' },
                  { name: 'Object', id: 'object' },
                  { name: 'Array of object', id: 'array' }
                ]}
                required
              />
            </Grid>
            <Grid item md={3}>
              <RHFSelectbox
                name="parent"
                label="Parent"
                allowClear
                menus={methods.watch('type') === 'key' ? parentData?.filter((x) => x.type !== 'array') : parentData}
              />
            </Grid>
            <Grid item md={3}>
              <RHFTextField name="name" type="text" label="Name" required={true} />
            </Grid>
            <Grid item md={3}>
              <RHFSelectbox
                name="isConcat"
                defaultValue="false"
                label="Hierarchy Field"
                menus={[
                  { name: 'Yes', id: 'true' },
                  { name: 'No', id: 'false' }
                ]}
                allowClear
                required
                disable={!methods.watch('type') || methods.watch('type') === 'key' ? false : true}
              />
            </Grid>
            {methods.watch('isConcat') !== 'true' ? (
              <>
                <Grid item md={3}>
                  <RHFSelectbox
                    name="value"
                    label="Value Field"
                    menus={columnData}
                    allowClear
                    disable={!methods.watch('type') || methods.watch('type') === 'key' ? false : true}
                  />
                </Grid>
                <Grid item md={3}>
                  <RHFSelectbox
                    name="subType"
                    label="Split Parameter"
                    allowClear
                    menus={splitArray?.filter(
                      (x) =>
                        x.type === columnData?.find((y) => y.id === methods.watch('value'))?.default_attribute?.inputType ||
                        x.type === columnData?.find((y) => y.id === methods.watch('value'))?.properties.networkType
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <RHFTextField name="fixedValue" type="text" label="Fixed Value" />
                </Grid>
                <Grid item md={3}>
                  <RHFSelectbox
                    name="dependency"
                    label="Dependency Field"
                    menus={columnData}
                    allowClear
                    disable={!methods.watch('type') || methods.watch('type') === 'key' ? false : true}
                  />
                </Grid>
                <Grid item md={3}>
                  <RHFSelectbox
                    name="format"
                    label="Format"
                    allowClear
                    menus={[
                      { name: 'Double Precision', id: 'double' },
                      { name: 'Boolean', id: 'boolean' }
                    ]}
                  />
                </Grid>
                {methods.watch('format') === 'boolean' ? (
                  <>
                    <Grid item md={3}>
                      <RHFTextField name="trueValue" type="text" label="True Value" />
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <Grid item md={3}>
                  <RHFTextField name="numberFields" type="number" label="Number of Fields" />
                </Grid>
                {arrayLength >= 1 && arrayLength <= 5
                  ? Array.from({ length: arrayLength }, (_, index) => (
                      <Grid item md={3} key={index}>
                        <RHFSelectbox name={`column${index + 1}`} label={`Field ${index + 1}`} menus={columnData} />
                      </Grid>
                    ))
                  : null}
                <Grid item md={3}>
                  <RHFTextField name="separator" type="text" label="Separator" />
                </Grid>
              </>
            )}
            <Grid item md={1} sx={{ mt: 4 }}>
              <Button size="small" type="submit" variant="contained" color="primary" disabled={submitState}>
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
        <Grid container sx={{ pl: 2, pr: 2, pt: 2, mb: 2 }}>
          <Dialog open={isDialogOpen} scroll="body" maxWidth="lg" onClose={() => setIsDialogOpen(false)}>
            <Grid item xl={12}>
              <TableForm
                title="payload"
                hidePagination
                hideHeader
                hideHistoryIcon
                hideViewIcon
                miniAction
                hideEditIcon
                handleRowDelete={handleRowDelete}
                hideEmptyTable
                data={formData}
                columns={columns}
                count={formData?.length}
              />
            </Grid>
          </Dialog>{' '}
          <Grid item sx={{ p: 2 }} xl={12}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 16, mb: 1, textDecoration: 'underline' }}>Payload</Typography>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
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

export default AddPayloadForm;
