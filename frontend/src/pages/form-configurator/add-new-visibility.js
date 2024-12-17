import { OPERATORS } from 'constants';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import RHFDateTimePicker from 'hook-form/RHFDateTimePicker';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { getFormAttributeVisibilityCondition, getFormAttributes } from 'store/actions';
import { FormProvider, RHFSelectbox, RHFTextField, RHFSelectTags } from 'hook-form';
import request from 'utils/request';
import Validations from 'constants/yupValidations';
import { formAttributesSlice, formAttributeVisibilityConditionSlice } from 'store/reducers/formMasterSlice';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import { SOURCE_TABLES } from 'constants/formDropdownConstants';

const txtBox = (name, label, type, req, placeholder, shrink = true) => {
  return (
    <Stack spacing={1}>
      <RHFTextField
        name={name}
        type={type}
        label={label}
        placeholder={placeholder}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
      />
    </Stack>
  );
};

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

const AddVisibilityForm = () => {
  const theme = useTheme();
  const { formId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const blockData = location.state?.blockData;
  const [conditionsArray, setConditionsArray] = useState([]);
  const [dropdownLOVs, setDropdownLOVs] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [selectedVisibleColumns, setSelectedVisibleColumns] = useState(blockData?.visibleColumns || []);
  const [selectedNonVisibleColumns, setSelectedNonVisibleColumns] = useState(blockData?.nonVisibleColumns || []);
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        type: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
      dispatch(formAttributeVisibilityConditionSlice.actions.reset());
    };
  }, [dispatch, formId]);

  const { formAttributes } = useDefaultFormAttributes();

  const columnData = useMemo(() => {
    return formAttributes?.formAttributesObject?.rows || [];
  }, [formAttributes?.formAttributesObject?.rows]);

  const [responseData, setResponseData] = useState({});
  const previousMoreDataRef = useRef([]);

  const getValueName = useCallback(
    async (obj) => {
      const attribute = columnData?.find((i) => i.id === obj.fromAttributeId);
      if (attribute && attribute?.default_attribute?.inputType === 'dropdown') {
        const formDropdowns = [
          {
            name: 'lov',
            sourceTable: attribute?.properties?.sourceTable,
            sourceColumn: attribute?.properties?.sourceColumn,
            type: 'and',
            conditions: [
              {
                column: SOURCE_TABLES?.find((i) => i.id === attribute?.properties?.sourceTable)?.tableIdCell,
                operation: 'et',
                value: obj.compareWithValue
              }
            ]
          }
        ];
        const response = await request('/form-get-dropdown-field-data', {
          method: 'POST',
          body: { formId, formDropdowns }
        });
        if (response.success) {
          return response.data?.dropdownData[0]?.lov[0]?.name;
        } else {
          return '';
        }
      } else return '';
    },
    [columnData, formId]
  );

  useEffect(() => {
    const fetchData = async () => {
      const previousMoreData = previousMoreDataRef.current;
      const newItems = conditionsArray?.filter((obj) => !previousMoreData.includes(obj));
      if (newItems.length > 0) {
        const results = await Promise.all(
          newItems.map(async (obj) => ({
            id: obj.compareWithValue,
            name: await getValueName(obj)
          }))
        );
        const newResponses = results.reduce((acc, { id, name }) => {
          if (name) acc[id] = name;
          return acc;
        }, {});
        setResponseData((prevData) => ({ ...prevData, ...newResponses }));
      }
      previousMoreDataRef.current = conditionsArray;
    };
    if (columnData && columnData.length > 0) {
      fetchData();
    }
  }, [conditionsArray, getValueName, columnData]);

  const columns = [
    {
      Header: 'Column',
      accessor: 'form_attribute.name'
    },
    {
      Header: 'Operator',
      accessor: 'operatorKey'
    },
    {
      Header: 'Matching Column / Value',
      accessor: (data) =>
        columnData?.find((z) => z.id === data.fromAttributeId)?.default_attribute?.inputType === 'dropdown'
          ? responseData[data.compareWithValue]
          : data.compareWithValue
    }
  ];

  const { handleSubmit } = methods;

  useEffect(() => {
    blockData?.id && dispatch(getFormAttributeVisibilityCondition(blockData?.id));
  }, [dispatch, blockData?.id]);

  const { attributeVisibilityCondition } = useDefaultFormAttributes();
  const attributeVisibilityConditionList = useMemo(
    () => attributeVisibilityCondition?.formAttributeVisibilityConditionObject?.rows || [],
    [attributeVisibilityCondition]
  );

  useEffect(() => {
    setConditionsArray((prevAttributes) => [...prevAttributes, ...attributeVisibilityConditionList]);
  }, [attributeVisibilityConditionList]);

  const onFormSubmit = async (values) => {
    values.conditionsArray = conditionsArray;
    values.formId = formId;
    const response = await request('/attribute-visibility-block-create', { method: 'POST', body: values });
    if (response.success) {
      navigate(`/form-visibility-rules/${formId}`);
    } else {
      toast(response.error.message, { variant: 'error' });
    }
  };

  const onFormUpdate = async (values) => {
    values.formId = formId;
    values.conditionsArray = conditionsArray;
    values.visibilityBlockId = blockData?.id;
    const response = await request('/attribute-visibility-block-update', { method: 'PUT', body: values });
    if (response.success) {
      navigate(`/form-visibility-rules/${formId}`);
    } else {
      toast(response.error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    methods.reset({
      name: blockData?.name,
      type: blockData?.type,
      visibleColumns: blockData?.visibleColumns,
      nonVisibleColumns: blockData?.nonVisibleColumns
    });
  }, [blockData, methods]);

  const submitFunction = blockData?.id ? onFormUpdate : onFormSubmit;

  const confirmDelete = () => {
    const index = conditionsArray.findIndex(
      (obj) =>
        obj?.id === deleteInfo ||
        (obj?.fromAttributeId === deleteInfo?.fromAttributeId &&
          obj?.operatorKey === deleteInfo?.operatorKey &&
          obj?.compareWithValue === deleteInfo?.compareWithValue &&
          !('isActive' in obj))
    );
    if (index !== -1) {
      const updatedObj = { ...conditionsArray[index] };
      updatedObj.isActive = 0;
      conditionsArray[index] = updatedObj;
    }
    setOpenDeleteModal(false);
  };

  const handleDeleteField = async (row) => {
    setDeleteInfo(row);
    setOpenDeleteModal(true);
  };

  const handleEditField = () => {};
  const conditionTypesData = [
    {
      id: 'and',
      name: 'AND ( Match all of below )'
    },
    {
      id: 'or',
      name: 'OR ( Match any of below )'
    }
  ];

  const handleVisibleColumnsChange = (selectedItems) => {
    setSelectedVisibleColumns(selectedItems);
    setSelectedNonVisibleColumns((prevSelected) => prevSelected.filter((item) => !selectedItems.includes(item)));
  };

  const handleNonVisibleColumnsChange = (selectedItems) => {
    setSelectedNonVisibleColumns(selectedItems);
    setSelectedVisibleColumns((prevSelected) => prevSelected.filter((item) => !selectedItems.includes(item)));
  };

  const nonVisibleColumns = columnData.filter((column) => {
    return !selectedVisibleColumns.includes(column.id) && !column.properties.defaultHide;
  });

  const visibleColumns = columnData.filter((column) => {
    return !selectedNonVisibleColumns.includes(column.id) && !column.properties.approval && !column.properties.verifyAttribute;
  });

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
      <FormProvider methods={methods} onSubmit={handleSubmit(submitFunction)}>
        <Grid sx={{ position: 'absolute', top: 0, width: '100%', background: 'white', zIndex: 10, p: 2, pb: 0 }}>
          <Grid container>
            <Grid item md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4">{!blockData?.id ? 'Add Visibility Rule' : 'Edit Visibility Rule'}</Typography>
              <Grid item sx={{ display: 'flex', gap: 2 }}>
                <Button component={Link} to={'/form-visibility-rules/' + formId} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                {!blockData?.id ? (
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                ) : (
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </Grid>
        <Grid container spacing={4} sx={{ pl: 4, pr: 4, pt: 2, mt: 5 }}>
          <Grid item md={6} xl={6}>
            {txtBox(`name`, 'Rule Name', 'text', true, 'Rule Name')}
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="type"
              placeholder="Select Condition Type"
              label="Condition Type"
              menus={conditionTypesData}
              required={true}
            />
          </Grid>
          <Grid item md={11} xl={11}>
            <RHFSelectTags
              name="visibleColumns"
              label="Visible Columns"
              onChange={handleVisibleColumnsChange}
              menus={visibleColumns}
              success
            />
          </Grid>
          <Grid item md={11} xl={11}>
            <RHFSelectTags
              name="nonVisibleColumns"
              label="Non Visible Columns"
              onChange={handleNonVisibleColumnsChange}
              menus={nonVisibleColumns}
              failure
            />
          </Grid>
        </Grid>
      </FormProvider>
      <SubVisibilityForm
        setConditionsArray={setConditionsArray}
        conditionsArray={conditionsArray}
        columnData={columnData}
        dropdownLOVs={dropdownLOVs}
        setDropdownLOVs={setDropdownLOVs}
        formId={formId}
      />
      <Grid sx={{ width: '95%', pl: 4, pr: 4, pt: 2, mb: 4 }}>
        <TableForm
          hidePagination
          hideHistoryIcon
          hideViewIcon
          hideEditIcon
          hideEmptyTable
          hideHeader
          data={conditionsArray.filter((item) => item?.isActive != 0)}
          columns={columns}
          count={conditionsArray.filter((item) => item?.isActive != 0).length}
          handleRowDelete={handleDeleteField}
          handleRowUpdate={handleEditField}
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
    </Card>
  );
};

const SubVisibilityForm = (props) => {
  const [columnValue1, setColumnValue1] = useState();

  const { conditionsArray, setConditionsArray, columnData, dropdownLOVs, setDropdownLOVs, formId } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        fromAttributeId: Validations.other,
        operatorKey: Validations.other,
        compareWithValue: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (values) => {
    const { fromAttributeId, operatorKey, compareWithValue } = values;
    const newItem = {
      fromAttributeId: fromAttributeId,
      operatorKey: operatorKey,
      compareWithValue: compareWithValue,
      form_attribute: { name: columnValue1 }
    };
    setConditionsArray([...conditionsArray, newItem]);
    methods.reset();
    setDropdownLOVs([]);
  };
  const [columnType, setColumnType] = useState();
  const [columnValue, setColumnValue] = useState();

  const handleSelectColumn1 = async (e) => {
    methods.resetField('compareWithValue');
    setColumnValue1(e?.target?.name);
    setColumnValue(e?.target?.value);
    setColumnType(e?.target?.type);
    const formDropdowns = [
      {
        name: e?.target?.name,
        sourceTable: e?.target?.row?.properties?.sourceTable,
        sourceColumn: e?.target?.row?.properties?.sourceColumn,
        type: 'and',
        conditions: e?.target?.row?.properties?.conditions
      }
    ];
    if (e?.target?.type === 'Dropdown') {
      const response = await request('/form-get-dropdown-field-data', { method: 'POST', body: { formId, formDropdowns } });
      if (response.success) {
        setDropdownLOVs(response.data?.dropdownData[0]?.[e.target?.name]);
      } else {
        toast(response.error.message, { variant: 'error' });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container alignItems="center" sx={{ pl: 4, pr: 4 }}>
        <Grid container spacing={4} mt={1} mb={3} direction="row">
          <Grid item md={3} xl={3}>
            {selectBox(
              'fromAttributeId',
              'Column',
              columnData.filter((x) => !['dateOnly', 'timeOnly'].includes(x.properties?.pickerType)),
              true,
              'Select Column',
              handleSelectColumn1
            )}
          </Grid>
          <Grid item md={2} xl={3}>
            {selectBox('operatorKey', 'Operation', OPERATORS, true, 'Select')}
          </Grid>
          {columnType === 'Chip Select' || columnType === 'Checkbox' ? (
            <Grid item md={3} xl={3}>
              {selectBox(
                'compareWithValue',
                'Matching Value',
                methods.watch('fromAttributeId')
                  ? columnData
                      .filter((item) => item.id == columnValue)
                      .flatMap((item) => item.properties?.values.split(',').map((value) => ({ name: value, id: value })))
                  : [],
                false,
                'Select  Value'
              )}
            </Grid>
          ) : columnType === 'Date Time' ? (
            <Grid item md={2.5} xl={2.5}>
              <RHFDateTimePicker
                name="compareWithValue"
                label="Matching Value"
                pickerType="dateTimeBoth"
                timeFormat="24hour"
                format={'dd/MM/yyyy HH:mm'}
              />
            </Grid>
          ) : columnType === 'Dropdown' ? (
            <Grid item md={2.5} xl={2.5}>
              {selectBox('compareWithValue', 'Matching Value', dropdownLOVs, false, 'Select Value')}
            </Grid>
          ) : (
            <Grid item md={3} xl={3}>
              {txtBox('compareWithValue', 'Matching Value', 'text', false, 'Enter Value')}
            </Grid>
          )}
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

SubVisibilityForm.propTypes = {
  conditionsArray: PropTypes.array,
  columnData: PropTypes.array,
  setConditionsArray: PropTypes.func,
  dropdownLOVs: PropTypes.array,
  setDropdownLOVs: PropTypes.func,
  formId: PropTypes.string
};

export default AddVisibilityForm;
