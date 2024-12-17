import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Button, Typography, TextField, Stack, IconButton, OutlinedInput, InputAdornment, Dialog } from '@mui/material';
import { useForm } from 'react-hook-form';
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
import ImageCard from './response-images';
import FileInputComponent from './image-upload';
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
  const isReset = useRef(false);
  const { user } = useAuth();
  const { formId, responseId, mode } = useParams();
  const { formAttributes, dropdownLov } = useDefaultFormAttributes();
  const [preview, setPreview] = useState();
  const [inputs, setInputsValues] = useState({});
  const [hiddenFields, setHiddenFields] = useState({});
  const [errorValidations, setErrorValidations] = React.useState({});
  const [searchValue, setSearchValue] = useState('');
  const [searchModal, setSearchModal] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [searchedDataColumns, setSearchedDataColumns] = useState([]);
  const [validate, setValidate] = useState(false);
  const checkValidation = useRef(false);
  const [insideErros, setInsideErrors] = useState({});
  const [dropdownLovData, setDropdownLovData] = useState();
  const [sameDependencies, setSameDependencies] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteFile, setDeleteFile] = useState('');
  const [editable, setEditable] = useState([]);
  const [submitState, setSubmitState] = useState(false);
  const [dataFecthed, setDataFetched] = useState(false);

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
        row[x.columnName] && ONLY_NUMBER_WITH_PLUS.test(row[x.columnName])
          ? setInsideErrors((prev) => ({ ...prev, [x.columnName]: '' }))
          : setInsideErrors((prev) => ({ ...prev, [x.columnName]: 'Please enter valid phone number.' }));
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
    setEditable(clonedEdit);

    setInputs((pre) => ({ ...pre, ...object, ...row }));
    checkValidation.current = true;
    setValidate((pre) => !pre);
    setSearchModal(false);
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
        setSearchModal(true);
        let headers = Object.keys(response.data.data[0]);
        let columns = headers.map((header) => ({ Header: header, accessor: header }));
        setSearchedDataColumns(columns);
        setSearchedData(response.data.data);
        setVisibleData(response.data.visibleData);
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
      l_a_approval_status: inputs?.['l_a_approval_status']?.[0] || undefined,
      l_b_approval_status: inputs?.['l_b_approval_status']?.[0] || undefined
    };
  }, [inputs]);

  const {
    dynamicKeys,
    dependencies,
    requiredFields,
    allColumnsWithId,
    allDepenedentColumnsById,
    defaultHidden,
    inputeTypes,
    formValidationsForReqruired,
    isDeleted,
    dependentDropdownsFields,
    dynamicKeysByName,
    disableOnSearch,
    editableFields
  } = useMemo(() => {
    const initialState = {
      dependentDropdownsFields: [],
      dynamicKeysByName: {},
      dynamicKeys: {},
      dependencies: {},
      requiredFields: {},
      allColumnsWithId: {},
      allDepenedentColumnsById: {},
      inputeTypes: {},
      defaultHidden: [],
      formValidationsForReqruired: [],
      isDeleted: [],
      disableOnSearch: [],
      editableFields: []
    };
    if (formFieldsData && formFieldsData.length > 0) {
      return formFieldsData.reduce((pre, acc) => {
        pre.dynamicKeys[acc.columnName] = acc.name?.replace(/\s/g, '') + 'Data';
        pre.dynamicKeysByName[acc.name] = acc.name?.replace(/\s/g, '') + 'Data';
        pre.allColumnsWithId[acc.id] = acc.columnName;
        pre.allDepenedentColumnsById[acc.columnName] = acc.properties.dependency;
        pre.inputeTypes[acc.columnName] = acc.default_attribute.inputType;
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
        return pre;
      }, initialState);
    }
    return initialState;
  }, [formFieldsData]);

  useEffect(() => {
    setEditable(editableFields);
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

  useEffect(() => {
    if (
      Object.keys(allDepenedentColumns).length > 0 &&
      dependentDropdownsFields.length > 0 &&
      dropdownLov?.dropdownLovDataObject?.length > 0
    ) {
      const sameConditionDepenedentColumns = [];
      Object.entries(allDepenedentColumns).forEach(([key, value]) => {
        // the self field is depends on the value of dependent field value
        const self = dependentDropdownsFields.find((x) => x.columnName === key);
        const dependent = dependentDropdownsFields.find((x) => x.columnName === value);
        if (
          dependent?.properties?.conditions &&
          self?.properties?.conditions?.length &&
          dependent?.properties?.conditions?.length &&
          self?.properties?.sourceTable === dependent?.properties?.sourceTable &&
          JSON.stringify(dependent.properties.conditions) === JSON.stringify(self.properties.conditions)
        ) {
          sameConditionDepenedentColumns.push([dependent.name, self.name]);
        }
      });
      const data = {};
      dropdownLov?.dropdownLovDataObject?.forEach((item) => {
        if (!sameConditionDepenedentColumns.some((x) => x?.[1] === Object.keys(item)[0])) {
          const [key] = Object.keys(item);
          const formattedKey = key.replace(/\s/g, '') + 'Data';
          data[formattedKey] = item[key];
          const index = sameConditionDepenedentColumns.findIndex((x) => x?.[0] === key);
          if (index > -1) {
            const [self, dependent] = sameConditionDepenedentColumns[index];
            const formattedDepKey = dependent.replace(/\s/g, '') + 'Data';
            data[formattedDepKey] = item[self];
          }
        }
      });
      setDropdownLovData(data);
      setSameDependencies(sameConditionDepenedentColumns);
      setDataFetched(true);
    }
  }, [allDepenedentColumns, dependentDropdownsFields, dropdownLov]);

  const filteredDataForDropDown = useCallback(
    (dynamicKey, dependency) => {
      if (!dependency) {
        return dropdownLovData?.[dynamicKey];
      }
      const dependentColumn = allColumnsWithId[dependency];
      const inputValue = inputs?.[dependentColumn];
      if (inputValue === undefined) {
        return [];
      }
      const isSameDep = sameDependencies.some(([, dependent]) => dynamicKeysByName[dependent] === dynamicKey);
      const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
      if (typeof inputValue === 'string') {
        return dropdownLovData?.[dynamicKey]?.filter((items) => inputValue === items[keyToCheck]);
      } else {
        return dropdownLovData?.[dynamicKey]?.filter((items) => inputValue?.includes(items?.[keyToCheck]));
      }
    },
    [allColumnsWithId, inputs, sameDependencies, dropdownLovData, dynamicKeysByName]
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
              const customKeyName =
                (item?.properties?.dependency &&
                  sameDependencies.some((x) => x[1] === item.name) &&
                  dropdownLov?.sourceColumnByIdObject?.[item.properties.sourceColumn]) ||
                '';
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
    [formFieldsData, dropdownLovData, dropdownLov?.sourceColumnByIdObject, sameDependencies]
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

  const methods = useForm({
    mode: 'all',
    defaultValues: {}
  });
  const { handleSubmit, setValue } = methods;

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
      const exitsingValues = methods.getValues();
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
            let secondValue = item?.compareWithValue || methods.getValues(item?.compare_with_column?.columnName);
            let firstValue = methods.getValues(firstColumnName);
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
      setHiddenFields(finalHiddelList);
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
      methods.clearErrors();
      Object.entries(insideErros).forEach(([key, value]) => {
        if (finalHiddelList[key] || isDeleted.includes(key) || defaultHidden[key]) {
          return true;
        }
        if (insideErros[key]) {
          methods.setError(key, { type: 'validations', message: value });
          finalErrors[key] = insideErros[key];
          return true;
        }
      });
      Object.entries(validationErrors).forEach(([key, value]) => {
        if (insideErros[key] || finalHiddelList[key] || isDeleted.includes(key) || defaultHidden[key]) {
          return true;
        }
        if (value) {
          methods.setError(key, { type: 'validations', message: value });
          finalErrors[key] = value;
        }
      });
      setErrorValidations(finalErrors);
    }, 100);
  }, [defaultHidden, dropdownLovData, dynamicKeys, formFieldsData, methods, insideErros, formValidationsForReqruired, isDeleted]);

  useEffect(() => {
    validationsChecked();
  }, [validate, validationsChecked]);

  const firstTimeRender = useRef(true);

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' })); // pass listType: 2 for deleted atributes - it will have no impact
      (async () => {
        let response = await request('/form-response-by-id', {
          method: 'GET',
          query: { formId, responseId }
        });
        if (response.success && response.data?.data?.[0]) {
          setInputsValues(response.data.data[0]);
          methods.reset(response.data.data[0]);
        } else {
          const error = response.error && response.error.message ? response.error.message : response.error;
          toast(error || 'Operation failed. Please try again.', { variant: 'error' });
        }
      })();
    }
  }, [dispatch, formId, responseId, methods]);

  useEffect(() => {
    if (formFieldsData.length > 0 && Object.keys(inputs).length > 0 && firstTimeRender.current) {
      firstTimeRender.current = false;
      validationsChecked(inputs);
    }
  }, [inputs, validationsChecked, formFieldsData]);

  useEffect(() => {
    const dropdownPayload = {
      formId: formId,
      responseId: responseId,
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
    formFieldsData && formFieldsData.length && dispatch(getDropDownLov({ dropdownPayload }));
  }, [formFieldsData, formId, responseId, dispatch]);

  const setInputs = useCallback(
    (arg) => {
      if (typeof arg === 'function') {
        setInputsValues((prev) => {
          const keyGenerator = dynamicdataKeyGenerator('Key Generator', arg(prev));
          const generator = dynamicdata('generator', arg(prev));
          const valuesToBeUpdated = {
            ...arg(prev),
            ...keyGenerator,
            ...generator
          };
          methods.reset(valuesToBeUpdated);
          return valuesToBeUpdated;
        });
      } else {
        const keyGenerator = dynamicdataKeyGenerator('Key Generator', arg);
        const generator = dynamicdata('generator', arg);
        methods.reset({ ...arg, ...keyGenerator, ...generator });
        setInputsValues({ ...arg, ...keyGenerator, ...generator });
      }
    },
    [setInputsValues, dynamicdata, dynamicdataKeyGenerator, methods]
  );

  useEffect(() => {
    const object = {};
    Object.entries(dynamicKeys).forEach(([key, value]) => {
      if (
        requiredFields[key] &&
        filteredDataForDropDown(value, dependencies[key])?.length <= 1 &&
        filteredDataForDropDown(value, dependencies[key]).map((x) => x.id)?.[0] !== inputs?.[key]?.[0]
      ) {
        object[key] = filteredDataForDropDown(value, dependencies[key]).map((x) => x.id);
      }
    });
    if (Object.keys(object).length > 0) {
      setInputs((pre) => ({ ...pre, ...object }));
    }
    setValidate((pre) => !pre);
  }, [filteredDataForDropDown, dynamicKeys, dependencies, requiredFields, inputs, setInputs]);

  const handleOnchange = (text, input, inputType, doValidate = true) => {
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
          const isSameDep = sameDependencies.some(([, dependent]) => dynamicKeysByName[dependent] === lovKey);
          const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
          const availableOptions = dropdownLovData[lovKey]
            ?.filter((x) => (updatedDropdown[parent] || inputs[parent] || [])?.includes(x[keyToCheck]))
            .map((x) => x.id);
          const childValues = Object.hasOwn(updatedDropdown, child) ? updatedDropdown[child] : inputs[child] || [];
          updatedDropdown[child] = childValues?.filter((x) => availableOptions?.includes(x));
        }
      });
      setInputs((prevState) => {
        const udpatedValues = { ...prevState, ...updatedDropdown };
        if (!isReset.current) {
          methods.reset(udpatedValues);
        }
        return udpatedValues;
      });
    } else {
      setInputs((prevState) => {
        const udpatedValues = { ...prevState, [input]: text };
        return udpatedValues;
      });
    }
    if (doValidate) {
      validationsChecked({ [input]: text });
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
      const inputType = inputeTypes[key];
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
    setSubmitState(true);
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
      setSubmitState(false);
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const [toBeDisabled, setToBeDisabled] = useState({});

  useEffect(() => {
    if (dropdownLovData) {
      const approvedL1 = inputs['l_a_approval_status']?.[0] === findStatus('L1ApprovalStatusData', 'Approved');
      const rejectedL1 = inputs['l_a_approval_status']?.[0] === findStatus('L1ApprovalStatusData', 'Rejected');
      const approvedL2 = inputs['l_b_approval_status']?.[0] === findStatus('L2ApprovalStatusData', 'Approved');
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
          setInputs((prevInputs) => ({ ...prevInputs, [column]: column === 'is_resurvey' ? (rejectedL1 ? 'YES' : 'NO') : null }));
        }
      });
    }
  }, [inputs['l_a_approval_status'], inputs['l_b_approval_status'], dropdownLovData]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderFileInput = (item) => (
    <FileInputComponent
      maxCount={item.properties?.imageCount}
      maxSize={item.properties?.maxSize}
      remCount={
        inputs[item.columnName]?.[0]
          ? item.properties?.imageCount - inputs[item.columnName]?.length
          : inputs[item.columnName]?.length
          ? item.properties?.imageCount - inputs[item.columnName]?.length + 1
          : item.properties?.imageCount
      }
      multiple={item.properties?.imageCount && item.properties?.imageCount !== '1'}
      columnName={item.columnName}
      inputs={inputs}
      setInputs={setInputs}
      isDocument={item.default_attribute.inputType === 'file'}
    />
  );

  const downloadFile = (fileUrl) => {
    const link = document.createElement('a');
    link.href = typeof fileUrl === 'object' ? URL.createObjectURL(fileUrl) : fileUrl;
    link.target = '_blank';
    link.click();
  };

  const confirmDelete = () => {
    setValue(deleteFile, null);
    setInputsValues((pre) => ({ ...pre, [deleteFile]: null }));
    validationsChecked();
    setOpenDeleteModal(false);
  };

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
                      disabled={Object.values(errorValidations).some((x) => x) || submitState}
                    >
                      Update
                    </Button>
                  </Grid>
                )
              ) : (
                <>
                  <LoadingText variant="h6" sx={{ mr: 2 }}>
                    Processing form data, Please wait...
                  </LoadingText>
                  <Loader />
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
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setSearchValue(e.target.value);
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
                            type={item.default_attribute?.inputType === 'number' ? 'number' : 'text'}
                            label={item.name}
                            minLength={item.properties?.minLength}
                            maxLength={item.properties?.maxLength}
                            decimal={item.properties?.decimal}
                            fieldType={item.default_attribute?.inputType}
                            decimalPoint={item.properties?.decimalPoints}
                            setInsideErrors={setInsideErrors}
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
                            errorMessage={errorValidations[item.columnName]}
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
                            setInsideErrors={setInsideErrors}
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType)}
                            disabled={
                              approvalDatePattern.test(item.columnName) ||
                              mode === 'view' ||
                              !item.update ||
                              !editable.includes(item?.columnName) ||
                              toBeDisabled[item.columnName]
                            }
                            errorMessage={errorValidations[item.columnName]}
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
                            defaultValue={inputs[item.columnName]}
                            label={item.name}
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true)}
                            menus={
                              item.properties?.values?.split(',').map((val) => ({
                                id: val,
                                name: val
                              })) || []
                            }
                            errorMessage={errorValidations[item.columnName]}
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
                            defaultValue={inputs[item.columnName]}
                            label={item.name}
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true)}
                            menus={
                              item.properties?.values?.split(',').map((val) => ({
                                id: val,
                                name: val
                              })) || []
                            }
                            errorMessage={errorValidations[item.columnName]}
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
                            defaultValue={inputs[item.columnName]}
                            label={item.name}
                            autoSelect={
                              (!!item?.isRequired || !!item?.properties?.factoryTable) &&
                              filteredDataForDropDown(dynamicKeys[item.columnName], item.properties?.dependency)?.length === 1
                            }
                            onChange={(value) => handleOnchange(value, item?.columnName, item?.default_attribute?.inputType, true)}
                            menus={filteredDataForDropDown(dynamicKeys[item.columnName], item.properties?.dependency) || []}
                            errorMessage={errorValidations[item.columnName]}
                            required={formValidationsForReqruired.includes(item.columnName)}
                            customKeyName={
                              (item.properties.dependency &&
                                sameDependencies.some((x) => x[1] === item.name) &&
                                dropdownLov.sourceColumnByIdObject[item.properties.sourceColumn]) ||
                              ''
                            }
                          />
                        </Grid>
                      ) : item.default_attribute?.inputType === 'image' || item.default_attribute?.inputType === 'blob' ? (
                        <Grid item md={6} key={item.id}>
                          <Stack spacing={1}>
                            <Typography>
                              {item.name}
                              {item.isRequired && ' *'}
                            </Typography>
                            <TextField
                              disabled={mode === 'view' || !item.update}
                              placeholder={
                                Array.isArray(inputs[item.columnName])
                                  ? inputs[item.columnName]?.length > 0
                                    ? 'View Image'
                                    : 'No Image Available'
                                  : inputs[item.columnName]
                                  ? 'View Image'
                                  : 'No Image Available'
                              }
                              error={!!errorValidations[item.columnName]}
                              helperText={errorValidations[item.columnName]}
                              sx={{
                                '& .MuiFormHelperText-root': {
                                  position: 'absolute',
                                  top: 37,
                                  left: -10
                                },
                                background: mode !== 'view' && item.update ? '#fff' : '#f2f2f2'
                              }}
                              InputProps={{
                                readOnly: true,
                                style: {
                                  resize: 'vertical',
                                  overflowY: 'hidden',
                                  height: '40px',
                                  minHeight: '40px'
                                },
                                endAdornment: (
                                  Array.isArray(inputs[item.columnName])
                                    ? inputs[item.columnName]?.length > 0 && inputs[item.columnName][0]
                                      ? true
                                      : false
                                    : inputs[item.columnName]
                                    ? true
                                    : false
                                ) ? (
                                  <>
                                    <IconButton onClick={() => setPreview(item)} color="primary">
                                      <VisibilityIcon />
                                    </IconButton>
                                    {mode !== 'view' &&
                                      item.update &&
                                      inputs[item.columnName]?.length < item.properties?.imageCount &&
                                      item.default_attribute?.inputType === 'image' &&
                                      renderFileInput(item)}
                                  </>
                                ) : (
                                  <>
                                    <IconButton color="secondary">
                                      <VisibilityIcon />
                                    </IconButton>
                                    {mode !== 'view' &&
                                      item.update &&
                                      item.default_attribute?.inputType === 'image' &&
                                      renderFileInput(item)}
                                  </>
                                )
                              }}
                              errorMessage={errorValidations[item.columnName]}
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
                            <TextField
                              disabled={mode === 'view' || !item.update}
                              placeholder={inputs[item.columnName]?.length > 0 ? 'Open File' : 'No File Available'}
                              error={!!errorValidations[item.columnName]}
                              helperText={errorValidations[item.columnName]}
                              sx={{
                                '& .MuiFormHelperText-root': {
                                  position: 'absolute',
                                  top: 37,
                                  left: -10
                                },
                                background: mode !== 'view' && item.update ? '#fff' : '#f2f2f2'
                              }}
                              InputProps={{
                                readOnly: true,
                                style: {
                                  resize: 'vertical',
                                  overflowY: 'hidden',
                                  height: '40px',
                                  minHeight: '40px'
                                },
                                endAdornment:
                                  inputs[item.columnName]?.length > 0 ? (
                                    <>
                                      <IconButton onClick={() => downloadFile(inputs[item.columnName]?.[0])} color="primary">
                                        <DescriptionOutlinedIcon />
                                      </IconButton>
                                      {mode !== 'view' && item.update && (
                                        <DeleteOutlineIcon
                                          sx={{ cursor: 'pointer' }}
                                          title="Delete"
                                          color="primary"
                                          onClick={() => {
                                            setDeleteFile(item.columnName);
                                            setOpenDeleteModal(true);
                                          }}
                                        />
                                      )}
                                      <ConfirmModal
                                        open={openDeleteModal}
                                        handleClose={() => setOpenDeleteModal(false)}
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
                              }}
                              errorMessage={errorValidations[item.columnName]}
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
                const previewArray = Array.isArray(inputs[preview?.columnName])
                  ? inputs[preview?.columnName]
                  : [inputs[preview?.columnName]];
                return inputs[preview?.columnName] && previewArray.length > 0 && previewArray[0] ? (
                  <ImageCard
                    blockMode
                    mode={mode}
                    imageList={previewArray}
                    setValue={(key, value) => {
                      setValue(key, value?.length === 0 ? [''] : value);
                      setInputsValues((pre) => ({ ...pre, [key]: value?.length === 0 ? [''] : value }));
                      validationsChecked();
                    }}
                    preview={preview}
                    type={inputeTypes[preview?.columnName]}
                  />
                ) : (
                  <Typography>Image Preview</Typography>
                );
              })()}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      <Dialog open={searchModal} onClose={() => setSearchModal(false)} scroll="paper" disableEscapeKeyDown maxWidth="lg">
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
