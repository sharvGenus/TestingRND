import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getTransactionTypeRangeList = createAsyncThunk('getTransactionTypeRangeList', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/transaction-type-range-list', {
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

export const getTransactionTypeRangeHistory = createAsyncThunk('getTransactionTypeRangeHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/transaction-type-range-history-list', {
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
