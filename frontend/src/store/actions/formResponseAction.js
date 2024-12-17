import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getFormResponses = createAsyncThunk('getFormResponses', async (object, { signal, rejectWithValue }) => {
  const { pageIndex, pageSize, formId, filterObject, gaaLevelFilter, searchString, sortBy, sortOrder, sortType, listType } = object || {};
  const response = await request('/form-form-responses', {
    method: 'POST',
    body: {
      formId,
      isActive: listType,
      filterObject,
      searchString,
      ...(sortBy &&
        sortOrder && {
          sortObject: [
            {
              sortBy: sortBy,
              type: sortType,
              sortOrder: sortOrder
            }
          ]
        }),
      gaaLevelFilter
    },
    query: { pageIndex, pageSize },
    signal,
    timeoutOverride: 10 * 60 * 1000
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getSecondFormResponses = createAsyncThunk('getSecondFormResponses', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, formId, recordId } = object || {};
  const response = await request('/form-form-responses', {
    method: 'POST',
    query: { pageIndex, pageSize },
    body: { isHistory: true, formId, responseId: recordId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormProjectWise = createAsyncThunk('getFormProjectWise', async (object, { rejectWithValue }) => {
  const response = await request('/get-project-wise-forms', {
    method: 'GET'
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormWithRoles = createAsyncThunk('getFormWithRoles', async (id, { rejectWithValue }) => {
  const response = await request('/get-form-with-roles', {
    method: 'GET',
    query: { formId: id }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getFormWithUsers = createAsyncThunk('getFormWithUsers', async (obj, { rejectWithValue }) => {
  const response = await request('/get-form-with-users', {
    method: 'GET',
    query: { formId: obj.formId, roleId: obj.roleId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
