import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getMasterMakerLov = createAsyncThunk('getMasterMakerLov', async (object, { rejectWithValue }) => {
  const response = await request('/master-maker-lovs-list', {
    method: 'GET'
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMasterMakerLovList = createAsyncThunk('getMasterMakerLovList', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/master-maker-lovs-list', {
    method: 'GET',
    query: {
      sort: [sortBy, sortOrder],
      pageSize,
      pageIndex,
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

export const getDropdownMasterMakers = createAsyncThunk('getDropdownMasterMakers', async (object, { rejectWithValue }) => {
  const response = await request('/master-maker-dropdown', { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getLovsForMasterName = createAsyncThunk('masterMakerLov/getLovsForMasterName', async (masterName, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: masterName });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getLovsForMasterNameSecond = createAsyncThunk(
  'masterMakerLov/getLovsForMasterNameSecond',
  async (masterName, { rejectWithValue }) => {
    const response = await request('/lov-dropdown', { method: 'GET', params: masterName });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getLovsForMasterNameThird = createAsyncThunk(
  'masterMakerLov/getLovsForMasterNameThird',
  async (masterName, { rejectWithValue }) => {
    const response = await request('/lov-dropdown', { method: 'GET', params: masterName });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getCurrency = createAsyncThunk('getCurrency', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getGstStatus = createAsyncThunk('getGstStatus', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getPaymentTerm = createAsyncThunk('getPaymentTerm', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getIncoterms = createAsyncThunk('getIncoterms', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTitle = createAsyncThunk('getTitle', async (object, { rejectWithValue }) => {
  const response = await request('/lov-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMasterMakerLovHistory = createAsyncThunk('getMasterMakerLovHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/master-maker-lov-history-list', {
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
