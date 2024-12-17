import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getMasterMaker = createAsyncThunk('getMasterMaker', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, filterObject } = object || {};

  const response = await request('/master-maker-list', {
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

export const getMasterMakerHistory = createAsyncThunk('getMasterMakerHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/master-maker-history-list', {
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
