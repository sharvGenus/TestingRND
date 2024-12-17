import axios from 'axios';

import { constants } from '../constants';
import interceptor from './interceptor';

/**
 * httpsService: function to ajax call from frontend
 * it take params formdata which is an instance of FormData class which is optional
 * if params isn't provided then it will considered as plain http request and process with application/json format
 * if called with multipart formdata then it will return an instance of multipart/form-data request
 * @param {*} formData multipart form data instance
 * @returns {*} axios instance url
 */

export default (formData = null) => {
  const instanceUrl = axios.create({
    baseURL: constants.API_HOST + constants.API_BASE + constants.API_VERSION,
    transformRequest: [
      (data, headers) => {
        // headers.Authorization = `Bearer ${sessionStorage.authToken}`;
        headers['Content-Type'] = formData ? 'multipart/form-data' : 'application/json';
        headers['Cache-Control'] = 'no-cache';
        headers.Pragma = 'no-cache';
        return formData ? data : JSON.stringify(data);
      }
    ],
    ...(formData && { data: formData })
  });
  instanceUrl.interceptors.request.use((request) => interceptor.requestHandler(request));
  instanceUrl.interceptors.response.use(
    (response) => interceptor.successHandler(response),
    (error) => interceptor.errorHandler(error)
  );
  return instanceUrl;
};
