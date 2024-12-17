import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getMaterial = createAsyncThunk('getMaterial', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/material-list', {
    method: 'GET',
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      searchString,
      accessors,
      filterObject
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMaterialByIntegrationId = createAsyncThunk('getMaterialByIntegrationId', async (id, { rejectWithValue }) => {
  const response = await request('/material-details', { method: 'GET', params: id });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownMaterial = createAsyncThunk('getDropdownMaterial', async (object, { rejectWithValue }) => {
  const response = await request('/material-dropdown', { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownUom = createAsyncThunk('getDropdownUom', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: 'UOM' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownMaterialType = createAsyncThunk('getDropdownMaterialType', async (object, { rejectWithValue }) => {
  const response = await request('/material-type-dropdown', { method: 'GET', params: 'MATERIAL TYPE' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMaterialHistory = createAsyncThunk('getMaterialHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/material-history-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
