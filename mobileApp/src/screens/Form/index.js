import { SafeAreaView, Text, View, Button, FlatList, BackHandler, Alert } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import uuid from 'react-native-uuid';

import Header from '../../helpers/header/header';
import InputField from '../../components/formAttributes/textInput';
import styles from './style';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Images from '../../components/formAttributes/image';
import { useDispatch, useSelector } from 'react-redux';
import { getDropDownLov, getSearchFields, submitForms, getUserFormsList, resetFormFieldData, setLoader } from '../../actions/action';
import PhoneNumber from '../../components/formAttributes/phoneNumber';
import Document from '../../components/formAttributes/document';
import CheckBoxTypes from '../../components/formAttributes/checkBox';
import DatePickerComponent from '../../components/formAttributes/datePicker';
import Signature from '../../components/formAttributes/signature';
import Chip from '../../components/formAttributes/chip';
import QrCodeScanner from '../../components/formAttributes/qrCodeScanner';
import MultiSelectPicker from '../../components/formAttributes/multiSelect';
import COLORS from '../../constants/color';
import SearchField from '../../components/formAttributes/searchFields';
import Toast from '../../components/Toast';
import { Database } from '../../helpers/database';
import MeterReadingScanner from '../../components/formAttributes/ocr';
import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import LogRocket from '@logrocket/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const FormScreen = ({ route }) => {
    const apiCalled = useRef({ dropdownLov: false, formList: false, submitApiCalled: false });
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data: formId, ticketId, formType, oAndMresponseId } = route?.params;
    const [refetchThroughSearch, setRefetchThroughSearch] = useState(false);
    const [inputs, setInputsValues] = React.useState({});
    const [tempAutoFetchValue, setTempFetchValues] = useState({});
    const isAlertOpen = React.useRef(false);
    const [timeAlertOpen, setTimeAlertOpen] = useState(false);
    const [formDataInDraft, setFormDataInDraft] = useState(route?.params?.formDataInDraft);
    const [error, setError] = React.useState({});
    const [isReady, setIsReady] = useState(!route?.params?.formDataInDraft);
    const [searchValue, setSearchValue] = useState(route?.params?.searchedKey || '');
    const [searchedValue, setSearchedValue] = useState(route?.params?.searchedKey || '');
    const [onSearchValue, setOnSearchValue] = useState(false);
    const currentDate = useRef(Date.now());
    const [errorValidations, setErrorValidations] = React.useState({});
    const [editable, setEditable] = useState([]);
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    const [hiddenFields, setHiddenFields] = useState({});
    const [countryCode, setCountyCode] = useState({});
    const [dropdownLovData, setDropdownLovData] = useState({});
    const [sameDependencies, setSameDependencies] = useState([]);
    const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
    const [isAutoSave, setIsAutoSave] = useState({
        discarded: false,
        restored: !!route?.params?.formDataInDraft
    });
    const editables = useRef(false);
    const disableOnSearchRef = useRef({});
    const editableRef = useRef({});
    const offlineRef = useRef(false);
    const [alertTriggered, setAlertTriggered] = useState(false);
    const dateRefObject = useRef({ isDateCurrent: false, isMonthYearPicker: false, isNotCurrentDate: false });

    function resetApiCalled() {
        Object.keys(apiCalled.current).forEach((x) => {
            apiCalled.current[x] = false;
        });
    }

    useEffect(() => {
        resetApiCalled();
    }, []);

    useEffect(() => {
        offlineRef.current = isOffline;
    }, [isOffline]);

    function setIsLoading(enabled) {
        dispatch(setLoader({ enabled }));
    }

    const searchedData = useRef(route?.params?.searchedData || '');

    function setSearchedData(valueToSet) {
        searchedData.current = valueToSet;
    }

    const [firstRender, setFirstRender] = useState({});

    function setInputs(arg) {
        if (typeof arg === 'function') {
            setInputsValues((pre) => ({
                ...arg(pre),
                ...dynamicdataKeyGenerator('Key Generator', arg(pre)),
                ...dynamicdata('generator', arg(pre))
            }));
        } else {
            setInputsValues((pre) => ({
                ...pre,
                ...arg,
                ...dynamicdataKeyGenerator('Key Generator', arg),
                ...dynamicdata('generator', arg)
            }));
        }
    }

    const isLoading = useSelector((state) => state.isLoading.enabled);

    const statesRef = useRef({});
    useEffect(() => {
        statesRef.current = { dbInstance, formId: formId?.id };
        dispatch({ type: 'GET_DROPDOWN_LOV_REQUEST' });
        dispatch(getUserFormsList(statesRef.current.formId, statesRef.current.dbInstance, offlineRef.current, setIsLoading));
    }, [dbInstance, formId]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            dispatch({ type: 'GET_DROPDOWN_LOV_REQUEST' });
            dispatch(getUserFormsList(statesRef.current.formId, statesRef.current.dbInstance, offlineRef.current, setIsLoading));
        });
        navigation.addListener('blur', () => {
            dispatch(getSearchFields());
        });
        return () => {
            navigation.removeListener('focus', resetApiCalled);
            navigation.removeListener('blur', resetApiCalled);
        };
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                apiCalled.current.dropdownLov = false;
                navigation.goBack();
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => backHandler.remove();
        }, [navigation])
    );

    const calledOAndMApi = useRef({ initial: isLoading, updated: isLoading, previous: isLoading });

    useEffect(() => {
        calledOAndMApi.current.previous = calledOAndMApi.current.updated;
        calledOAndMApi.current.updated = isLoading;
        if (
            (refetchThroughSearch || (!calledOAndMApi.current.updated && calledOAndMApi.current.previous)) &&
            oAndMresponseId &&
            !formDataInDraft
        ) {
            setSearchedValue(oAndMresponseId);
            setSearchValue(oAndMresponseId);
            dispatch(getSearchFields(formId?.id, oAndMresponseId, dbInstance, offlineRef.current, ticketId, true));
        }
    }, [formFieldsData, isLoading, formDataInDraft, refetchThroughSearch]);

    useEffect(() => {
        if (
            (refetchThroughSearch || (!calledOAndMApi.current.updated && calledOAndMApi.current.previous)) &&
            oAndMValueDropDown &&
            Object.keys(oAndMValueDropDown).length > 0 &&
            !formDataInDraft
        ) {
            Object.entries(oAndMValueDropDown).forEach(([key, value]) => {
                handleOnchange(value, key);
            });
        }
    }, [oAndMValueDropDown, isLoading, refetchThroughSearch, formDataInDraft]);

    const formFields = useSelector((state) => state?.userFormsList?.formsList);

    const formFieldsData = useMemo(() => formFields?.rows || [], [formFields, formId]);

    useEffect(() => {
        if (!formFieldsData?.length || apiCalled.current.dropdownLov) return;
        apiCalled.current.dropdownLov = true;
        const dropdownPayload = {
            formId: formId.id,
            formDropdowns: formFieldsData
                .filter((item) => item?.default_attribute?.name === 'Dropdown')
                .filter((item) => !item?.columnName?.startsWith('l_'))
                .map((dropdown) => ({
                    attribute_id: dropdown.id,
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
                    ...(isEditOrResurvey &&
                        !ticketId &&
                        offlineRef.current && {
                            existingValue: route?.params?.editValues,
                            formArributes: formFieldsData,
                            isEditOrResurvey
                        })
                }))
        };
        dispatch(getDropDownLov(dropdownPayload, dbInstance, offlineRef.current));
    }, [formFieldsData]);

    const dropDownApiData = useSelector((state) => state?.formDropDownLov?.dropDownList);

    // const dropdownLovData = useMemo(() => {
    //     if (!dropDownApiData?.dropdownData?.length) return {};
    //     const data = {};
    //     dropDownApiData?.dropdownData?.forEach((item) => {
    //         const key = Object.keys(item)[0];
    //         const formattedKey = key.replace(/\s/g, '') + 'Data';
    //         data[formattedKey] = item[key];
    //     });
    //     return data;
    // }, [dropDownApiData]);

    useEffect(() => {
        if (dropDownApiData?.dropdownData?.length > 0) {
            const sameConditionDepenedentColumns = [];
            if (Object.keys(allDepenedentColumns).length > 0 && dependentDropdownsFields.length > 0) {
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
            }
            const data = {};
            dropDownApiData?.dropdownData?.forEach((item) => {
                const [key] = Object.keys(item);
                const formattedKey = key.replace(/\s/g, '') + 'Data';
                if (item[key]?.length > 0 && !data[formattedKey]?.length) {
                    data[formattedKey] = item[key];
                }
                if (!sameConditionDepenedentColumns.some((x) => x?.[1] === key)) {
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
        }
    }, [allDepenedentColumns, dependentDropdownsFields, dropDownApiData]);

    const validationsChecked = (text = {}) => {
        const validationErrors = {};
        const hideColumns = {};
        const defaultHidden = formFieldsData?.filter((x) => x?.properties?.defaultHide).map((x) => x?.columnName);
        if (formFieldsData && formFieldsData?.length > 0) {
            if (defaultHidden.length > 0) {
                defaultHidden.forEach((x) => {
                    hideColumns[x] = true;
                });
            }
        }
        const existingErrors = JSON.parse(JSON.stringify(errorValidations));
        const exitsingValues = JSON.parse(JSON.stringify({ ...inputs, ...text }));
        Object.entries(exitsingValues).forEach(([key, value]) => {
            if (key && countryCode[key]) {
                exitsingValues[key] = '+' + (countryCode[key] || '') + value;
            }
        });
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
                    (Array.isArray(
                        exitsingValues[item.form_attribute?.columnName] && exitsingValues[item.form_attribute?.columnName].length > 0
                    ) ||
                        exitsingValues[item.form_attribute?.columnName]) &&
                    validationConditions[item.operatorKey] &&
                    validationConditions[item.operatorKey].call &&
                    validationConditions[item.operatorKey].call(
                        null,
                        typeCheckAndConvert(
                            exitsingValues[item.form_attribute?.columnName],
                            item.form_attribute?.default_attribute?.inputType
                        ),
                        typeCheckAndConvert(item.compareWithValue, item.form_attribute?.default_attribute?.inputType)
                    )
                );
            });
        };
        const conditionCheckForArray = (firstArray, secondArray, operatorKey) => {
            if (Array.isArray(firstArray) && firstArray.length > 0 && ['et', 'net'].includes(operatorKey)) {
                const key = operatorKey === 'et' ? 'or' : 'and';
                const error = typeCalls[key].call(firstArray, (item) =>
                    operatorKey === 'et' ? item === secondArray : item !== secondArray
                );
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
                    let secondValue = item?.compareWithValue || exitsingValues[item?.compare_with_column?.columnName];
                    let firstValue = exitsingValues[firstColumnName];
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
                            (validationConditions[item?.operatorKey].call &&
                                validationConditions[item?.operatorKey].apply(null, typeConvertedValues)))
                    ) {
                        return true;
                    }
                });
                if (isValidRequest) {
                    validationErrors[columnName] = message;
                }
            }
        });
        setHiddenFields(Object.fromEntries(Object.entries(hideColumns).filter((x) => x[1])));
        Object.entries(exitsingValues).forEach(([columnName, message]) => {
            if (validationErrors[columnName]) {
                existingErrors[columnName] = validationErrors[columnName];
            } else {
                existingErrors[columnName] = '';
            }
        });
        setErrorValidations(existingErrors);
    };

    const {
        dynamicKeys,
        dependencies,
        requiredFields,
        allColumnsWithId,
        inputeTypes,
        formTypes,
        defaultHiddenFields,
        dependentDropdownsFields,
        dynamicKeysByName,
        allDepenedentColumnsById,
        disableOnSearch,
        editableFields,
        oAndMValueDropDown
    } = useMemo(() => {
        const initialState = {
            dependentDropdownsFields: [],
            dynamicKeysByName: {},
            allDepenedentColumnsById: {},
            dynamicKeys: {},
            dependencies: {},
            requiredFields: {},
            allColumnsWithId: {},
            inputeTypes: {},
            formTypes: {},
            defaultHiddenFields: [],
            disableOnSearch: [],
            editableFields: [],
            oAndMValueDropDown: {}
        };
        if (formFieldsData && formFieldsData.length > 0) {
            return formFieldsData.reduce((pre, acc) => {
                pre.dynamicKeys[acc.columnName] = acc.name?.replace(/\s/g, '') + 'Data';
                pre.dynamicKeysByName[acc.name] = acc.name?.replace(/\s/g, '') + 'Data';
                pre.allColumnsWithId[acc.id] = acc.columnName;
                pre.inputeTypes[acc.columnName] = acc.default_attribute.inputType;
                pre.formTypes[acc.columnName] = acc.default_attribute.inputType;
                if (acc.properties?.dependency) {
                    pre.allDepenedentColumnsById[acc.columnName] = acc.properties.dependency;
                    pre.dependencies[acc.columnName] = acc.properties.dependency;
                    pre.requiredFields[acc.columnName] = acc.isRequired || acc?.properties?.factoryTable;
                }
                if (ticketId && acc?.properties?.setValueOM) {
                    pre.oAndMValueDropDown[acc.columnName] = [acc.properties.setValueOM];
                }
                if (acc?.properties?.defaultHide) {
                    pre.defaultHiddenFields.push(acc.columnName);
                }
                if (acc.default_attribute.inputType === 'dropdown') {
                    pre.dependentDropdownsFields.push(acc);
                }
                if (acc.properties?.disableOnSearch) {
                    disableOnSearchRef.current[acc.columnName] = true;
                    pre.disableOnSearch.push(acc.columnName);
                }
                if (acc.properties?.editable) {
                    editableRef.current[acc.columnName] = true;
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

    const filteredDataForDropDown = useCallback(
        (dynamicKey, dependency) => {
            const valuesToFetch = formDataInDraft ? tempAutoFetchValue : inputs;
            if (!dependency) {
                return dropdownLovData?.[dynamicKey];
            }
            const dependentColumn = allColumnsWithId[dependency];
            const inputValue = valuesToFetch?.[dependentColumn];
            if (inputValue === undefined) {
                return [];
            }
            const isSameDep = sameDependencies.some(([, dependent]) => dynamicKeysByName[dependent] === dynamicKey);
            const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
            return dropdownLovData?.[dynamicKey]?.filter((items) =>
                Array.isArray(inputValue) ? inputValue?.includes(items?.[keyToCheck]) : inputValue === items?.[keyToCheck]
            );
        },
        [dropdownLovData, allColumnsWithId, inputs, sameDependencies, tempAutoFetchValue, dynamicKeysByName]
    );

    const allDepenedentColumns = useMemo(() => {
        return Object.fromEntries(Object.entries(allDepenedentColumnsById).map(([key, value]) => [key, allColumnsWithId[value] || null]));
    }, [allDepenedentColumnsById, allColumnsWithId]);

    useEffect(() => {
        const object = {};
        const valuesToFetch = formDataInDraft ? tempAutoFetchValue : inputs;
        Object.entries(dynamicKeys).forEach(([key, value]) => {
            if (
                requiredFields[key] &&
                filteredDataForDropDown(value, dependencies[key])?.length <= 1 &&
                filteredDataForDropDown(value, dependencies[key]).map((x) => x.id)?.[0] !== valuesToFetch?.[key]?.[0]
            ) {
                object[key] = filteredDataForDropDown(value, dependencies[key]).map((x) => x.id);
            }
        });
        if (Object.keys(object).length > 0) {
            if (formDataInDraft) {
                setTempFetchValues((pre) => ({ ...pre, ...object }));
            } else {
                setInputs((pre) => {
                    validationsChecked({ ...pre, ...object });
                    return { ...pre, ...object };
                });
            }
        }
    }, [filteredDataForDropDown, dynamicKeys, dependencies, requiredFields, tempAutoFetchValue]);

    const isEditOrResurvey = useMemo(() => !!(route?.params?.editableId || route?.params?.responseId), [route?.params]);

    async function saveDraft(inputType, updatedValues) {
        if (isEditOrResurvey) {
            return Promise.resolve();
        }
        try {
            const values = {
                form_id: formId?.id + ticketId || '',
                form_responses: updatedValues,
                searched_data: searchedData.current,
                searched_key: searchedValue,
                form_type: formType
            };
            const localDb = new Database(dbInstance);
            await localDb.storeDataInDraft(values);
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#292] | [error] | `, error);
        }
    }

    const handleOnchange = (text, input, inputType) => {
        let newValues = {
            [input]: text,
            temp_response_id: inputs.temp_response_id || uuid.v4()
        };
        const [inputId] = Object.entries(allColumnsWithId).filter(([key, value]) => value === input);
        if (inputId) {
            const allDependenciesOfCurrentField = Object.entries(dependencies).filter(([key, value]) => value === inputId[0]);
            if (allDependenciesOfCurrentField.length > 0) {
                setFirstRender((pre) => {
                    allDependenciesOfCurrentField.forEach(([key]) => {
                        pre[key] = !pre[key];
                    });
                    return pre;
                });
            }
        }
        if (inputType === 'dropdown') {
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
            let commonParentDropdowns = filtered.reduce((pre, cur) => {
                if (Object.hasOwnProperty.call(pre, cur.parent)) {
                    pre[cur.parent].push(cur.child);
                } else {
                    pre[cur.parent] = [cur.child];
                }
                return pre;
            }, {});
            commonParentDropdowns = Object.fromEntries(
                Object.entries(commonParentDropdowns).filter(([key, value]) => {
                    return value.length > 1;
                })
            );
            if (newValues) {
                filtered.forEach(({ child, parent }) => {
                    if (child && parent) {
                        const lovKey = dynamicKeys[child];
                        const isSameDep = sameDependencies.some(([, dependent]) => dynamicKeysByName[dependent] === lovKey);
                        const keyToCheck = isSameDep ? 'id' : 'matchingcolumn';
                        if (dropdownLovData[lovKey]) {
                            const availableOptions = dropdownLovData[lovKey]
                                ?.filter((x) => x && (newValues[parent] || inputs[parent] || []).includes(x[keyToCheck]))
                                .map((x) => x.id);
                            const childValues = Object.prototype.hasOwnProperty.call(newValues, child)
                                ? newValues[child]
                                : inputs[child] || [];
                            newValues[child] = childValues?.filter((x) => availableOptions?.includes(x));
                        }
                    }
                });
            }
            const rerender = {};
            if (Object.hasOwnProperty.call(commonParentDropdowns, input)) {
                commonParentDropdowns[input].forEach((x) => {
                    rerender[x] = true;
                });
            }
            if (formDataInDraft) {
                setTempFetchValues((prevState) => {
                    const udpatedValues = { ...prevState, ...newValues };
                    validationsChecked(udpatedValues);
                    return udpatedValues;
                });
            } else {
                setInputs((prevState) => {
                    const udpatedValues = { ...prevState, ...newValues };
                    validationsChecked(udpatedValues);
                    saveDraft(inputType, udpatedValues);
                    return udpatedValues;
                });
            }
        } else if (formDataInDraft) {
            setTempFetchValues((prevState) => {
                const udpatedValues = { ...prevState, ...newValues };
                return udpatedValues;
            });
        } else {
            setInputs((prevState) => {
                const udpatedValues = { ...prevState, ...newValues };
                saveDraft(inputType, udpatedValues);
                return udpatedValues;
            });
        }
    };

    const isError = React.useMemo(() => {
        return (
            Object.entries(error).some((x) => x[1] && !hiddenFields[x[0]]) ||
            Object.entries(errorValidations).some((x) => x[1] && !hiddenFields[x[0]]) ||
            formFieldsData.some(
                (x) =>
                    x?.isRequired &&
                    x?.columnName &&
                    !hiddenFields?.[x.columnName] &&
                    (!inputs?.[x.columnName] || (Array.isArray(inputs?.[x.columnName]) && inputs?.[x.columnName].length === 0))
            )
        );
    }, [error, errorValidations, inputs, formFieldsData]);

    const setCustomerError = (name, text) => setError((pre) => ({ ...pre, [name]: text }));

    const convertToIndianCommaFormat = (value) => {
        return value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
    };

    const formatNumberForBackend = (number, decimal, decimalPoints) => {
        if (decimal === true && decimalPoints > 0) {
            // Round the number to the specified decimal points
            const roundedNumber = Number(number).toFixed(decimalPoints);
            // Convert the number to a string and replace any trailing zeros after the decimal point
            const formattedNumber = String(roundedNumber);
            return formattedNumber;
        }
        // If decimal is false or decimalPoints is 0, simply return the number as is
        return number;
    };

    const resetInputAndForms = () => {};

    const onSubmit = async (onExit = false) => {
        if (process.env.NODE_ENV === 'production') {
            LogRocket.init('uugoif/genus-wfm');
            let userData = await AsyncStorage.getItem('userData');
            const {
                user: { mobileNumber, id, name }
            } = JSON.parse(userData);
            LogRocket.identify(mobileNumber, { id, name });
        }
        try {
            if (apiCalled.current.submitApiCalled) return false;
            apiCalled.current.submitApiCalled = true;
            setIsLoading(true);
            const modifiedInputs = JSON.parse(JSON.stringify({ ...inputs })); // Create a copy of the inputs to modify
            if (!modifiedInputs.ticketId && ticketId) {
                modifiedInputs.ticket_id = ticketId;
                ['mdm_payload_title', 'mdm_payload_timestamp', 'mdm_payload_status', 'mdm_payload_message'].forEach((key) => {
                    modifiedInputs[key] = null;
                });
            }
            modifiedInputs.source = 'mobile';
            delete modifiedInputs.submission_mode;
            if (modifiedInputs.id) {
                modifiedInputs.updated_at = Date.now();
            } else {
                modifiedInputs.updated_at = Date.now();
                modifiedInputs.created_at = Date.now();
            }
            Object.entries(modifiedInputs).forEach(([key, value]) => {
                if (formTypes[key] === 'phone') {
                    if (key && countryCode[key] && value && value !== '') {
                        modifiedInputs[key] = '+' + (countryCode[key] || '') + value;
                    } else {
                        modifiedInputs[key] = value !== '' ? '+' + '91' + value : '';
                    }
                }
            });
            Object.entries(modifiedInputs).forEach(([key, value]) => {
                if (
                    (!(defaultHiddenFields.includes(key) && !key.startsWith('l_')) && hiddenFields[key]) ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    delete modifiedInputs[key];
                }
            });
            modifiedInputs.is_resurvey = null;
            const filtteredUniqueColumns = formFieldsData.filter((x) => x.isUnique).map((x) => x.columnName);
            if (isOffline) {
                const localDb = new Database(dbInstance);
                const allExistsingForms = await localDb.getAllFormsToSync(formId?.id, route?.params?.editableId, true);
                if (
                    allExistsingForms.some((x) => {
                        const formResponse = JSON.parse(x.form_responses);
                        return filtteredUniqueColumns.some(
                            (y) => modifiedInputs[y] && formResponse.filter(([key]) => key === y)?.[0]?.[1] === modifiedInputs[y]
                        );
                    })
                ) {
                    Toast('Record already exists', 0);
                    setIsLoading(false);
                    apiCalled.current.submitApiCalled = false;
                    return false;
                }
            }
            formFieldsData?.forEach((item) => {
                const columnName = item?.columnName;
                const value = modifiedInputs[columnName];
                if (value !== undefined && item?.default_attribute?.name === 'Number') {
                    // Step 1: Limit decimal points if needed
                    if (item?.properties?.decimal === true && item?.properties?.decimalPoints > 0) {
                        modifiedInputs[columnName] = formatNumberForBackend(
                            value,
                            item?.properties?.decimal,
                            item?.properties?.decimalPoints
                        );
                    }
                    // Step 2: Replace commas if needed
                    if (item?.properties?.comma === true && item?.properties?.commaType === 'Indian') {
                        modifiedInputs[columnName] = convertToIndianCommaFormat(value);
                    } else if (item?.properties?.comma === true && item?.properties?.commaType === 'Other') {
                        modifiedInputs[columnName] = Number(value).toLocaleString('en-US');
                    }
                    // Step 3: Append currencyType if needed
                    if (item?.properties?.currency === true && item?.properties?.currencyType) {
                        modifiedInputs[columnName] = item?.properties?.currencyType + ' ' + modifiedInputs[columnName];
                    }
                    // Step 4: Append percentage symbol if needed
                    if (item?.properties?.percentage === true) {
                        modifiedInputs[columnName] += '%';
                    }
                    // Step 5: Append prefix and suffix if they are present
                    if (item?.properties?.prefix) {
                        modifiedInputs[columnName] = item?.properties?.prefix + ' ' + modifiedInputs[columnName];
                    }
                    if (item?.properties?.suffix) {
                        modifiedInputs[columnName] += ' ' + item?.properties?.suffix;
                    }
                }
            });
            function setDataInFormData(key, value) {
                if (isOffline) {
                    if (!formData.form_responses) formData.form_responses = [];
                    formData.form_responses.push([key, value]);
                } else {
                    formData.append(key, value);
                }
            }
            const formData = isOffline ? {} : new FormData();
            Object.entries(modifiedInputs)?.forEach(([key, value]) => {
                const inputType = inputeTypes[key];
                if (inputType && ['file', 'image'].includes(inputType)) {
                    value?.forEach(async (y, ind) => {
                        if (Object.prototype.toString.call(y) === '[object Object]') {
                            if (y.fileName && !y.name) {
                                y.name = y.fileName;
                            }
                            return setDataInFormData(`${key} - ${ind}`, y);
                        } else {
                            setDataInFormData(key, y);
                            return setDataInFormData(key, y);
                        }
                    });
                } else {
                    if (Array.isArray(value)) {
                        setDataInFormData(key, value[0]);
                        value?.forEach((_x) => {
                            setDataInFormData(key, _x);
                        });
                    } else {
                        if (['updated_at'].includes(key)) {
                            setDataInFormData(key, Date.now());
                        } else if (!(['is_resurvey', 'resurvey_by'].includes(key) && key.startsWith('l_'))) {
                            setDataInFormData(key, value);
                        }
                    }
                }
            });
            if (route.params?.responseId) {
                Object.entries(inputs).forEach(([key, value]) => {
                    const inputType = inputeTypes[key];
                    if (key.startsWith('l_')) {
                        if (inputeTypes[key] === 'dropdown') {
                            setDataInFormData(key, null);
                            setDataInFormData(key, null);
                        } else {
                            setDataInFormData(key, '');
                        }
                    } else if (
                        inputType &&
                        ['file', 'image'].includes(inputType) &&
                        route.params?.editValues?.[key]?.length > 0 &&
                        inputs[key]?.length === 0
                    ) {
                        setDataInFormData(key, null);
                        setDataInFormData(key, null);
                    }
                });
            }
            setDataInFormData('submission_mode', isOffline ? 'Offline' : 'Online');
            if (route?.params?.data?.isPublished) {
                if (isOffline) {
                    if (route?.params?.editableId) {
                        formData.id = route?.params?.editableId;
                    }
                    if (!formData.form_responses) formData.form_responses = {};
                    formData.form_id = formId?.id;
                    formData.form_responses = JSON.stringify(formData.form_responses);
                    formData.form_files_data = JSON.stringify(formData.form_files_data);
                }
                const response = await submitForms(
                    formData,
                    formId?.id,
                    resetInputAndForms,
                    onExit,
                    navigation,
                    setIsLoading,
                    offlineRef.current,
                    dbInstance,
                    deleteFormsDataAfterSubmissions.bind(null, modifiedInputs),
                    Toast,
                    route.params.responseId || inputs.id,
                    apiCalled,
                    ticketId
                );
                if (!response) {
                    return Toast('Something Went Wrong!', 0);
                }
                if (response?.code === 200) {
                    return Toast('Form Submitted Successfully!', 1);
                }
                if (response?.code === 409) {
                    return Toast(response.message, 0);
                }
            } else {
                Toast('This Form Is Not Published!', 0);
            }
            setIsLoading(false);
            apiCalled.current.submitApiCalled = false;
        } catch (error) {
            apiCalled.current.submitApiCalled = false;
            if (process.env.NODE_ENV === 'production') {
                LogRocket.captureException(error);
                crashlytics().recordError(error, 'onSubmitCatchBlock');
            }
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#619] | [error] | `, error);
            Toast('Something went wrong!', 0);
            setIsLoading(false);
        }
    };

    async function deleteFormsDataAfterSubmissions(responses) {
        const localDb = new Database(dbInstance);
        if (offlineRef.current && responses) {
            try {
                const allMasterTables = await localDb.getAllFormAttributes();
                const serialNumberAtt = formFieldsData
                    .filter((x) => allMasterTables[x.properties.sourceTable] === 'serial_numbers')
                    .map((x) => x.columnName);
                const idsConsumed = serialNumberAtt.map((x) => responses[x]);
                await localDb.deleteConsumedSerialNumbers(idsConsumed);

                // reduce use quantities
                const reducedUsedQuantities = formFieldsData
                    .filter((x) => allMasterTables[x.properties.sourceTable] === 'nonserialize_materials')
                    .map((x) => ({ name: x.columnName, id: x.id }));
                const nonSrMattrConsumedAndAssigned = reducedUsedQuantities.map((z) => {
                    const nonSrAttr = formFieldsData.find((x) =>
                        x?.validations?.attribute_validation_conditions?.some((y) => y?.compare_with_column?.id === z.id)
                    );
                    let assignedAttributeName = null;
                    nonSrAttr?.validations?.attribute_validation_conditions?.forEach((y) => {
                        if (y?.compare_with_column?.id === z.id) {
                            assignedAttributeName = y.compare_with_column.columnName;
                        }
                    });
                    return {
                        assignedAttributeName,
                        inputQuantity: nonSrAttr.columnName
                    };
                });
                await Promise.all(
                    nonSrMattrConsumedAndAssigned.map((y) => {
                        const optionsKey = dynamicKeys[y.assignedAttributeName];
                        const options = dropdownLovData[optionsKey];
                        if (!responses[y.inputQuantity]) return Promise.resolve();
                        return localDb.reduceConsumedNonserializedMaterial(
                            options?.[0]?.id,
                            (options?.[0]?.name - responses[y.inputQuantity]).toFixed(2)
                        );
                    })
                );
            } catch (error) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#634] | [error] | `, error);
            }
        }
        return localDb.deleteDataFromDraft(formId?.id + ticketId || '');
    }

    const dynamicdataKeyGenerator = (keyValue, values) => {
        const keyArray = formFieldsData.filter((item) => item?.default_attribute?.name === keyValue);
        const updateValues = {};
        if (keyArray.length > 0) {
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
                                dropDownApiData?.sourceColumnById?.[item.properties.sourceColumn]) ||
                            '';
                        return item
                            ? { columnName: item?.columnName, type: item?.default_attribute?.inputType, name: item.name, customKeyName }
                            : {};
                    })
                    .filter((x) => Object.keys(x).length > 0);
                const value = `${myObj?.properties?.prefix || ''}${separatorList[0]}${finalNameList
                    .map(({ columnName: key, type, name, customKeyName }) => {
                        if (key && countryCode[key]) {
                            return '+' + (countryCode[key] || '') + values[key];
                        }
                        if (type && type === 'dropdown') {
                            const lovKey = name.replace(/\s/g, '') + 'Data';
                            if (dropdownLovData[lovKey]) {
                                const fitleredName = dropdownLovData[lovKey]
                                    .filter((x) => values[key]?.includes(x.id))
                                    .map((x) => (customKeyName ? x[customKeyName] : x.name))
                                    .join('/');
                                if (fitleredName) return fitleredName;
                            }
                        }
                        return values[key];
                    })
                    .map((value, index) => {
                        return (value || '') + (separatorList[index + 1] || '');
                    })
                    .join('')}${myObj?.properties?.suffix || ''}`;
                if (value !== values[myObj.columnName]) {
                    updateValues[myObj.columnName] = value;
                }
            });
            return updateValues;
        }
    };

    const dynamicdata = (keyValue, values) => {
        const myObj = formFieldsData.find((item) => item?.default_attribute?.name === keyValue || item?.properties?.qrType === keyValue);
        const updateValues = {};
        if (myObj) {
            const idList = myObj?.properties?.columnList;
            const finalNameList = formFieldsData.filter((item) => idList?.includes(item.id.toString())).map((item) => item.columnName);
            const sep = myObj?.properties?.separator || '';
            const value = `${myObj?.properties?.prefix || ''}${sep}${finalNameList
                .map((key) => {
                    if (key && countryCode[key]) {
                        return '+' + (countryCode[key] || '') + values[key];
                    }
                    return values[key];
                })
                .filter((x) => x)
                .join(sep)}${sep}${myObj?.properties?.suffix || ''}`;
            if (value !== values[myObj.columnName]) {
                updateValues[myObj.columnName] = value;
            }
        }
        return updateValues;
    };

    useEffect(() => () => dispatch(resetFormFieldData()), []);

    function checkDisableOnSearchAfterRestore() {
        if (!!route?.params?.searchedData && route?.params?.searchedData !== '' && route?.params?.searchedKey) {
            try {
                const searchedPre = JSON.parse(route?.params?.searchedData);
                const searchedPreArr = Object.entries(searchedPre);
                const editableFinal = Object.keys(editableRef.current);
                searchedPreArr.forEach(([key, value]) => {
                    const _vlaue = ['number', 'boolean'].includes(typeof value) ? value.toString() : value;
                    if (_vlaue.length > 0 && disableOnSearchRef.current[key] && editableRef.current[key]) {
                        const indx = editableFinal.indexOf(key);
                        editableFinal[indx] = null;
                    }
                });
                setEditable(editableFinal);
                setSearchValue(route?.params?.searchedKey);
                setSearchedValue(route?.params?.searchedKey);
            } catch (error) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#957] | [error] | `, error);
            }
        }
    }

    useEffect(() => {
        if (
            dbInstance &&
            formFieldsData &&
            formFieldsData.length > 0 &&
            formDataInDraft &&
            !isLoading &&
            !isAlertOpen.current &&
            dropDownApiData?.status &&
            !isEditOrResurvey
        ) {
            isAlertOpen.current = true;
            Alert.alert('', 'Previous records have been found for this form. Would you like to restore or discard them?', [
                {
                    text: 'Restore',
                    onPress: () => {
                        setIsReady(true);
                        setFormDataInDraft((pre) => {
                            setInputs(pre);
                            validationsChecked(pre);
                            checkDisableOnSearchAfterRestore();
                            return undefined;
                        });
                        setIsAutoSave({
                            restored: true,
                            discarded: false
                        });
                        setTimeAlertOpen(true);
                    }
                },
                {
                    text: 'Discard',
                    onPress: async () => {
                        dateRefObject.current.isNotCurrentDate = false;
                        setIsReady(true);
                        setFormDataInDraft(undefined);
                        setTempFetchValues((pre) => {
                            setInputs(pre);
                            validationsChecked(pre);
                            return pre;
                        });
                        setIsAutoSave({
                            restored: false,
                            discarded: true
                        });
                        setRefetchThroughSearch(true);
                        setSearchedData(null);
                        setSearchValue('');
                        const localDb = new Database(dbInstance);
                        setTimeAlertOpen(true);
                        return localDb.deleteDataFromDraft(formId?.id + ticketId || '');
                    }
                }
            ]);
        } else if (!alertTriggered) {
            setTimeAlertOpen(true);
            setAlertTriggered(true);
        }
    }, [formFieldsData, inputs, dropDownApiData]);

    useEffect(() => {
        if ((timeAlertOpen || isAlertOpen.current === true) && !isOffline) {
            (async () => {
                if (process.env.NODE_ENV === 'development') return false;
                try {
                    const response = await axios({
                        method: 'GET',
                        url: 'https://timeapi.io/api/Time/current/zone',
                        params: { timeZone: 'Asia/Kolkata' }
                    });
                    const zoneCurrentTime = new Date(response?.data?.dateTime);
                    const currentDate = new Date();
                    const margin = 60 * 1000;

                    if (Math.abs(zoneCurrentTime - currentDate) > margin) {
                        Alert.alert(
                            '',
                            'Your Mobile Time Is Incorrect!',
                            [
                                {
                                    text: 'Okay',
                                    onPress: () => {
                                        navigation.goBack();
                                    }
                                }
                            ],
                            {
                                cancelable: false
                            }
                        );
                    }
                } catch (error) {
                    console.error('Error fetching current date and time: ', error);
                }
            })();
        }
    }, [timeAlertOpen, isAlertOpen.current]);

    useEffect(() => {
        if (
            route?.params?.editValues &&
            Object.prototype.toString.call(route?.params?.editValues) === '[object Object]' &&
            !isLoading &&
            dropDownApiData?.status === 'SUCCESS' &&
            !editables.current &&
            Object.keys(dropdownLovData)?.length > 0 &&
            formFieldsData.length > 0 &&
            Object.keys(formTypes).length === formFieldsData.length
        ) {
            editables.current = true;
            const countryCodeToSet = {};
            Object.entries(route?.params?.editValues).forEach(([key, value]) => {
                if (formTypes[key] === 'phone' && value?.startsWith('+91')) {
                    countryCodeToSet[key] = '+91';
                    route.params.editValues[key] = value.replace('+91', '');
                }
            });
            setInputs(route?.params?.editValues);
            validationsChecked(route?.params?.editValues);
        }
    }, [formFieldsData, isLoading, dropDownApiData, dropdownLovData, formTypes]);

    function setDefaultValuesInForm() {
        const valuesToStore = {};
        formFieldsData.forEach((x) => {
            if (['checkbox', 'chip', 'text', 'number', 'ocr'].includes(x?.default_attribute?.inputType) && x?.properties?.defaultValue) {
                if (['chip', 'text', 'number', 'ocr'].includes(x?.default_attribute?.inputType)) {
                    valuesToStore[x.columnName] = x.properties.defaultValue;
                } else if (
                    x.properties.defaultValue.split &&
                    Object.prototype.toString.call(x.properties.defaultValue.split) === '[object Function]'
                ) {
                    valuesToStore[x.columnName] = x.properties.defaultValue.split(',');
                } else if (x.properties.defaultValue && Array.isArray(x.properties.defaultValue)) {
                    valuesToStore[x.columnName] = x.properties.defaultValue;
                }
            }
            if (x?.default_attribute?.inputType && x.properties?.captureCurrentDate) {
                valuesToStore[x.columnName] = new Date();
            }
        });
        if (formDataInDraft) {
            setTempFetchValues((prevState) => {
                const udpatedValues = { ...prevState, ...valuesToStore };
                return udpatedValues;
            });
        } else {
            setInputs(valuesToStore);
            validationsChecked(valuesToStore);
        }
    }

    useEffect(() => {
        if (!route?.params?.editValues) {
            setDefaultValuesInForm();
        }
    }, [formFieldsData]);

    const {
        searchFieldList: searchingMappingValue,
        searchResultMessage,
        status: searchResultStatus
    } = useSelector((state) => state?.userSearchFields);

    useEffect(() => {
        if (searchValue && onSearchValue === true) {
            setSearchedValue(searchValue);
            dispatch(getSearchFields(formId?.id, searchValue, dbInstance, offlineRef.current, ticketId));
        }
    }, [searchValue, onSearchValue]);

    const isDisabledDropdown = useCallback(
        (item, dynamicKey) =>
            !editable.includes(item?.columnName) ||
            filteredDataForDropDown(dynamicKey, item.properties?.dependency)?.length === 0 ||
            (item?.isRequired && filteredDataForDropDown(dynamicKey, item.properties?.dependency)?.length === 1),
        [filteredDataForDropDown, editable]
    );

    useEffect(() => {
        setIsLoadingDropdown({ status: dropDownApiData?.status !== 'SUCCESS', sourceColumnById: dropDownApiData.sourceColumnById });
    }, [dropDownApiData]);

    const renderFormFields = React.useCallback(
        (item, index) => {
            let type = item?.default_attribute?.name;
            const dynamicKey = dynamicKeys[item.columnName];
            if (hiddenFields[item?.columnName]) return <></>;
            switch (type) {
                case 'Email':
                    return (
                        <View key={index}>
                            <InputField
                                name={item?.name}
                                description={item?.properties?.description}
                                editable={editable.includes(item?.columnName)}
                                type={item?.default_attribute?.name}
                                value={inputs[item?.columnName]}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                            />
                        </View>
                    );
                case 'Phone':
                    return (
                        <View key={index}>
                            <PhoneNumber
                                countryCode={countryCode[item?.columnName]}
                                name={item?.name}
                                value={inputs[item?.columnName]}
                                verifiedValue={inputs[`v_${item?.columnName}`]}
                                setValue={(key, text) => handleOnchange(text, key, item?.default_attribute?.inputType)}
                                setCountyCode={setCountyCode}
                                columnName={item?.columnName}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                editable={editable.includes(item?.columnName)}
                                required={!!item?.isRequired}
                                isVerify={item?.properties?.doVerify}
                                inputs={inputs}
                                description={item?.properties?.description}
                                autoFillUserLoggedInNumber={item?.properties?.currentUser}
                                formAtrId={item?.id}
                            />
                        </View>
                    );

                case 'Text':
                    return (
                        <View key={index}>
                            <InputField
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                description={item?.properties?.description}
                                editable={editable.includes(item?.columnName)}
                                type={item?.default_attribute?.name}
                                autoComplete={item?.properties?.autoComplete}
                                maxLength={item?.properties?.maxLength}
                                minLength={item?.properties?.minLength}
                                value={inputs[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                            />
                        </View>
                    );
                case 'Reference Code':
                    return (
                        <View key={index}>
                            <InputField
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                description={item?.properties?.description}
                                editable={editable.includes(item?.columnName)}
                                type={item?.default_attribute?.name}
                                autoComplete={item?.properties?.autoComplete}
                                maxLength={item?.properties?.maxLength}
                                minLength={item?.properties?.minLength}
                                value={inputs[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                refreshAllow={item?.properties?.refreshAllow}
                            />
                        </View>
                    );

                case 'Image':
                    return (
                        <View key={index}>
                            <Images
                                name={item?.name}
                                image={inputs[item?.columnName]}
                                setImage={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                disableLibaray={item?.properties?.disableLibaray}
                                maxSize={item?.properties?.maxSize}
                                imageCount={item?.properties?.imageCount}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Document':
                    return (
                        <View key={index}>
                            <Document
                                name={item?.name}
                                setImages={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                images={inputs[item?.columnName]}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Number':
                    return (
                        <View key={index}>
                            <InputField
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                type={item?.default_attribute?.name}
                                maxLength={item?.properties?.maxLength}
                                editable={editable.includes(item?.columnName)}
                                minLength={item?.properties?.minLength}
                                maxValue={item?.properties?.maxValue}
                                minValue={item?.properties?.minValue}
                                value={inputs[item?.columnName]}
                                decimalPoints={item?.properties?.decimalPoints}
                                decimal={item?.properties?.decimal}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'GEO Location':
                    return (
                        <View key={index}>
                            <InputField
                                isReady={isReady}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                type={item?.default_attribute?.name}
                                value={inputs[item?.columnName]}
                                setValue={(text, isAutoCapture) => {
                                    if (isAutoCapture) {
                                        if (!isEditOrResurvey) {
                                            if (formDataInDraft) {
                                                setTempFetchValues((pre) => ({ ...pre, [item.columnName]: text }));
                                            } else {
                                                setInputs((pre) => ({ ...pre, [item.columnName]: text }));
                                            }
                                        }
                                    } else {
                                        handleOnchange(text, item?.columnName, item?.default_attribute?.inputType);
                                    }
                                }}
                                accuracyInMeter={+item?.properties?.accuracyInMeter}
                                autoCapture
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                                editable={item?.properties?.editable}
                            />
                        </View>
                    );

                case 'Key Generator':
                    return (
                        <View key={index}>
                            <InputField
                                type={item?.default_attribute?.name}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                editable={false}
                                value={inputs?.[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Checkbox':
                    return (
                        <View key={index}>
                            <CheckBoxTypes
                                name={item?.name}
                                values={item?.properties?.values}
                                toggleCheckBox={inputs[item?.columnName]}
                                selectType={item?.properties?.selectType}
                                setToggleCheckBox={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Dropdown':
                    return (
                        <View key={index}>
                            <MultiSelectPicker
                                name={item?.name}
                                itemsList={filteredDataForDropDown(dynamicKey, item.properties?.dependency)}
                                value={inputs[item?.columnName] || []}
                                discarded={isAutoSave.discarded}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                selectType={item?.properties?.selectType}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                required={!!item?.isRequired || !!item?.properties?.factoryTable}
                                isRequired={!!item?.isRequired}
                                description={item?.properties?.description}
                                isLoading={isLoadingDropdown.status}
                                dropDownApiData={dropDownApiData}
                                firstRender={firstRender[item?.columnName]}
                                contractor={item?.properties?.contractor}
                                supervisor={item?.properties?.supervisor}
                                disabled={!!oAndMValueDropDown[item?.columnName] || isDisabledDropdown(item, dynamicKey)}
                                // customKeyName={dropDownApiData?.sourceColumnById?.[item.properties.sourceColumn] || ''}
                                customKeyName={
                                    (item.properties.dependency &&
                                        sameDependencies.some((x) => x[1] === item.name) &&
                                        isLoadingDropdown?.sourceColumnById?.[item.properties.sourceColumn]) ||
                                    ''
                                }
                            />
                        </View>
                    );

                case 'Date Time':
                    return (
                        <View key={index}>
                            <DatePickerComponent
                                name={item?.name}
                                captureCurrentDate={item?.properties?.captureCurrentDate}
                                maxDate={item?.properties?.maxDate}
                                minDate={item?.properties?.minDate}
                                includeTime={item?.properties?.inckudeTime}
                                editable={editable.includes(item?.columnName)}
                                pickerType={item?.properties?.pickerType}
                                timeFormat={item?.properties?.timeFormat}
                                setDate={(text, isAutoCapture) => {
                                    if (isAutoCapture) {
                                        if (!isEditOrResurvey) {
                                            if (formDataInDraft) {
                                                setTempFetchValues((pre) => ({ ...pre, [item.columnName]: text }));
                                            } else {
                                                setInputs((pre) => ({ ...pre, [item.columnName]: text }));
                                            }
                                        }
                                    } else {
                                        handleOnchange(text, item?.columnName, item?.default_attribute?.inputType);
                                    }
                                }}
                                date={inputs[item?.columnName] || currentDate.current}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                inputs={inputs}
                                columnName={item.columnName}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                                dateRefObject={dateRefObject}
                                searchedData={searchedData.current}
                                editValues={route?.params?.editValues}
                            />
                        </View>
                    );

                case 'Signature':
                    return (
                        <View key={index}>
                            <Signature
                                name={item?.name}
                                signatureImage={inputs[item?.columnName]}
                                setSignatureImage={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Chip Select':
                    return (
                        <View key={index}>
                            <Chip
                                chipValue={inputs[item?.columnName]}
                                setChipValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                name={item?.name}
                                values={item?.properties?.values?.split(',')}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                setError={setCustomerError.bind(null, item?.columnName)}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                            />
                        </View>
                    );

                case 'Network Strength':
                    return (
                        <View key={index}>
                            <InputField
                                setError={setCustomerError.bind(null, item?.columnName)}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                name={item?.name}
                                type={item?.default_attribute?.name}
                                value={inputs[item?.columnName]}
                                setValue={(func) => {
                                    item?.properties?.networkType === 'Mbps'
                                        ? handleOnchange(func, item?.columnName, item?.default_attribute?.inputType)
                                        : setInputs((prev) => {
                                              const data = {
                                                  ...prev,
                                                  [item?.columnName]: func(item?.columnName)(prev)
                                              };
                                              saveDraft(item?.default_attribute?.inputType, data);
                                              return data;
                                          });
                                }}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                                networkType={item?.properties?.networkType}
                                isEditOrResurvey={isEditOrResurvey}
                            />
                        </View>
                    );

                case 'QR/Bar Code':
                    return (
                        <View key={index}>
                            <QrCodeScanner
                                name={item?.name}
                                qrType={item?.properties?.qrType}
                                value={inputs[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                required={!!item?.isRequired}
                                description={item?.properties?.description}
                                editable={item?.properties?.editable}
                                separatorType={item?.properties?.separatorType}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                            />
                        </View>
                    );
                case 'Section Seperator':
                    return (
                        <View key={index} style={styles.separator}>
                            <Text style={styles.separatorText}>{item?.name}</Text>
                        </View>
                    );
                case 'OCR':
                    return (
                        <View key={index}>
                            <MeterReadingScanner
                                name={item?.name}
                                required={!!item?.isRequired}
                                value={inputs[item?.columnName]}
                                setValue={(text) => handleOnchange(text, item?.columnName, item?.default_attribute?.inputType)}
                                description={item?.properties?.description}
                                editable={item?.properties?.editable}
                                error={error[item?.columnName] || errorValidations[item?.columnName]}
                                validationsChecked={(text) => validationsChecked(text ? { [item.columnName]: text } : undefined)}
                            />
                        </View>
                    );

                default:
                    break;
            }
        },
        [
            errorValidations,
            inputs,
            dropdownLovData,
            hiddenFields,
            error,
            countryCode,
            formFieldsData,
            isError,
            tempAutoFetchValue,
            formDataInDraft,
            isAutoSave,
            dropDownApiData,
            isLoadingDropdown,
            sameDependencies
        ]
    );
    return (
        <SafeAreaView style={styles.container}>
            <Header screenName={route?.params?.data?.name} enabled={route?.params?.fromOfflineSection} drawerView={false} />
            {formFieldsData?.length > 0 ? (
                <>
                    {formId?.mappingTableId === null ? (
                        <></>
                    ) : (
                        <SearchField
                            saveDraft={saveDraft}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setOnSearchValue={setOnSearchValue}
                            searchingMappingValue={searchingMappingValue}
                            searchResultMessage={searchResultMessage}
                            formFieldsData={formFieldsData}
                            searchResultStatus={searchResultStatus}
                            setInputs={setInputs}
                            onSearchValue={onSearchValue}
                            disableOnSearch={disableOnSearch}
                            setEditable={setEditable}
                            editableOriginal={editableFields}
                            allDepenedentColumns={allDepenedentColumns}
                            dynamicKeys={dynamicKeys}
                            setSearchedData={setSearchedData}
                            isDisabledSearched={!!ticketId}
                        />
                    )}
                    <FlatList
                        removeClippedSubviews={false}
                        data={formFieldsData}
                        renderItem={({ item, index }) => renderFormFields(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={styles.submitButton}>
                        <View style={styles.submitButtonForEdit}>
                            <Button
                                title="Submit"
                                onPress={() => onSubmit(true)}
                                disabled={isError}
                                style={styles.buttonStyle}
                                color={COLORS.buttonColor}
                            />
                        </View>
                    </View>
                </>
            ) : (
                <View>
                    <Text style={styles.text}>No Form Fields Found!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default FormScreen;
