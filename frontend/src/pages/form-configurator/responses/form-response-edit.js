/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Button, Typography, TextField, Stack, IconButton, OutlinedInput, InputAdornment, Dialog } from '@mui/material';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RHFDateTimePicker from 'hook-form/RHFDateTimePicker';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { SearchOutlined } from '@ant-design/icons';
import { useDefaultFormAttributes } from '../useDefaultAttributes';
import request from '../../../utils/request';
import ImageCard from './response-images-upload';
import FileInputComponent from './image-upload-component';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { FormProvider, RHFSelectTags, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import { getDropDownLov, getFormAttributes } from 'store/actions';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';
import { getCurrentFormattedDate } from 'utils';
import ConfirmModal from 'components/modal/ConfirmModal';
import Loader from 'components/Loader';
import { LoadingText } from 'layout/MainLayout/Header/HeaderContent';

const validationTimeout = {};

// approval level column & resurvey column name change impact
const approverNamePattern = /^l_[a-z]_approver_name$/;
const approvalDatePattern = /^l_[a-z]_approval_date$/;

const validationConditions = {
  et: (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.some((x) => x === val2);
    } else {
      return val1 === val2;
    }
  },
  net: (val1, val2) => {
    if (Array.isArray(val1)) {
      return !val1.some((x) => x === val2);
    } else {
      return val1 !== val2;
    }
  },
  gt: (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.some((x) => x > val2);
    } else {
      return val1 > val2;
    }
  },
  lt: (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.some((x) => x < val2);
    } else {
      return val1 < val2;
    }
  },
  gte: (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.some((x) => x >= val2);
    } else {
      return val1 >= val2;
    }
  },
  lte: (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.some((x) => x <= val2);
    } else {
      return val1 <= val2;
    }
  }
};

const typeCalls = {
  and: Array.prototype.every,
  or: Array.prototype.some
};

const typeCheckAndConvert = (value, type) => {
  if (type === 'number') {
    return Number(value);
  }
  return value;
};

