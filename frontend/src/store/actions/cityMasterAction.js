import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getCities = createAsyncThunk('getCities', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/city-list', {
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

export const getDropdownCities = createAsyncThunk('getDropdownCities', async (object, { rejectWithValue }) => {
  const response = await request('/city-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCurrentDropdownCities = createAsyncThunk('getCurrentDropdownCities', async (object, { rejectWithValue }) => {
  const response = await request('/city-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCitiesHistory = createAsyncThunk('getCitiesHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/city-history-list', {
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
