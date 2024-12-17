import axios from 'axios';
import { DEFAULT_ERROR, REQUEST_TIMEOUT, TIMEOUT_ERROR } from '../constants';
import URL_CONFIG from './api-constants';
import toast from './ToastNotistack';

const getValidationErrorMessage = (errors) => {
  // eslint-disable-next-line
  const { constraints } = errors[0];
  return Object.values(constraints).join(', ');
};

const getUrl = (path, isStaticPath = false) => {
  const result = { URL: '' };
  const config = isStaticPath ? path : URL_CONFIG[path] ?? null;

  if (config) {
    if (typeof config === 'string') {
      return { ...result, URL: config };
    }
    return config;
  }
  return result;
};

const request = async (url, options = {}, reload = true, isStaticPath = false) => {
  const {
    method = 'GET',
    query = {},
    body,
    headers = {},
    headersOverride,
    timeoutOverride,
    apiVersionNumber = 'v1',
    responseType,
    signal
  } = options;
  if (query.pageIndex) {
    query.pageNumber = query.pageIndex;
    delete query.pageIndex;
  }
  if (query.pageSize) {
    query.rowPerPage = query.pageSize;
    delete query.pageSize;
  }
  try {
    const { URL: defaultUrl, headers: headersConsts } = getUrl(url, isStaticPath);

    let URL = (isStaticPath ? '' : `/api/${apiVersionNumber}`) + defaultUrl;
    if (options.params) URL = `${URL}/${options.params}`;

    const isFormData = body;

    const reqHeaders = headersOverride || {
      ...headersConsts,
      ...headers
    };

    if (method === 'POST' && !isFormData) {
      reqHeaders['Content-Type'] = 'application/json';
    }

    const response = await axios.request({
      url: URL,
      method,
      headers: reqHeaders,
      params: query,
      data: body,
      responseType: responseType,
      timeout: timeoutOverride || REQUEST_TIMEOUT,
      signal
    });
    return { ...response, success: true };
  } catch (errorResponse) {
    if (errorResponse?.response?.status === 403 || errorResponse?.response?.status === 401) {
      toast(errorResponse?.response?.data.message || 'Session Expired');
      reload &&
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
    }

    if (errorResponse.code === 'ECONNABORTED' || errorResponse.timeout) {
      return {
        success: false,
        data: null,
        error: TIMEOUT_ERROR
      };
    }

    if (!errorResponse?.response) {
      return {
        success: false,
        data: null,
        error: DEFAULT_ERROR
      };
    }

    // TODO : Handle un authorized user
    const { response, message, code } = errorResponse;

    let errorMessage;

    if (Array.isArray(message)) {
      errorMessage = getValidationErrorMessage(message);
    } else {
      errorMessage = response?.data?.errors?.[0]?.msg || response?.data?.message || message;
    }
    return {
      success: false,
      data: null,
      error: {
        code,
        message: errorMessage,
        statusCode: typeof errorResponse.statusCode === 'string' ? errorResponse.statusCode : undefined
      }
    };
  }
};

export default request;