const FormResponseData = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { formId, responseId, mode } = useParams();
  const { formAttributes, dropdownLov } = useDefaultFormAttributes();
  const checkValidation = useRef(false);
  const [
    {
      dropdownLovData,
      searchedDataColumns,
      visibleData,
      searchedData,
      searchValue,
      searchModal,
      hiddenFields,
      preview,
      validate,
      toBeFetchedDropDowns,
      fetchDropDown,
      dataFecthed,
      submitState,
      editable,
      openDeleteModal,
      sameDependencies
    },
    setState
  ] = useState({
    searchedData: [],
    searchModal: '',
    searchValue: '',
    hiddenFields: {},
    validate: false,
    toBeFetchedDropDowns: null,
    fetchDropDown: false,
    dataFecthed: false,
    submitState: false,
    editable: [],
    deleteFile: '',
    openDeleteModal: false,
    sameDependencies: {},
    preview: null
  });

  const methods = useForm({
    mode: 'all',
    defaultValues: {}
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isDirty, errors }
  } = methods;

  const { l_a_approval_status, l_b_approval_status } = methods.watch();

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const handleRowSelect = (rowData, i) => {
    const row = searchedData[i];
    const visibleRow = visibleData[i];
    const object = {};
    const dep = [];
    Object.entries(allDepenedentColumns).map(([key, value]) => {
      if (value && Object.hasOwn(allDepenedentColumns, value)) {
        if (dep.length === 0) return dep.push([value, key]);
        const index = dep.findIndex((arr) => arr.includes(value));
        if (index > -1) return dep[index].push(key);
        dep.push([value, key]);
      }
    });
    formFieldsData?.forEach((x) => {
      const ONLY_NUMBER_WITH_PLUS = /^\+\d{12}$/;
      if (
        x.default_attribute.inputType &&
        x.default_attribute.inputType === 'phone' &&
        row[x.columnName] &&
        typeof row[x.columnName] === 'string'
      ) {
        row[x.columnName] = row[x.columnName]?.startsWith('+91') ? row[x.columnName] : '+91' + row[x.columnName];
        methods.setError(x.columnName, {
          type: 'validations',
          message: row[x.columnName] && ONLY_NUMBER_WITH_PLUS.test(row[x.columnName]) ? '' : 'Please enter valid phone number.'
        });
      } else if (x.default_attribute.inputType === 'text' && visibleRow[x.columnName]) {
        row[x.columnName] = visibleRow[x.columnName];
      }
    });
    const rowKeys = Object.keys(row);
    Object.entries(dynamicKeys).forEach(([key]) => {
      if (dep.some((x) => x.includes(key) && x.some((y) => rowKeys.includes(y)))) {
        object[key] = [];
      }
    });

    const finalEntries = Object.entries(row);
    const clonedEdit = JSON.parse(JSON.stringify(editableFields));
    finalEntries.forEach(([key, value]) => {
      if (
        disableOnSearch.includes(key) &&
        clonedEdit.includes(key) &&
        ((Array.isArray(value) && value.length > 0) || (value && value !== ''))
      ) {
        const index = clonedEdit.indexOf(key);
        clonedEdit[index] = null;
      }
    });
    setState((pre) => ({ ...pre, editable: clonedEdit }));
    Object.entries({ ...object, ...row }).forEach(([key, value]) => {
      setValue(key, value);
    });
    checkValidation.current = true;
    setState((pre) => ({ ...pre, validate: !pre.validate, searchModal: false }));
  };

  const { formFieldsData, isMapping } = useMemo(() => {
    if (!formAttributes || !formAttributes.formAttributesObject) {
      return [];
    }
    const rows = formAttributes.formAttributesObject.rows || [];
    const isMappingTable = formAttributes.formAttributesObject.formsData?.mappingTableId;
    return { formFieldsData: rows.filter((item) => item.view || item.update), isMapping: isMappingTable };
  }, [formAttributes]);

  const searchDataMapping = async () => {
    const response = await request('/form/get-mapped-data', {
      method: 'GET',
      query: { formId: formId, searchBy: searchValue }
    });
    if (response.success) {
      if (response.data && response.data.data && response.data.data.length > 0) {
        let headers = Object.keys(response.data.data[0]);
        let columns = headers.map((header) => ({ Header: header, accessor: header }));
        setState((pre) => ({
          ...pre,
          searchModal: false,
          setSearchedDataColumns: columns,
          searchedData: response.data.data,
          visibleData: response.data.visibleData
        }));
      } else {
        toast(response?.data?.message || 'No Record Found!', { variant: 'warning' });
      }
    } else {
      toast(response.error.message);
    }
  };

  const findStatus = useCallback(
    (objectName, status) => {
      if (dropdownLovData && objectName in dropdownLovData) {
        const dataArray = dropdownLovData[objectName];
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].name?.toLowerCase() === status.toLowerCase()) {
            return dataArray[i].id;
          }
        }
      }
      return null;
    },
    [dropdownLovData]
  );

  const l1l2ApprovalStatus = useMemo(() => {
    return {
      l_a_approval_status: l_a_approval_status?.[0] || undefined,
      l_b_approval_status: l_b_approval_status?.[0] || undefined
    };
  }, [l_a_approval_status, l_b_approval_status]);

  const {
    dynamicKeys,
    dependencies,
    requiredFields,
    allColumnsWithId,
    allDepenedentColumnsById,
    fieldsChildrenAttributes,
    defaultHidden,
    inputTypes,
    formValidationsForReqruired,
    isDeleted,
    disableOnSearch,
    editableFields
  } = useMemo(() => {
    const initialState = {
      factoryTableAttr: [],
      dependentDropdownsFields: [],
      fieldsChildrenAttributes: {},
      allFieldsIdByColumnName: {},
      dynamicKeysByName: {},
      dynamicKeys: {},
      dependencies: {},
      requiredFields: {},
      allColumnsWithId: {},
      allDepenedentColumnsById: {},
      inputTypes: {},
      defaultHidden: [],
      formValidationsForReqruired: [],
      isDeleted: [],
      disableOnSearch: [],
      editableFields: [],
      allColumnNameById: {}
    };
    if (formFieldsData && formFieldsData.length > 0) {
      const formFieldRequiredData = formFieldsData.reduce((pre, acc) => {
        pre.dynamicKeys[acc.columnName] = acc.name?.replace(/\s/g, '') + 'Data';
        pre.allColumnsWithId[acc.id] = acc.columnName;
        pre.allColumnNameById[acc.id] = acc.name;
        pre.allFieldsIdByColumnName[acc.columnName] = acc.id;
        pre.allDepenedentColumnsById[acc.columnName] = acc.properties.dependency;
        pre.inputTypes[acc.columnName] = acc.default_attribute.inputType;
        if (
          acc.properties.defaultHide &&
          (acc.columnName.match(approverNamePattern) || acc.columnName.match(approvalDatePattern) || !acc.columnName.startsWith('l_')) &&
          !['is_resurvey', 'resurveyor_org_type', 'resurveyor_org_id', 'resurvey_by'].includes(acc.columnName)
        ) {
          pre.defaultHidden.push(acc.columnName);
        }
        if (acc.isRequired && acc.isActive === '1' && acc.default_attribute?.inputType !== 'ref_code') {
          pre.formValidationsForReqruired.push(acc.columnName);
        }
        if (acc.isActive !== '1') {
          pre.isDeleted.push(acc.columnName);
        }
        if (acc.properties?.dependency) {
          pre.dependencies[acc.columnName] = acc.properties?.dependency;
          pre.requiredFields[acc.columnName] = acc.isRequired || acc?.properties?.factoryTable;
        }
        if (acc.default_attribute.inputType === 'dropdown') {
          pre.dependentDropdownsFields.push(acc);
        }
        if (acc.properties?.disableOnSearch) {
          pre.disableOnSearch.push(acc.columnName);
        }
        if (acc.properties?.editable) {
          pre.editableFields.push(acc.columnName);
        }
        if (acc.properties?.factoryTable) {
          pre.factoryTableAttr.push(acc.columnName);
        }
        return pre;
      }, initialState);

      formFieldRequiredData.fieldsChildrenAttributes = {};
      Object.entries(formFieldRequiredData.allFieldsIdByColumnName).forEach(([name, id]) => {
        formFieldRequiredData.fieldsChildrenAttributes[name] =
          formFieldsData.filter((x) => x.properties.dependency === id)?.length > 0 ? [formFieldRequiredData.allColumnNameById[id]] : null;
      });

      return formFieldRequiredData;
    }
    return initialState;
  }, [formFieldsData]);

  useEffect(() => {
    setState((pre) => ({ ...pre, editable: editableFields }));
  }, [editableFields]);

  useEffect(() => {
    if (formFieldsData && formFieldsData.length > 0) {
      formFieldsData.forEach((acc) => {
        if (['l_a_exception_ctg', 'l_a_exception_rmk'].includes(acc.columnName)) {
          if (
            l1l2ApprovalStatus['l_a_approval_status'] &&
            l1l2ApprovalStatus['l_a_approval_status'] !== findStatus('L1ApprovalStatusData', 'Approved') &&
            acc.update
          ) {
            if (!formValidationsForReqruired.includes(acc.columnName)) {
              formValidationsForReqruired.push(acc.columnName);
            }
          } else {
            if (formValidationsForReqruired.includes(acc.columnName)) {
              const index = formValidationsForReqruired.indexOf(acc.columnName);
              formValidationsForReqruired.splice(index, 1);
            }
          }
        }
        if (['l_b_exception_ctg', 'l_b_exception_rmk'].includes(acc.columnName)) {
          if (
            l1l2ApprovalStatus['l_b_approval_status'] &&
            l1l2ApprovalStatus['l_b_approval_status'] !== findStatus('L2ApprovalStatusData', 'Approved') &&
            acc.update
          ) {
            if (!formValidationsForReqruired.includes(acc.columnName)) {
              formValidationsForReqruired.push(acc.columnName);
            }
          } else {
            if (formValidationsForReqruired.includes(acc.columnName)) {
              const index = formValidationsForReqruired.indexOf(acc.columnName);
              formValidationsForReqruired.splice(index, 1);
            }
          }
        }
      });
    }
  }, [formFieldsData, l1l2ApprovalStatus, findStatus, formValidationsForReqruired]);

  const allDepenedentColumns = useMemo(() => {
    return Object.fromEntries(Object.entries(allDepenedentColumnsById).map(([key, value]) => [key, allColumnsWithId[value] || null]));
  }, [allDepenedentColumnsById, allColumnsWithId]);

  const allParentColumns = useMemo(() => {
    const allParentColumnsData = {};
    Object.entries(allDepenedentColumnsById)
      .filter(([, value]) => allColumnsWithId[value])
      .forEach(([key, value]) => {
        if (Object.hasOwn(allParentColumnsData, allColumnsWithId[value])) {
          allParentColumnsData[allColumnsWithId[value]].push(key);
        } else {
          allParentColumnsData[allColumnsWithId[value]] = [key];
        }
      });
    return allParentColumnsData;
  }, [allDepenedentColumnsById, allColumnsWithId]);

  useEffect(() => {
    if (dropdownLov?.dropdownLovDataObject?.length > 0) {
      const data = {};
      const sameConditionDepenedentColumns = [];
      dropdownLov?.dropdownLovDataObject?.forEach((item) => {
        const [key] = Object.keys(item);
        const isDuplicate = !!dropdownLov?.duplicatedValues?.[key];
        const dataKey = isDuplicate ? dropdownLov?.duplicatedValues?.[key] : key;
        const formattedKey = key.replace(/\s/g, '') + 'Data';
        data[formattedKey] = isDuplicate
          ? dropdownLov?.dropdownLovDataObject?.find((x) => Object.keys(x)?.[0] === dataKey)?.[dataKey]
          : item[key];
        if (isDuplicate) {
          sameConditionDepenedentColumns[formattedKey] = dataKey;
        }
      });

      setState((pre) => ({
        ...pre,
        dropdownLovData: data,
        dataFecthed: true,
        sameDependencies: Object.fromEntries(
          Object.entries(dropdownLov?.duplicatedValues).map(([key, entry]) => [
            key.replace(/\s/g, '') + 'Data',
            entry.replace(/\s/g, '') + 'Data'
          ])
        )
      }));
    } else if (!dropdownLov.loading) {
      setState((pre) => ({
        ...pre,
        dataFecthed: true
      }));
    }
  }, [dropdownLov]);

  const filteredDataForDropDown = useCallback(
    (dynamicKey, dependency) => {
      if (!dependency) {
        return dropdownLovData?.[dynamicKey];
      }
      const dependentColumn = allColumnsWithId[dependency];
      const inputValue = getValues(dependentColumn);
      if (inputValue === undefined) {
        return [];
      }
      const isSameDep = Object.hasOwn(sameDependencies, dynamicKey);
      const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
      if (typeof inputValue === 'string') {
        return dropdownLovData?.[dynamicKey]?.filter((items) => inputValue === items[keyToCheck]);
      } else {
        return dropdownLovData?.[dynamicKey]?.filter((items) => inputValue?.includes(items?.[keyToCheck]));
      }
    },
    [allColumnsWithId, getValues, sameDependencies, dropdownLovData]
  );

  const dynamicdataKeyGenerator = useCallback(
    (keyValue, values) => {
      const keyArray = formFieldsData.filter((item) => item?.default_attribute?.name === keyValue);
      const updateValues = {};
      if (keyArray.length > 0 && dropdownLovData) {
        keyArray.forEach((myObj) => {
          const columnList = [];
          const separatorList = [];
          const entriesColumns = Object.entries(myObj?.properties).filter((x) => x[0].startsWith('column'));
          const entriesSeperator = Object.entries(myObj?.properties).filter((x) => x[0].startsWith('separator'));
          entriesColumns.sort(([keyA], [keyB]) => keyA.replace('column', '') - keyB.replace('column', ''));
          entriesSeperator.sort(([keyA], [keyB]) => keyA.replace('separator', '') - keyB.replace('separator', ''));
          entriesColumns.forEach(([, value]) => {
            columnList.push(value);
          });
          entriesSeperator.forEach(([, value]) => {
            separatorList.push(value);
          });
          const finalNameList = columnList
            ?.map((value) => {
              const item = formFieldsData.find((i) => i.id === value);
              const customKeyName = dropdownLov?.sourceColumnByIdObject?.[item.name] || '';
              return item ? { columnName: item?.columnName, type: item?.default_attribute?.inputType, name: item.name, customKeyName } : {};
            })
            .filter((x) => Object.keys(x).length > 0);
          // if (
          //   finalNameList.some(
          //     ({ columnName }) =>
          //       columnName && (!values[columnName] || (Array.isArray(values[columnName]) && values[columnName].length === 0))
          //   )
          // ) {
          //   updateValues[myObj.columnName] = '';
          //   return;
          // }
          const value = `${myObj?.properties?.prefix || ''}${separatorList[0]}${finalNameList
            .map(({ columnName: key, type, name, customKeyName }) => {
              if (type && type === 'dropdown') {
                const lovKey = name.replace(/\s/g, '') + 'Data';
                if (dropdownLovData && dropdownLovData[lovKey]) {
                  const fitleredName = dropdownLovData[lovKey]
                    .filter((x) => values[key]?.includes(x.id))
                    .map((x) => (customKeyName ? x[customKeyName] : x.name))
                    .join('/');
                  if (fitleredName) return fitleredName;
                }
              }
              return values[key];
            })
            .map((val, ind) => {
              return (val || '') + (separatorList[ind + 1] || '');
            })
            .join('')}${myObj?.properties?.suffix || ''}`;

          if (value !== values[myObj.columnName]) {
            updateValues[myObj.columnName] = value;
          }
        });
        return updateValues;
      }
    },
    [formFieldsData, dropdownLovData, dropdownLov?.sourceColumnByIdObject]
  );

  const dynamicdata = useCallback(
    (keyValue, values) => {
      const myObj = formFieldsData.find((item) => item?.default_attribute?.name === keyValue || item?.properties?.qrType === keyValue);
      const updateValues = {};
      if (myObj) {
        const idList = myObj?.properties?.columnList;
        const finalNameList = formFieldsData.filter((item) => idList?.includes(item.id.toString())).map((item) => item.columnName);
        const sep = myObj?.properties?.separator || '';
        const value = `${myObj?.properties?.prefix || ''}${sep}${finalNameList
          .map((key) => {
            return values[key];
          })
          .filter((x) => x)
          .join(sep)}${sep}${myObj?.properties?.suffix || ''}`;
        if (value !== values[myObj.columnName]) {
          updateValues[myObj.columnName] = value;
        }
      }
      return updateValues;
    },
    [formFieldsData]
  );

  const validationsChecked = useCallback(() => {
    if (validationTimeout.timer) {
      clearTimeout(validationTimeout.timer);
    }
    validationTimeout.timer = setTimeout(() => {
      const validationErrors = {};
      const hideColumns = {};

      if (formFieldsData && formFieldsData?.length > 0) {
        if (defaultHidden.length > 0) {
          defaultHidden.forEach((x) => {
            hideColumns[x] = true;
          });
        }
      }
      const exitsingValues = getValues();
      /**
       * Function to check visibility conditions
       * @returns Boolean
       */
      const checkVisibilityCondtions = ({ type, attribute_visibility_conditions }) => {
        return typeCalls[type].call(attribute_visibility_conditions, (item) => {
          return (
            item?.operatorKey &&
            item?.compareWithValue &&
            item?.form_attribute?.columnName &&
            item?.form_attribute?.default_attribute?.inputType &&
            (Array.isArray(exitsingValues[item.form_attribute?.columnName] && exitsingValues[item.form_attribute?.columnName].length > 0) ||
              exitsingValues[item.form_attribute?.columnName]) &&
            validationConditions[item.operatorKey] &&
            validationConditions[item.operatorKey].call &&
            validationConditions[item.operatorKey].call(
              null,
              typeCheckAndConvert(exitsingValues[item.form_attribute?.columnName], item.form_attribute?.default_attribute?.inputType),
              typeCheckAndConvert(item.compareWithValue, item.form_attribute?.default_attribute?.inputType)
            )
          );
        });
      };
      const conditionCheckForArray = (firstArray, secondArray, operatorKey) => {
        if (Array.isArray(firstArray) && firstArray.length > 0 && ['et', 'net'].includes(operatorKey)) {
          const key = operatorKey === 'et' ? 'or' : 'and';
          const error = typeCalls[key].call(firstArray, (item) => (operatorKey === 'et' ? item === secondArray : item !== secondArray));
          return error;
        }
        return false;
      };
      formFieldsData.forEach((_item) => {
        const { columnName, validations, hideConditions, showConditions } = _item;

        // This Code Will Be Use in Future.
        if (hideConditions && !defaultHidden.includes(columnName)) {
          hideColumns[columnName] = hideConditions.length > 0 ? typeCalls.or.call(hideConditions, checkVisibilityCondtions) : false;
        }

        if (hideColumns[columnName] && showConditions?.length > 0) {
          hideColumns[columnName] = !typeCalls.or.call(showConditions, checkVisibilityCondtions);
        }
        if (validations) {
          const { type, message } = validations;
          const isValidRequest = typeCalls[type].call(validations.attribute_validation_conditions, (item) => {
            const firstColumnName = item?.form_attribute?.columnName;
            const firstInputType = item?.form_attribute?.default_attribute?.inputType;
            const secondInputType = item?.compare_with_column?.default_attribute?.inputType || firstInputType;
            let secondValue = item?.compareWithValue || getValues(item?.compare_with_column?.columnName);
            let firstValue = getValues(firstColumnName);
            if (secondInputType === 'dropdown' && firstInputType === 'number') {
              const optionsKey = dynamicKeys[item?.compare_with_column?.columnName];
              const options = dropdownLovData[optionsKey];
              secondValue = options?.[0]?.name;
            }
            const typeConvertedValues = [
              typeCheckAndConvert(firstValue, firstInputType),
              typeCheckAndConvert(secondValue, secondInputType)
            ];
            if (
              ((Array.isArray(firstValue) && firstValue.length > 0) || firstValue) &&
              validationConditions[item?.operatorKey] &&
              ((firstInputType === 'dropdown' && conditionCheckForArray(firstValue, item?.compareWithValue, item?.operatorKey)) ||
                (validationConditions[item?.operatorKey].call && validationConditions[item?.operatorKey].apply(null, typeConvertedValues)))
            ) {
              return true;
            }
          });
          if (isValidRequest) {
            validationErrors[columnName] = message;
          }
        }
      });
      const finalHiddelList = Object.fromEntries(Object.entries(hideColumns).filter((x) => x[1]));
      setState((pre) => ({ ...pre, hiddenFields: finalHiddelList }));
      Object.entries(exitsingValues).forEach(([columnName, value]) => {
        if (
          formValidationsForReqruired.includes(columnName) &&
          !defaultHidden[columnName] &&
          !finalHiddelList[columnName] &&
          !isDeleted.includes(columnName) &&
          ((!value && value !== 0) || (Array.isArray(value) && (value.length === 0 || !value[0])))
        ) {
          validationErrors[columnName] = 'Required';
          return;
        }
      });
      const finalErrors = {};
      // methods.clearErrors();
      // Object.entries(insideErros).forEach(([key, value]) => {
      //   if (finalHiddelList[key] || isDeleted.includes(key) || defaultHidden[key]) {
      //     return true;
      //   }
      //   if (insideErros[key]) {
      //     methods.setError(key, { type: 'validations', message: value });
      //     finalErrors[key] = insideErros[key];
      //     return true;
      //   }
      // });
      Object.entries(validationErrors).forEach(([key, value]) => {
        if (finalHiddelList[key] || isDeleted.includes(key) || defaultHidden[key]) {
          return true;
        }
        if (value) {
          methods.setError(key, { type: 'validations', message: value });
          finalErrors[key] = value;
        }
      });
      Object.keys(errors).forEach((key) => {
        if (!finalErrors[key]) methods.clearErrors(key);
      });
      // setErrorValidations(finalErrors);
    }, 100);
  }, [formFieldsData, getValues, methods, errors, defaultHidden, dynamicKeys, dropdownLovData, formValidationsForReqruired, isDeleted]);

  useEffect(() => {
    validationsChecked();
  }, [validate, validationsChecked]);

  // const firstTimeRender = useRef(true);

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' })); // pass listType: 2 for deleted atributes - it will have no impact
      (async () => {
        let response = await request('/form-response-by-id', {
          method: 'GET',
          query: { formId, responseId }
        });
        if (response.success && response.data?.data?.[0]) {
          reset(response.data.data[0]);
          setState((pre) => ({ ...pre, fetchDropDown: true }));
        } else {
          const error = response.error && response.error.message ? response.error.message : response.error;
          toast(error || 'Operation failed. Please try again.', { variant: 'error' });
        }
      })();
    }
  }, [dispatch, formId, responseId, methods, reset]);

  // useEffect(() => {
  //   if (formFieldsData.length > 0 && Object.keys(inputs).length > 0 && firstTimeRender.current) {
  //     firstTimeRender.current = false;
  //     validationsChecked(inputs);
  //   }
  // }, [inputs, validationsChecked, formFieldsData]);

  const refetchedDropdownValues = useRef({});

  useEffect(() => {
    const hasNewValueSelected = Object.keys(toBeFetchedDropDowns || {})?.length > 0;
    if (fetchDropDown && (toBeFetchedDropDowns === null || Object.keys(toBeFetchedDropDowns)?.length > 0)) {
      const dropdownPayload = {
        formId: formId,
        responseId: responseId,
        skipOthers: hasNewValueSelected,
        selectedHierarchyValue: hasNewValueSelected
          ? toBeFetchedDropDowns
          : formFieldsData.reduce((pre, cur) => {
              pre[cur.name] = getValues(cur.columnName);
              return pre;
            }, {}),
        formDropdowns: formFieldsData
          .filter((item) => item?.default_attribute?.name === 'Dropdown')
          .map((dropdown) => ({
            formAttributeId: dropdown?.id,
            name: dropdown?.name,
            dependency: dropdown?.properties?.dependency,
            sourceTable: dropdown?.properties?.sourceTable,
            sourceColumn: dropdown?.properties?.sourceColumn,
            type: dropdown?.properties?.type,
            conditions: dropdown?.properties?.conditions,
            extraColumn: dropdown?.properties?.extraColumn,
            factoryTable: dropdown?.properties?.factoryTable,
            factoryColumn: dropdown?.properties?.factoryColumn,
            linkColumn: dropdown?.properties?.linkColumn,
            isWebResponse: !!dropdown?.properties?.factoryTable
          }))
      };
      dispatch(getDropDownLov({ dropdownPayload, refetched: hasNewValueSelected, apiVersion: 'v2' }));
    }
    if (toBeFetchedDropDowns) {
      refetchedDropdownValues.current = { ...toBeFetchedDropDowns };
    }
  }, [formFieldsData, formId, responseId, fetchDropDown, dispatch, methods, toBeFetchedDropDowns, getValues]);

  useEffect(() => {
    const object = {};
    Object.entries(dynamicKeys).forEach(([key, value]) => {
      if (
        requiredFields[key] &&
        filteredDataForDropDown(value, dependencies[key])?.length <= 1 &&
        filteredDataForDropDown(value, dependencies[key]).map((x) => x.id)?.[0] !== getValues(key)?.[0]
      ) {
        object[key] = filteredDataForDropDown(value, dependencies[key]).map((x) => x.id);
      }
    });
    const keyGenerator = dynamicdataKeyGenerator('Key Generator', { ...getValues(), ...object });
    const generator = dynamicdata('generator', { ...getValues(), ...object });
    const allValuesToBeUpdate = Object.entries({ ...object, ...keyGenerator, ...generator });
    if (allValuesToBeUpdate.length > 0) {
      allValuesToBeUpdate.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
    setState((pre) => ({ ...pre, validate: !pre.validate }));
  }, [
    filteredDataForDropDown,
    dynamicKeys,
    dependencies,
    requiredFields,
    setValue,
    getValues,
    dynamicdataKeyGenerator,
    dynamicdata,
    methods
  ]);

  const handleOnchange = (text, input, inputType, doValidate = true, autoFocus = false) => {
    if (inputType === 'dropdown') {
      const updatedDropdown = {
        [input]: text
      };
      const filtered = formFieldsData
        .map((x) => {
          if (x?.properties?.dependency) {
            return {
              child: x.columnName,
              parent: allColumnsWithId[x?.properties?.dependency]
            };
          }
          return null;
        })
        .filter((x) => x);
      filtered.forEach(({ child, parent }) => {
        if (child && parent) {
          const lovKey = dynamicKeys[child];
          const isSameDep = Object.hasOwn(sameDependencies, lovKey);
          const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
          const availableOptions = dropdownLovData[lovKey]
            ?.filter((x) => (updatedDropdown[parent] || getValues(parent) || [])?.includes(x[keyToCheck]))
            .map((x) => x.id);
          const childValues = Object.hasOwn(updatedDropdown, child) ? updatedDropdown[child] : getValues(child) || [];
          updatedDropdown[child] = childValues?.filter((x) => availableOptions?.includes(x));
        }
      });
      const keyGenerator = dynamicdataKeyGenerator('Key Generator', { ...getValues(), ...updatedDropdown });
      const generator = dynamicdata('generator', { ...getValues(), ...updatedDropdown });
      Object.entries({ ...updatedDropdown, ...keyGenerator, ...generator }).forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      const keyGenerator = dynamicdataKeyGenerator('Key Generator', { ...getValues(), ...{ [input]: text } });
      const generator = dynamicdata('generator', { ...getValues(), ...{ [input]: text } });
      Object.entries({ [input]: text, ...keyGenerator, ...generator }).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
    if (doValidate) {
      setState((pre) => ({ ...pre, validate: !pre.validate }));
    }
    if (!autoFocus && fieldsChildrenAttributes[input] && text.length > 0 && inputType === 'dropdown') {
      setState((pre) => ({ ...pre, toBeFetchedDropDowns: { [fieldsChildrenAttributes[input]]: text } }));
    }
  };

  const onFormSubmit = async (values) => {
    const cloneValues = structuredClone(values);
    Object.entries(cloneValues).forEach(([key]) => {
      if (hiddenFields[key] && !defaultHidden.includes(key)) {
        cloneValues[key] = null;
      }
    });
    cloneValues.updated_at = Date.now() + '';
    // update approver name and approval date as per given access of approval level columns - ignore if admin updates!
    if (user?.id !== '577b8900-b333-42d0-b7fb-347abc3f0b5c' && user?.id !== '57436bed-c176-4625-96af-aaeec88cdc90') {
      if (
        formFieldsData?.filter((x) => x.columnName.startsWith('l_a') && x.update)?.length &&
        Object.hasOwnProperty.call(cloneValues, 'l_a_approval_status') &&
        Object.hasOwnProperty.call(cloneValues, 'l_b_approval_status') &&
        cloneValues['l_a_approval_status']?.[0] === findStatus('L1ApprovalStatusData', 'Approved') &&
        cloneValues['l_b_approval_status']?.[0] === findStatus('L2ApprovalStatusData', 'Rejected')
      ) {
        // reset l2 approval status blank for reverification purpose when l1 validator self corrected data instead of resurvey
        cloneValues['l_b_approval_status'] = null;
      }
      const approverNameObjects = formFieldsData?.filter((obj) => approverNamePattern.test(obj.columnName) && obj.update);
      approverNameObjects.forEach((obj) => {
        cloneValues[obj.columnName] = [user?.id];
      });
      const approvalDateObjects = formFieldsData?.filter((obj) => approvalDatePattern.test(obj.columnName) && obj.update);
      approvalDateObjects.forEach((obj) => {
        cloneValues[obj.columnName] = getCurrentFormattedDate();
      });
    }
    cloneValues.source = 'web';
    cloneValues.is_active = 1;
    const formData = new FormData();
    Object.entries(cloneValues)?.forEach(([key, value]) => {
      const inputType = inputTypes[key];
      const hidden = hiddenFields[key] && !defaultHidden.includes(key);
      const isDelete = isDeleted[key];
      if (hidden || isDelete || (Array.isArray(value) && value.length > 0 && !value[0])) {
        return formData.append(key, null);
      }
      if (value && inputType && ['file', 'image'].includes(inputType)) {
        value?.forEach(async (y, ind) => {
          if (Object.prototype.toString.call(y) === '[object File]') {
            if (y.fileName && !y.name) {
              y.name = y.fileName;
            }
            return formData.append(`${key} - ${ind}`, y);
          } else {
            formData.append(key, y);
            return formData.append(key, y);
          }
        });
      } else {
        if (Array.isArray(value)) {
          formData.append(key, value[0] || '');
          value?.forEach((_x) => {
            formData.append(key, _x);
          });
        } else {
          formData.append(key, value);
        }
      }
    });
    setState((pre) => ({ ...pre, submitState: true }));
    let response = await request(`/form/update-response`, {
      method: 'PUT',
      body: formData,
      params: formId,
      query: { keepOlderVersion: true },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.success) {
      toast(
        'Response Updated Successfully',
        {
          variant: 'success',
          autoHideDuration: null
        },
        () => {
          window.close();
        }
      );
    } else {
      setState((pre) => ({ ...pre, submitState: false }));
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const [toBeDisabled, setToBeDisabled] = useState({});

  useEffect(() => {
    if (dropdownLovData) {
      const approvedL1 = l_a_approval_status?.[0] === findStatus('L1ApprovalStatusData', 'Approved');
      const rejectedL1 = l_a_approval_status?.[0] === findStatus('L1ApprovalStatusData', 'Rejected');
      const approvedL2 = l_b_approval_status?.[0] === findStatus('L2ApprovalStatusData', 'Approved');
      const newToBeDisabled = {
        l_a_exception_ctg: approvedL1,
        l_a_exception_rmk: approvedL1,
        is_resurvey: true,
        resurveyor_org_type: !rejectedL1,
        resurveyor_org_id: !rejectedL1,
        resurvey_by: !rejectedL1,
        l_b_approval_status: !approvedL1,
        l_b_exception_ctg: !approvedL1 || approvedL2,
        l_b_exception_rmk: !approvedL1 || approvedL2,
        l_b_remark: !approvedL1
      };

      setToBeDisabled(newToBeDisabled);

      Object.entries(newToBeDisabled).forEach(([column, isDisabled]) => {
        if (isDisabled && !['resurveyor_org_type', 'resurveyor_org_id', 'resurvey_by'].includes(column)) {
          setValue(column, column === 'is_resurvey' ? (rejectedL1 ? 'YES' : 'NO') : null);
        }
      });
    }
  }, [l_a_approval_status, l_b_approval_status, dropdownLovData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard
          sx={{ mb: 2 }}
          title={
            <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton sx={{ position: 'absolute', left: 10 }} onClick={() => window.close()} color="primary">
                  <ArrowBackOutlinedIcon />
                </IconButton>
                <Typography sx={{ position: 'relative', left: 25 }} variant="h4">
                  Response
                </Typography>
              </Grid>
              {(!dropdownLov.loading && dropdownLov.dropdownLovDataObject.length === 0) ||
              (!dropdownLov.loading && dropdownLov.dropdownLovDataObject.length > 0 && dataFecthed) ? (
                mode === 'edit' && (
                  <Grid item>
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitState || !(isDirty && !Object.keys(errors).some((x) => x))}
                    >
                      Update
                    </Button>
                  </Grid>
                )
              ) : (
                <>
                  <Grid item display={'flex'} sx={{ minHeight: 30, alignItems: 'center' }}>
                    <LoadingText variant="h6" sx={{ mr: 2 }}>
                      Processing form data, Please wait...
                    </LoadingText>
                  </Grid>
                  {!dataFecthed && <Loader />}
                </>
              )}
            </Grid>
          }
          contentSX={{ padding: '16px 16px 0px 16px' }}
        >
          <Grid container spacing={2} sx={{ height: '68vh' }}>
            <Grid item md={8.4} sx={{ height: '100%', overflowY: 'auto', marginRight: 2, paddingRight: 2 }}>
              <Grid
                container
                item
                rowSpacing={4}
                columnSpacing={2.5}
                sx={{ padding: 1, direction: 'ltr', justifyContent: 'space-between' }}
              >
                {isMapping && mode !== 'view' && (
                  <>
                    <Grid item md={6}>
                      <OutlinedInput
                        value={searchValue}
                        onChange={(e) => setState((pre) => ({ ...pre, searchValue: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setState((pre) => ({ ...pre, searchValue: e.target.value }));
                          }
                        }}
                        placeholder={'Search...'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={searchValue ? searchDataMapping : () => {}} style={{ cursor: 'pointer' }}>
                              <SearchOutlined />
                            </IconButton>
                          </InputAdornment>
                        }
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item md={6} />
                  </>
                )}
                {formFieldsData &&
                  formFieldsData
                    .filter((item) => !hiddenFields[item.columnName])
                    .map((item) =>
                      [
                        'text',
                        'number',
                        'email',
                        'phone',
                        'location',
                        'network',
                        'key_generator',
                        'qrcode',
                        'ocr',
                        'optical',
                        'plus_code',
                        'ref_code'
                      ].includes(item.default_attribute?.inputType) ? (
                        <Grid item md={6} key={item.id}>
                          <RHFTextField
                            name={item.columnName}
                            handleBlur={(event) => {
                              if (
                                item.default_attribute?.inputType === 'qrcode' &&
                                allParentColumns?.[item?.columnName]?.some((x) => inputTypes[x] === 'dropdown')
                              ) {
                                setState((pre) => ({
                                  ...pre,
                                  toBeFetchedDropDowns: { [fieldsChildrenAttributes[item?.columnName]]: event.target.value }
                                }));
                              }
                            }}
                            type={item.default_attribute?.inputType === 'number' ? 'number' : 'text'}
                            label={item.name}
                            minLength={item.properties?.minLength}
                            maxLength={item.properties?.maxLength}
                            decimal={item.properties?.decimal}
                            fieldType={item.default_attribute?.inputType}
                            decimalPoint={item.properties?.decimalPoints}
                            setInsideErrors={(func) =>
                              methods.setError(item.columnName, { type: 'validations', message: func({})[item.columnName] })
                            }
                            disabled={
                              approvalDatePattern.test(item.columnName) ||
                              mode === 'view' ||
                              !item.update ||
                              (['text', 'number', 'email', 'phone'].includes(item.default_attribute?.inputType) &&
                                !editable.includes(item?.columnName)) ||
                              (!['text', 'number', 'email', 'phone'].includes(item.default_attribute?.inputType) &&
                                item.properties &&
                                item.properties.editable !== undefined &&
                                !item.properties.editable) ||
                              toBeDisabled[item.columnName]
                            }
                            multiline={item.default_attribute?.inputType === 'number' ? false : true}
                            handleChange={(value) =>
                              handleOnchange(value.target?.value, item?.columnName, item?.default_attribute?.inputType)
                            }
                            InputProps={{
                              style: {
                                resize: 'vertical',
                                overflowY: 'hidden',
                                height: '40px',
                                minHeight: '40px'
                              }
                            }}
                            required={formValidationsForReqruired.includes(item.columnName)}
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'date' ? (
                        <Grid item md={6} key={item.id}>
                          <RHFDateTimePicker
                            name={item.columnName}
                            label={item.name}
                            pickerType={item.properties?.pickerType || ''}
                            timeFormat={item.properties?.timeFormat || ''}
                            minDate={item.properties?.minDate}
                            maxDate={item.properties?.maxDate}
                            setInsideErrors={(func) =>
                              methods.setError(item.columnName, { type: 'validations', message: func({})[item.columnName] })
                            }
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType)}
                            disabled={
                              approvalDatePattern.test(item.columnName) ||
                              mode === 'view' ||
                              !item.update ||
                              !editable.includes(item?.columnName) ||
                              toBeDisabled[item.columnName]
                            }
                            required={formValidationsForReqruired.includes(item.columnName)}
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'chip' ? (
                        <Grid item md={6} key={item.id}>
                          <RHFSelectTags
                            name={item.columnName}
                            single={true}
                            disable={
                              mode === 'view' ||
                              !item.update ||
                              (item.properties && item.properties.editable !== undefined && !item.properties.editable) ||
                              toBeDisabled[item.columnName]
                            }
                            placeholder="Select Field"
                            label={item.name}
                            onChange={(value, autoFocus) =>
                              handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true, autoFocus === 1)
                            }
                            menus={
                              item.properties?.values?.split(',').map((val) => ({
                                id: val,
                                name: val
                              })) || []
                            }
                            required={formValidationsForReqruired.includes(item.columnName)}
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'checkbox' ? (
                        <Grid item md={6} key={item.id}>
                          <RHFSelectTags
                            name={item.columnName}
                            disable={
                              mode === 'view' ||
                              !item.update ||
                              (item.properties && item.properties.editable !== undefined && !item.properties.editable)
                            }
                            single={item.properties?.selectType === 'single'}
                            placeholder="Select Field"
                            label={item.name}
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true)}
                            menus={
                              item.properties?.values?.split(',').map((val) => ({
                                id: val,
                                name: val
                              })) || []
                            }
                            required={formValidationsForReqruired.includes(item.columnName)}
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'dropdown' ? (
                        <Grid item md={6} key={item.id}>
                          <RHFSelectTags
                            name={item.columnName}
                            disable={
                              approverNamePattern.test(item.columnName) ||
                              mode === 'view' ||
                              !item.update ||
                              ((!!item?.isRequired || !!item?.properties?.factoryTable) &&
                                filteredDataForDropDown(dynamicKeys[item.columnName], item.properties?.dependency)?.length === 1) ||
                              !editable.includes(item?.columnName) ||
                              toBeDisabled[item.columnName]
                            }
                            single={item.properties?.selectType === 'single'}
                            placeholder="Select Field"
                            label={item.name}
                            autoSelect={
                              (!!item?.isRequired || !!item?.properties?.factoryTable) &&
                              filteredDataForDropDown(dynamicKeys[item.columnName], item.properties?.dependency)?.length === 1
                            }
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true)}
                            menus={filteredDataForDropDown(dynamicKeys[item.columnName], item.properties?.dependency) || []}
                            required={formValidationsForReqruired.includes(item.columnName)}
                            customKeyName={dropdownLov.sourceColumnByIdObject[item.name]}
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'image' || item.default_attribute?.inputType === 'blob' ? (
                        <Grid item md={6} key={item.id}>
                          <Stack spacing={1}>
                            <Typography>
                              {item.name}
                              {item.isRequired && ' *'}
                            </Typography>
                            <RHFImageUpload
                              name={item.columnName}
                              setState={setState}
                              validationsChecked={() => setState((pre) => ({ ...pre, validate: !pre.validate }))}
                              mode={mode}
                              item={item}
                              openDeleteModal={openDeleteModal}
                              disabled={mode === 'view' || !item.update}
                              sx={{
                                '& .MuiFormHelperText-root': {
                                  position: 'absolute',
                                  top: 37,
                                  left: -10
                                },
                                background: mode !== 'view' && item.update ? '#fff' : '#f2f2f2'
                              }}
                              required={formValidationsForReqruired.includes(item.columnName)}
                            />
                          </Stack>
                        </Grid>
                      ) : item.default_attribute?.inputType === 'file' ? (
                        <Grid item md={6} key={item.id}>
                          <Stack spacing={1}>
                            <Typography>
                              {item.name}
                              {item.isRequired && ' *'}
                            </Typography>
                            <RHFImageUpload
                              name={item.columnName}
                              setState={setState}
                              mode={mode}
                              item={item}
                              validationsChecked={() => setState((pre) => ({ ...pre, validate: !pre.validate }))}
                              openDeleteModal={openDeleteModal}
                              disabled={mode === 'view' || !item.update}
                              placeholderType={'file'}
                              sx={{
                                '& .MuiFormHelperText-root': {
                                  position: 'absolute',
                                  top: 37,
                                  left: -10
                                },
                                background: mode !== 'view' && item.update ? '#fff' : '#f2f2f2'
                              }}
                              required={formValidationsForReqruired.includes(item.columnName)}
                            />
                          </Stack>
                        </Grid>
                      ) : (
                        <></>
                      )
                    )}
              </Grid>
            </Grid>
            <Grid
              item
              md={3.4}
              sx={{
                height: '100%',
                overflowY: 'auto',
                border: '1px dashed grey',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0px 8px !important',
                marginTop: 1
              }}
            >
              {(() => {
                const previewArray = Array.isArray(preview?.inputValue) ? preview?.inputValue : [preview?.inputValue];
                return preview?.inputValue && previewArray.length > 0 && previewArray[0] ? (
                  <ImageCard
                    blockMode
                    mode={mode}
                    imageList={previewArray}
                    setState={setState}
                    setValue={(key, value) => {
                      setValue(key, value?.length === 0 ? [''] : value);
                      setState((pre) => ({ ...pre, validate: !pre.validate }));
                    }}
                    preview={preview}
                    type={inputTypes[preview?.columnName]}
                  />
                ) : (
                  <Typography>Image Preview</Typography>
                );
              })()}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Dialog
        open={searchModal}
        onClose={() => setState((pre) => ({ ...pre, searchModal: false }))}
        scroll="paper"
        disableEscapeKeyDown
        maxWidth="lg"
      >
        <TableForm
          title={'Fetched Records'}
          data={visibleData}
          columns={searchedDataColumns}
          count={visibleData?.length || 0}
          hideSearch
          hideAddButton
          hideEditIcon
          hideDeleteIcon
          hideRestoreIcon
          hideHistoryIcon
          selectIcon
          miniAction
          hideColumnsSelect
          hideExportButton
          handleRowView={handleRowSelect}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Dialog>
    </>
  );
};

export default FormResponseData;

function RHFImageUpload({ name, placeholderType = 'default', setState, mode, item, openDeleteModal, validationsChecked, ...rest }) {
  const { control, watch, setValue } = useFormContext();
  const value = watch(name);

  const renderFileInput = () => (
    <FileInputComponent
      maxCount={item.properties?.imageCount}
      maxSize={item.properties?.maxSize}
      multiple={item.properties?.imageCount && item.properties?.imageCount !== '1'}
      columnName={item.columnName}
      isDocument={item.default_attribute.inputType === 'file'}
      validationsChecked={validationsChecked}
      setValue={setValue}
      value={value}
    />
  );

  const placeholder = {
    file: value?.length > 0 ? 'Open File' : 'No File Available'
  };

  const downloadFile = (fileUrl) => {
    const link = document.createElement('a');
    link.href = typeof fileUrl === 'object' ? URL.createObjectURL(fileUrl) : fileUrl;
    link.target = '_blank';
    link.click();
  };

  const confirmDelete = () => {
    setValue(name, null);
    setState((pre) => ({ ...pre, openDeleteModal: false }));
    validationsChecked();
  };

  const inputProps = {
    default: {
      readOnly: true,
      style: {
        resize: 'vertical',
        overflowY: 'hidden',
        height: '40px',
        minHeight: '40px'
      },
      endAdornment: (Array.isArray(value) ? (value?.length > 0 && value[0] ? true : false) : value ? true : false) ? (
        <>
          <IconButton onClick={() => setState((pre) => ({ ...pre, preview: { inputValue: value, ...item } }))} color="primary">
            <VisibilityIcon />
          </IconButton>
          {mode !== 'view' &&
            item.update &&
            value?.length < item.properties?.imageCount &&
            item.default_attribute?.inputType === 'image' &&
            renderFileInput(item)}
        </>
      ) : (
        <>
          <IconButton color="secondary">
            <VisibilityIcon />
          </IconButton>
          {mode !== 'view' && item.update && item.default_attribute?.inputType === 'image' && renderFileInput(item)}
        </>
      )
    },
    file: {
      readOnly: true,
      style: {
        resize: 'vertical',
        overflowY: 'hidden',
        height: '40px',
        minHeight: '40px'
      },
      endAdornment:
        value?.length > 0 ? (
          <>
            <IconButton onClick={() => downloadFile(value?.[0])} color="primary">
              <DescriptionOutlinedIcon />
            </IconButton>
            {mode !== 'view' && item.update && (
              <DeleteOutlineIcon
                sx={{ cursor: 'pointer' }}
                title="Delete"
                color="primary"
                onClick={() => {
                  setState((pre) => ({ ...pre, deleteFile: item.columnName }));
                  setState((pre) => ({ ...pre, openDeleteModal: true }));
                }}
              />
            )}
            <ConfirmModal
              open={openDeleteModal}
              handleClose={() => setState((pre) => ({ ...pre, openDeleteModal: false }))}
              handleConfirm={confirmDelete}
              title="Delete File"
              message="Are you sure you want to delete?"
              confirmBtnTitle="Delete"
            />
          </>
        ) : (
          <>
            <IconButton color="secondary">
              <DescriptionOutlinedIcon />
            </IconButton>
            {mode !== 'view' && item.update && renderFileInput(item)}
          </>
        )
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <>
          <TextField
            {...rest}
            placeholder={
              placeholder[placeholderType] || Array.isArray(value)
                ? value?.length > 0
                  ? 'View Image'
                  : 'No Image Available'
                : value
                ? 'View Image'
                : 'No Image Available'
            }
            error={!!error}
            helperText={error?.message}
            errorMessage={error?.message}
            InputProps={inputProps[placeholderType || 'default'] || {}}
          />
        </>
      )}
    />
  );
}
