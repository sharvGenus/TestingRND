import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getWorkAreaAssignments = createAsyncThunk('getWorkAreaAssignments', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, userId } = object || {};
  const response = await request('/work-area-assignment-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, userId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getWorkAreaAssignmentHistory = createAsyncThunk('getWorkAreaAssignmentHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/work-area-assignment-history-list', {
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
