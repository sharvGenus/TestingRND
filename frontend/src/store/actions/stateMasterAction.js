import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getStates = createAsyncThunk('getStates', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/state-list', {
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

export const getDropdownStates = createAsyncThunk('getDropdownStates', async (object, { rejectWithValue }) => {
  const response = await request('/state-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCurrentDropdownStates = createAsyncThunk('getCurrentDropdownStates', async (object, { rejectWithValue }) => {
  const response = await request('/state-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStatesHistory = createAsyncThunk('getStatesHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/state-history-list', {
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
