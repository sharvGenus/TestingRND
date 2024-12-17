import apiCalled from '../helpers/apiIntegration/apiCalledConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    FormDropDownLov,
    UserForms,
    UserFormsSubTypesList,
    UserFormsTypes,
    UserNotificationList,
    UserTicketInfoList,
    UserformSubmit,
    getResurveyedForm,
    offlineCreateTabledata,
    searchFields,
    sendOtp
} from '../helpers/apiIntegration/userService';
import { Database } from '../helpers/database';
import crashlytics from '@react-native-firebase/crashlytics';
import LogRocket from '@logrocket/react-native';

export const getUserFormTypes = (dbInstance, isOffline, setIsLoading, navigation) => async (dispatch) => {
    try {
        if (apiCalled.getUserFormTypes) return;
        apiCalled.getUserFormTypes = true;
        dispatch(request());
        if (!isOffline) {
            setIsLoading(true);
            UserFormsTypes()
                .then(async (res) => {
                    if (res) {
                        const [response] = res;
                        dispatch(success(response?.data));
                    }
                    setIsLoading(false);
                })
                .catch(async (error) => {
                    await dispatch(failure(error.toString()));
                    setIsLoading(false);
                });
        } else {
            setIsLoading(true);
            const localDb = new Database(dbInstance);
            localDb
                .getFormSubtypes()
                .then((x) => {
                    dispatch(success(x));
                    setIsLoading(false);
                })
                .catch((err) => {
                    dispatch(failure(err.toString ? err.toString() : err));
                    setIsLoading(false);
                });
        }
        function request() {
            return { type: 'GET_FORMS_TYPES_REQUEST' };
        }

        function success(formsTypesList) {
            apiCalled.getUserFormTypes = false;
            return { type: 'GET_FORMS_TYPES_SUCCESS', formsTypesList };
        }

        function failure(error) {
            apiCalled.getUserFormTypes = false;
            return { type: 'GET_FORMS_TYPES_FAILURE', error };
        }
    } catch (error) {
        apiCalled.getUserFormTypes = false;
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [action.js] | [#64] | [error] | `, error);
    }
};

export const getUserFormSubTypesList = (dbInstance, offline, setIsLoading, isOandM) => async (dispatch) => {
    if (apiCalled.getUserFormSubTypesList) return;
    apiCalled.getUserFormSubTypesList = true;
    dispatch(request());
    const isOffline = await AsyncStorage.getItem('isEnabled');
    if (offline || isOffline) {
        const localDb = new Database(dbInstance);
        localDb
            .getFormList(isOandM)
            .then((x) => {
                dispatch(success(x));
                setIsLoading(false);
            })
            .catch((err) => {
                dispatch(failure(err.toString ? err.toString() : err));
                setIsLoading(false);
            });
    } else {
        UserFormsSubTypesList(isOandM)
            .then((res) => {
                if (res) {
                    const [response] = res;
                    dispatch(success(response?.data));
                }
                setIsLoading(false);
            })
            .catch(async (error) => {
                dispatch(failure(error.toString()));
                setIsLoading(false);
            });
    }
    function request() {
        return { type: 'GET_FORMS_SUB_TYPES_REQUEST' };
    }

    function success(formsSubTypesList) {
        apiCalled.getUserFormSubTypesList = false;
        return { type: 'GET_FORMS_SUB_TYPES_SUCCESS', formsSubTypesList };
    }

    function failure(error) {
        apiCalled.getUserFormSubTypesList = false;
        return { type: 'GET_FORMS_SUB_TYPES_FAILURE', error };
    }
};

export const getResurveyForms = async (dbInstance, offline, resurveyFormId, setIsLoading, Toast, offset, limit) => {
    try {
        const isOffline = await AsyncStorage.getItem('isEnabled');
        if (offline || isOffline) {
            const localDb = new Database(dbInstance);
            return localDb.getResurveryForms(resurveyFormId, offset, limit);
        } else {
            const res = await getResurveyedForm(resurveyFormId, offset, limit);
            if (res[0]?.data) {
                const [response] = res;
                return { count: response?.count, data: response.data.map((x) => ({ data: x })) };
            }
        }
    } catch (error) {
        Toast(error.message, 0);
    } finally {
        setIsLoading(false);
    }
};

export const getUserFormsList = (id, dbInstance, offline, setIsLoading) => async (dispatch) => {
    if (apiCalled.getUserFormsList) return;
    apiCalled.getUserFormsList = true;
    setIsLoading(true);
    dispatch(request());
    const isOffline = await AsyncStorage.getItem('isEnabled');
    if (offline || isOffline) {
        const localDb = new Database(dbInstance);
        localDb
            .getFormsAttributes(id)
            .then((x) => {
                dispatch(success(x));
                setIsLoading(false);
            })
            .catch((e) => {
                dispatch(failure(e.toString()));
                setIsLoading(false);
            });
    } else {
        UserForms(id)
            .then((res) => {
                if (res) {
                    const [response, status] = res;
                    if (status === 200) {
                        dispatch(success(response?.data));
                    }
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [action.js] | [#149] | [error] | `, error);
                dispatch(failure(error.toString()));
                setIsLoading(false);
            });
    }
    function request() {
        return { type: 'GET_FORMS_REQUEST' };
    }

    function success(formsList) {
        apiCalled.getUserFormsList = false;
        return { type: 'GET_FORMS_SUCCESS', formsList };
    }

    function failure(error) {
        apiCalled.getUserFormsList = false;
        return { type: 'GET_FORMS_FAILURE', error };
    }
};

export const getDropDownLov = (payLoad, dbInstance, ifOffline) => (dispatch) => {
    if (apiCalled.getDropDownLov) return;
    apiCalled.getDropDownLov = true;
    dispatch(request());
    if (ifOffline) {
        const localDb = new Database(dbInstance);
        localDb
            .getDropDownLovsData(payLoad)
            .then(({ dropDownList, sourceColumnById }) =>
                dispatch(success({ status: 'SUCCESS', code: 1000, dropdownData: dropDownList, sourceColumnById }))
            )
            .catch((error) => dispatch(failure(error.toString())));
    } else {
        FormDropDownLov(payLoad)
            .then((response) => response?.[0] && dispatch(success(response[0])))
            .catch((error) => dispatch(failure(error.toString())));
    }

    function request() {
        return { type: 'GET_DROPDOWN_LOV_REQUEST' };
    }
    function success(dropDownList) {
        apiCalled.getDropDownLov = false;
        return { type: 'GET_DROPDOWN_LOV_SUCCESS', dropDownList };
    }

    function failure(error) {
        apiCalled.getDropDownLov = false;
        return { type: 'GET_DROPDOWN_LOV_FAILURE', error };
    }
};

export const submitForms = (...rest) => {
    return new Promise((resovle, reject) => {
        const [
            payLoad,
            id,
            setInputs,
            onExit,
            navigation,
            setIsLoading,
            isOffline,
            dbInstance,
            deleteFormsDataAfterSubmissions,
            Toast,
            resurveyId,
            apiCalled,
            ticketId
        ] = rest;

        function success(res) {
            if (apiCalled?.current?.submitApiCalled) apiCalled.current.submitApiCalled = false;
            if (res?.[1]) {
                if (res[1] == 200) {
                    if (typeof deleteFormsDataAfterSubmissions === 'function') deleteFormsDataAfterSubmissions();
                    setInputs({});
                    if (onExit === true) {
                        navigation.goBack();
                    }
                }
                setIsLoading(false);
                return resovle({ code: res?.[1], message: res[0] });
            }
            resovle(null);
        }
        function error(err) {
            if (apiCalled?.current?.submitApiCalled) apiCalled.current.submitApiCalled = false;
            setIsLoading(false);
            if(process.env.NODE_ENV === "production"){
            LogRocket.captureException(err, 'submitFormsApiCall');
            crashlytics().recordError(err, 'submitFormsApiCall');
            }
            reject(err);
            console.log('> genus-wfm | [action.js] | #181 | err | ', err);
        }

        if (isOffline && dbInstance) {
            const localDb = new Database(dbInstance);
            localDb.storeDataInLocalData(payLoad, id, resurveyId, ticketId).then(success).catch(error);
        } else {
            UserformSubmit(payLoad, id, resurveyId).then(success).catch(error);
        }
    });
};

export const getTableDataOffline = (setIsLoading) => (dispatch) => {
    if (apiCalled.getTableDataOffline) return;
    apiCalled.getTableDataOffline = true;
    dispatch(request());
    offlineCreateTabledata()
        .then(async (res) => {
            if (res) {
                const [response] = res;
                dispatch(success(response?.data));
            }
            setIsLoading(false);
        })
        .catch(async (error) => {
            dispatch(failure(error.toString()));
            setIsLoading(false);
        });
    function request() {
        return { type: 'GET_TABLE_DATA_REQUEST' };
    }

    function success(tableDataList) {
        apiCalled.getTableDataOffline = false;
        return { type: 'GET_TABLE_DATA_SUCCESS', tableDataList };
    }

    function failure(error) {
        apiCalled.getTableDataOffline = false;
        return { type: 'GET_TABLE_DATA_FAILURE', error };
    }
};

export const SQLiteDatabaseInstance = (dbInstance) => (dispatch) => {
    dispatch({
        type: dbInstance ? 'GET_DATA_BASE_SUCESS' : 'GET_DATA_BASE_ERROR',
        dbInstance: dbInstance || undefined
    });
};
export const offlineModeEnabled = (offlineEnabled) => (dispatch) => {
    dispatch({
        type: offlineEnabled ? 'GET_OFFLINE_ENABLED_SUCESS' : 'GET_OFFLINE_ENABLED_ERROR',
        offlineEnabled: offlineEnabled
    });
};
export const getUserToken = (userToken) => (dispatch) => {
    dispatch({
        type: userToken ? 'GET_USER_TOKEN_SUCESS' : 'GET_USER_TOKEN_ERROR',
        userToken: userToken
    });
};

export const getSearchFields = (formId, value, dbInstance, isOffline, ticketId, usingId) => (dispatch) => {
    if (apiCalled.getSearchFields) return;
    dispatch(request());
    if (!value) return false;
    apiCalled.getSearchFields = true;
    if (isOffline) {
        const localDb = new Database(dbInstance);
        localDb
            .getSearchMappedData(formId, value, ticketId, usingId)
            .then((searchFieldList) => dispatch(success(...searchFieldList)))
            .catch((error) => dispatch(failure(error.toString())));
    } else {
        searchFields(formId, value, ticketId, usingId)
            .then((response) => response?.[0]?.data && dispatch(success(response?.[0], response?.[0]?.message)))
            .catch((error) => dispatch(failure(error.toString())));
    }
    function request() {
        return { type: 'GET_SEARCH_FIELDS_REQUEST' };
    }

    function success(searchFieldList, searchResultMessage = '') {
        apiCalled.getSearchFields = false;
        return { type: 'GET_SEARCH_FIELDS_SUCCESS', searchFieldList, searchResultMessage };
    }

    function failure(error) {
        apiCalled.getSearchFields = false;
        return { type: 'GET_SEARCH_FIELDS_FAILURE', error };
    }
};

export const getFormsForEdit = (statesRef, setIsLoading) => (dispatch) => {
    const { dbInstance, isOffline, formId } = statesRef || {}
    if (apiCalled.getFormsForEdit || !dbInstance) return;
    apiCalled.getFormsForEdit = true;
    dispatch(request());
    if (isOffline) {
        setIsLoading(true);
        const localDb = new Database(dbInstance);
        localDb
            .getAllFormsToList(formId)
            .then((formsData) => dispatch(success(formsData)))
            .catch((error) => dispatch(failure(error.toString())));
    } else {
        apiCalled.getFormsForEdit = false;
    }
    function request() {
        setIsLoading(false);
        return { type: 'GET_EDITABLE_FORMS_REQUEST' };
    }

    function success(editableForms) {
        setIsLoading(false);
        apiCalled.getFormsForEdit = false;
        return { type: 'GET_EDITABLE_FORMS_SUCCESS', editableForms };
    }

    function failure(error) {
        setIsLoading(false);
        apiCalled.getFormsForEdit = false;
        return { type: 'GET_EDITABLE_FORMS_FAILURE', error };
    }
};

export const setLoader = (isLoading) => (dispatch) => {
    dispatch({
        type: 'SET_LOADER',
        isLoading
    });
};

export const resetFormFieldData = () => (dispatch) => {
    dispatch({
        type: 'GET_FORMS_REQUEST'
    });
};

export const getNotificationsList = (dbInstance, isOfflineParam) => async (dispatch) => {
    if (!dbInstance || apiCalled.getNotificationsList) return false;
    apiCalled.getNotificationsList = true;
    dispatch(request());
    try {
        if (isOfflineParam) {
            const localDb = new Database(dbInstance);
            const res = await localDb.getFormNotifications();
            dispatch(success(JSON.parse(JSON.stringify(res))));
        } else {
            const res = await UserNotificationList();
            if (res) {
                dispatch(success(res[0]?.data));
            }
        }
    } catch (error) {
        console.log('error: ', error);
        dispatch(failure(error.toString()));
    }

    function request() {
        return { type: 'GET_NOTIFICATION_LIST_REQUEST' };
    }

    function success(notificationList) {
        apiCalled.getNotificationsList = false;
        return { type: 'GET_NOTIFICATION_LIST_SUCCESS', notificationList };
    }

    function failure(error) {
        apiCalled.getNotificationsList = false;
        return { type: 'GET_NOTIFICATION_LIST_FAILURE', error };
    }
};

export const getTicketInfoList = (payLoad, dbInstance, isOffline, setShowModal, toast) => (dispatch) => {
    if (apiCalled.getTicketInfoList) return;
    apiCalled.getTicketInfoList = true;
    dispatch(request());
    if (isOffline) {
        const localDb = new Database(dbInstance);
        localDb
            .getTicketInfoList(payLoad)
            .then((res) => {
                dispatch(success(res));
            })
            .catch((error) => {
                console.log('error', error);
                dispatch(failure(error.toString()));
            });
    } else {
        UserTicketInfoList(payLoad)
            .then((res) => {
                if (res) {
                    dispatch(success(res[0]));
                }
            })
            .catch(async (error) => {
                dispatch(failure(error.toString()));
            });
    }

    function request() {
        return { type: 'GET_TICKET_INFO_LIST_REQUEST' };
    }

    function success(ticketInfoList) {
        apiCalled.getTicketInfoList = false;
        return { type: 'GET_TICKET_INFO_LIST_SUCCESS', ticketInfoList };
    }

    function failure(error) {
        apiCalled.getTicketInfoList = false;
        setShowModal(false);
        toast('Something went wrong', 0)
        return { type: 'GET_TICKET_INFO_LIST_FAILURE', error };
    }
};

export const getSendOtpResponse = (mobileNum, formAtrId, Toast, setShowOtpInput, setOtpButtonLabel, setLoading) => async (dispatch) => {
    dispatch(request());
        sendOtp(mobileNum, formAtrId)
            .then((res) => {
                if (res) {
                    const [response, status] = res;
                    if(status === 200){
                        setShowOtpInput(true);
                        setOtpButtonLabel('Resend OTP');
                        setLoading(false);
                        dispatch(success(response));
                    } else {
                        Toast('Internal Server Error', 0);
                        setLoading(false)
                    }
                }
            })
            .catch(async (error) => {
                Toast('Unable To Send OTP', 0);
                dispatch(failure(error.toString()));
                setLoading(false);
            });
    function request() {
        return { type: 'GET_SEND_OTP_RESPONSE_REQUEST' };
    }

    function success(sendOtpResponseList) {
        apiCalled.getUserFormSubTypesList = false;
        return { type: 'GET_SEND_OTP_RESPONSE_SUCCESS', sendOtpResponseList };
    }

    function failure(error) {
        apiCalled.getUserFormSubTypesList = false;
        return { type: 'GET_SEND_OTP_RESPONSE_FAILURE', error };
    }
};
