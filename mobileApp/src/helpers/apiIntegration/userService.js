import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMethod from './apiMethod';
import Toast from '../../components/Toast';
import { setToken } from '../../actions/authActions';
import { Database } from '../database';

export const UserVerify = (number, hashCode, version, deviceId) => {
    return apiMethod.postWithoutToken('/auth/verify-user?listType=1', {
        username: number,
        isMobileLogin: true,
        hashCode,
        appVersion: version,
        deviceId
    });
};

export const ResendOtp = (secretToken) => {
    return apiMethod.postWithoutToken('/auth/resent-otp?listType=1', { secretToken });
};

export const UserLoginWithOtp = async (values, navigation, setIsLoading, setValue, dispatch) => {
    setIsLoading(true);
    return apiMethod
        .postWithoutToken('/auth/login-with-otp?listType=1', values)
        .then(async ([response, status]) => {
            if (response?.token && status == 200) {
                // setValue('');
                setIsLoading(false);
                if (response?.offline_mode != undefined)
                    await AsyncStorage.setItem('offlineModeEnabled', response?.offline_mode?.toLowerCase());
                if (response?.user?.areaAllocation)
                    await AsyncStorage.setItem('areaAllocated', JSON.stringify(response?.user?.areaAllocation));
                await AsyncStorage.setItem('token', response.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response));
                dispatch(setToken(response.token));
                navigation.replace('DrawerStack');
            }
            return response;
        })
        .catch((error) => {
            setIsLoading(false);
            Toast(`${error.message}`, 0);
            return error;
        });
};

export const UserFormsTypes = () => {
    return apiMethod.get('/form/get-all-type?listType=1');
};

/**Offline provision */
export const getResurveyedForm = (formid, offset, limit) => {
    return apiMethod.get(`/form/resurvey-list/${formid}?listType=1&offset=${offset}&limit=${limit}`);
};

/**Offline provision */
export const UserFormsSubTypesList = (isOandM) => {
    return apiMethod.get(`/form/list?sort[]=updatedAt&sort[]=DESC&listType=1&isTicket=${isOandM}`);
};

/**Offline provision */
export const UserForms = (id) => {
    return apiMethod.get(`/form-attributes/list?formId=${id}&sort[]=rank&sort[]=ASC&listType=1`);
};

/**Offline provision */
export const UserformSubmit = (payLoad, id, resurveyId) => {
    if (resurveyId) {
        return apiMethod.putFormData(`/form/update-response/${id}?listType=1`, payLoad);
    }
    return apiMethod.postFormData(`/form/submit-response/${id}?listType=1`, payLoad);
};

/**Offline provision */
export const FormDropDownLov = (payLoad) => {
    return apiMethod.post(`/form/get-dropdown-field-data?listType=1`, payLoad);
};

export const offlineCreateTabledata = () => {
    return apiMethod.get('/form/get-table-data?listType=1');
};

export const searchFields = (formId, input, ticketId, usingId) => {
    const ticketString = ticketId ? `&ticketId=${ticketId}` : '';
    const isUsingId = usingId ? `&useId=1` : '';
    return apiMethod.get(`/form/get-mapped-data?formId=${formId}&searchBy=${input}&listType=1${ticketString}${isUsingId}`);
};

export const UserNotificationList = () => {
    return apiMethod.get('/form-notifications/list');
};

export const UserUpdateNotificationList = (dbInstance, isOffline) => {
    if(isOffline) {
        const localDb = new Database(dbInstance);
        return localDb.updateNotifications();
    }
    return apiMethod.put('/form-notifications/update');
};

export const UserTicketUpdateList = (dbInstance, isOffline, id, payLoad) => {
    if (isOffline) {
        const localDb = new Database(dbInstance);
        return localDb.updateTicketStatus(payLoad, id);
    }
    return apiMethod.put(`/ticket/update-mobile/${id}`, payLoad);
};

export const UserTicketInfoList = (payLoad) => {
    return apiMethod.post(`/forms/get-ticket-info`, payLoad);
};
export const googleCloudVisionApi = (payLoad) => {
    return apiMethod.post('/forms/ocr-reader', payLoad);
};
export const VerifyPhoneNumber = (mobileNum, hashCode, id) => {
    return apiMethod.post('/auth/verify-num', { mobileNum, hashCode, id });
};
export const VerifyPhoneOtp = (mobileNum, id, otp) => {
    return apiMethod.get(`/auth/verify-OTP?mobileNum=${mobileNum}&id=${id}&otp=${otp}`);
};

export const sendOtp = (mobileNum, formAtrId) => {
    return apiMethod.get(`/auth/send-otp?mobileNum=${mobileNum}&formAtrId=${formAtrId}`);
};
