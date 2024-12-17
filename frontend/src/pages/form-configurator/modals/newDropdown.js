import { OPERATORS } from 'constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from '../useDefaultAttributes';
import { SOURCE_TABLES } from '../../../constants/formDropdownConstants';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFTextField, RHFSelectbox, RHFToggleButton } from 'hook-form';
import { getAllMastersColumnList, getAllMastersList, getFormData } from 'store/actions';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

export const DropdownColumn = ({
  modalId,
  mode,
  item,
  columnData,
  isPublished,
  setOpen,
  attributesArray,
  setAttributesArray,
  projectId,
  formId
}) => {
  const dispatch = useDispatch();
  const [moreData, setMoreData] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('');
  const [value, setMatchingValue] = useState('');
  const [factoryTable, setFactoryTable] = useState('');
  const [factoryColumns, setFactoryColumns] = useState([]);

  useEffect(() => {
    dispatch(getFormData({ sortBy: 'updatedAt', sortOrder: 'DESC', projectId }));
  }, [dispatch, projectId]);

  const { forms } = useDefaultFormAttributes();
  const formsList =
    forms?.formDataObject?.rows
      ?.filter((values) => values.isPublished)
      .map((element) => ({
        id: element.id,
        name: element.name,
        tableName: element.tableName
      })) || [];

  const getFactoryColumns = useCallback(async () => {
    const response = await request('/form-attributes-list', {
      method: 'GET',
      query: { formId: factoryTable, sort: ['createdAt', 'ASC'] }
    });
    if (response.success) {
      return setFactoryColumns(response.data?.data?.rows || []);
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    toast(error || 'Unable to fetch data. Please contact admin', { variant: 'error' });
  }, [factoryTable]);

  useEffect(() => {
    if (factoryTable) {
      getFactoryColumns();
    }
  }, [dispatch, factoryTable, getFactoryColumns]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.attributeTitle,
        columnName: Validations.dbColumn,
        sourceTable: Validations.required,
        sourceColumn: Validations.required,
        attributeName: Validations.required,
        extraColumn: Yup.string().when('dependency', {
          is: (val1) => !!val1,
          then: Validations.required,
          otherwise: Yup.string()
        }),
        factoryColumn: Yup.string().when('factoryTable', {
          is: (val2) => !!val2,
          then: Validations.required,
          otherwise: Yup.string()
        }),
        linkColumn: Yup.string().when('factoryTable', {
          is: (val3) => !!val3,
          then: Validations.required,
          otherwise: Yup.string()
        })
      })
    ),
    defaultValues: { selectType: 'single' },
    mode: 'all'
  });
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = methods;

  const areFieldsValid = () => {
    return column !== '' && operation !== '' && value !== '';
  };

  const handleAddClick = () => {
    if (areFieldsValid()) {
      setMoreData([...moreData, { column, operation, value }]);
    }
    setColumn('');
    setOperation('');
    setMatchingValue('');
    setValue('column', '');
    setValue('operation', '');
    setValue('value', '');
  };

  useEffect(() => {
    dispatch(getAllMastersList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllMastersColumnList(selectedTable));
  }, [dispatch, selectedTable]);

  const [listOfValues, setOfLOVs] = useState([]);
  const getListOfValues = async (table, cell, condition) => {
    const formDropdowns = [
      {
        name: 'lov',
        sourceTable: table,
        sourceColumn: cell,
        type: 'and',
        conditions: condition || []
      }
    ];
    const response = await request('/form-get-dropdown-field-data', {
      method: 'POST',
      body: { formId, formDropdowns }
    });
    if (response.success) {
      setOfLOVs(response.data?.dropdownData[0]?.lov);
    } else {
      toast(response.error.message);
    }
  };

  const [sourceColumnData, setSourceColumnData] = useState([]);
  useEffect(() => {
    setSourceColumnData(SOURCE_TABLES?.find((table) => table.id === methods.watch('sourceTable'))?.columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.watch('sourceTable')]);

  const txtBox = (name, label, type, req, placeholder = false, onChange) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          disabled={
            (isPublished && !mode && modalId && item.id && name == 'columnName') ||
            (item?.properties?.approval && (name == 'name' || name == 'columnName'))
              ? true
              : false
          }
          handleChange={onChange}
          placeholder={placeholder}
          {...(req && { required: true })}
          onBlur={(e) => {
            e.target.value = e.target.value.trim();
            methods.setValue(name, e.target.value);
            if ((!item.id || (item.id && !isPublished)) && name === 'name') {
              const columnNameValue = e.target.value
                .replace(/[^A-Za-z ]/g, '')
                .replace(/ +/g, '_')
                .replace(/_+/g, '_')
                .slice(0, 16)
                .toLowerCase();
              methods.setValue('columnName', columnNameValue);
              clearErrors('columnName');
            }
            const existItem = attributesArray.some((element) => {
              if (name === e.target.name && element?.[name] === e.target.value && element?.['columnName'] !== item?.columnName) {
                return true;
              }
              return false;
            });
            if (existItem) {
              setError(name, { message: label + ' already exists' }, { shouldFocus: true });
            }
          }}
        />
      </Stack>
    );
  };

  const selectBox = (name, label, menus, req, placeholder, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          placeholder={placeholder}
          name={name}
          label={label}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
          allowClear={['factoryTable', 'dependency'].includes(name) ? true : false}
        />
      </Stack>
    );
  };

  const onFormSubmit = async (values) => {
    if (values.selectType === true) {
      values.selectType = 'multi';
    } else if (values.selectType === false) {
      values.selectType = 'single';
    }
    values.type = 'Dropdown';
    delete values['column'];
    delete values['operation'];
    delete values['value'];
    values.defaultAttributeId = modalId;
    values.conditions = moreData;
    const { name, defaultAttributeId, columnName, required, type, conditions, ...otherKeys } = values;
    const newItem = {
      name: name,
      type: type,
      columnName: columnName,
      columnType: 'uuid',
      isRequired: required,
      defaultAttributeId: defaultAttributeId,
      properties: { ...otherKeys, conditions, type: 'AND' }
    };
    const existingItem =
      newItem?.columnName && newItem?.columnName !== item?.columnName
        ? attributesArray.findIndex((element) => element.columnName === newItem?.columnName)
        : -1;
    if (existingItem !== -1) {
      setError('columnName', { message: 'Column Name already exists' }, { shouldFocus: true });
    } else {
      const existingItemIndex = newItem?.properties?.fieldId
        ? attributesArray.findIndex((element) => element.id === newItem?.properties?.fieldId)
        : item?.name
        ? attributesArray.findIndex((element) => element.name === item?.name)
        : -1;
      if (existingItemIndex !== -1) {
        attributesArray[existingItemIndex] = { ...attributesArray[existingItemIndex], ...newItem };
      } else {
        setAttributesArray([...attributesArray, newItem]);
      }
      methods.reset();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!mode) {
      setValue('fieldId', item?.id);
      setValue('name', item?.name);
      setSelectedTable(item?.properties?.sourceTable);
      setFactoryTable(item?.properties?.factoryTable);
      setMoreData(item?.properties?.conditions);
      setValue('columnName', item?.columnName);
      setValue('required', Boolean(item?.isRequired === 'true' || item?.isRequired === true));
      Object.keys(item?.properties || {}).forEach((key) => {
        setValue(key, item?.properties[key]);
      });
    }
  }, [item, mode, setValue]);

  const handleMasterId = (e) => {
    setSelectedTable(e?.target?.value);
    methods.resetField('sourceColumn');
    methods.resetField('extraColumn');
    methods.resetField('factoryColumn');
    methods.resetField('linkColumn');
    methods.resetField('factoryTable');
    methods.resetField('dependency');
    setMoreData([]);
  };

  const handleFactoryTable = (e) => {
    setFactoryColumns([]);
    setFactoryTable(e?.target?.value);
    methods.resetField('factoryColumn');
    methods.resetField('linkColumn');
  };

  const handleColumn = (e) => {
    methods.resetField('value');
    setMatchingValue('');
    setColumn(e.target?.value);
    e.target?.value && getListOfValues(e.target?.row?.table, e.target?.row?.cell, e.target?.row?.conditionFunction(projectId));
  };

  const handleDependency = (e) => {
    !e && methods.resetField('extraColumn');
  };

  const handleOperation = (e) => {
    setOperation(e.target?.value);
  };

  const handleValue = (e) => {
    setMatchingValue(e.target?.value?.trim());
  };

  const [responseData, setResponseData] = useState({});
  const previousMoreDataRef = useRef([]);

  const getValueName = useCallback(
    async (obj) => {
      const formDropdowns = [
        {
          name: 'lov',
          sourceTable: sourceColumnData?.find((i) => i.id === obj.column && i.cell)?.table,
          sourceColumn: sourceColumnData?.find((i) => i.id === obj.column && i.cell)?.cell,
          type: 'and',
          conditions: [{ column: sourceColumnData?.find((i) => i.id === obj.column && i.cell)?.idCell, operation: 'et', value: obj.value }]
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
    },
    [sourceColumnData, formId]
  );

  useEffect(() => {
    const fetchData = async () => {
      const previousMoreData = previousMoreDataRef.current;
      const newItems = moreData?.filter((obj) => !previousMoreData.includes(obj));
      if (newItems.length > 0) {
        const results = await Promise.all(
          newItems.map(async (obj) => ({
            id: obj.value,
            name: await getValueName(obj)
          }))
        );
        const newResponses = results.reduce((acc, { id, name }) => {
          if (name) acc[id] = name;
          return acc;
        }, {});
        setResponseData((prevData) => ({ ...prevData, ...newResponses }));
      }
      previousMoreDataRef.current = moreData;
    };
    fetchData();
  }, [moreData, getValueName]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const responses = {};
  //     const promises = moreData.map(async (obj) => {
  //       const name = await getValueName(obj);
  //       if (name) {
  //         responses[obj.value] = name;
  //       }
  //     });
  //     await Promise.all(promises);
  //     setResponseData(responses);
  //   };
  //   if (moreData.length > 0) {
  //     fetchData();
  //   }
  // }, [moreData, sourceColumnData, getValueName]);

  const subColumns = [
    {
      Header: 'Column',
      accessor: (d) => sourceColumnData?.find((it) => it.id === d.column && it.cell)?.name
    },
    {
      Header: 'Operator',
      accessor: 'operation'
    },
    {
      Header: 'Value',
      accessor: (d) => responseData[d.value]
    }
  ];

  const handleDeleteField = (row) => {
    const updatedData = moreData.filter(
      (obj) => !(obj.column === row.column && obj.operation === row.operation && obj.value === row.value)
    );
    setMoreData(updatedData);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={2} sx={{ p: 2, justifyContent: 'space-between' }}>
        <Grid item md={12} sx={{ fontSize: 22, fontWeight: 'bold' }}>
          {mode ? 'Add' : 'Edit'} Dropdown Field
        </Grid>
        <Grid item md={12}>
          {txtBox('name', 'Display Name', 'text', true, 'Enter Display Name')}
        </Grid>
        <Grid item md={6}>
          {txtBox('attributeName', 'Attribute Name', 'text', true, 'Enter Attribute Name')}
        </Grid>
        <Grid item md={6}>
          {txtBox('columnName', 'DB Column Name', 'text', true, 'Enter DB Column')}
        </Grid>
        <Grid item md={6}>
          {selectBox('sourceTable', 'Source Table', SOURCE_TABLES, true, 'Select Table', handleMasterId)}
        </Grid>
        <Grid item md={6}>
          {selectBox(
            'sourceColumn',
            'Source Column',
            sourceColumnData?.filter((x) => x.isColumn),
            true,
            'Select Column'
          )}
        </Grid>
        <Grid container item spacing={4}>
          <Grid item md={4}>
            {selectBox('factoryTable', 'Factory Table', formsList, false, 'Select Table', handleFactoryTable)}
          </Grid>
          <Grid item md={4}>
            {selectBox('factoryColumn', 'Factory Column', factoryColumns, false, 'Select Column')}
          </Grid>
          <Grid item md={4}>
            {selectBox('linkColumn', 'Link Column', factoryColumns, false, 'Select Column')}
          </Grid>
        </Grid>
        <Grid item md={12} sx={{ mb: -1 }}>
          <Typography>Add Dependency</Typography>
        </Grid>
        <Grid item md={6}>
          {selectBox('dependency', '', columnData, false, 'Select Dropdown', handleDependency)}
        </Grid>
        <Grid item md={6}>
          {selectBox(
            'extraColumn',
            '',
            methods.watch('dependency') ? sourceColumnData?.filter((x) => x.isDep) : [],
            false,
            'Select Matching Key'
          )}
        </Grid>
        <Grid item md={12}>
          <Typography>Add Condition</Typography>
        </Grid>
        <Grid container sx={{ pl: 2, pr: 2, pt: 1, justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item md={3}>
            {selectBox(
              'column',
              '',
              sourceColumnData?.filter((x) => x.isCondition),
              false,
              'Column',
              handleColumn
            )}
          </Grid>
          <Grid item md={3}>
            {selectBox(
              'operation',
              '',
              OPERATORS?.filter((y) => ['=', '!='].includes(y.name)),
              false,
              'Operation',
              handleOperation
            )}
          </Grid>
          <Grid item md={3}>
            {methods.watch('sourceTable') && methods.watch('column') && listOfValues?.length
              ? selectBox('value', '', listOfValues, false, 'Value', handleValue)
              : selectBox('value', '', [], false, 'Value', handleValue)}
          </Grid>
          <Grid item md={2}>
            <Button size="small" variant="contained" onClick={handleAddClick} disabled={!areFieldsValid()} sx={{ mt: 1 }}>
              Add
            </Button>
          </Grid>
          {moreData?.length ? (
            <Grid sx={{ width: '100%', pt: 2 }}>
              <TableForm
                hidePagination
                hideHeader
                hideEditIcon
                hideHistoryIcon
                hideViewIcon
                hideEmptyTable
                data={moreData}
                columns={subColumns}
                count={moreData?.length}
                subTable
                handleRowDelete={handleDeleteField}
              />
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <Grid container item rowSpacing={2} sx={{ ml: 0.5, mt: 0.5 }}>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="required" label="Required" value={Boolean(item?.isRequired === 'true' || item?.isRequired === true)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="editable" label="Editable" value={item?.properties?.editable} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="defaultHide" label="Default Hide" value={item?.properties?.defaultHide} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="selectType" label="Multi Select" value={item?.properties?.selectType === 'multi' ? true : false} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="isMaterial" label="For Material" value={item?.properties?.isMaterial} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="disableOnSearch" label="Disable On Search" value={item?.properties?.disableOnSearch} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="contractor" label="Organization" value={item?.properties?.contractor} />
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFToggleButton name="supervisor" label="Supervisor" value={item?.properties?.supervisor} />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button size="small" variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" type="submit" variant="contained" disabled={Object.keys(errors).length > 0}>
            {mode ? 'Save' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

DropdownColumn.propTypes = {
  modalId: PropTypes.string,
  mode: PropTypes.string,
  item: PropTypes.object,
  isPublished: PropTypes.bool,
  setOpen: PropTypes.func,
  attributesArray: PropTypes.array,
  setAttributesArray: PropTypes.func,
  columnData: PropTypes.array,
  projectId: PropTypes.string,
  formId: PropTypes.string
};
