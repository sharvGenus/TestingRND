import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getSupervisorAssignments = createAsyncThunk('getSupervisorAssignments', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, userId, supervisorId, listType } = object || {};
  const response = await request('/supervisor-assignment-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, userId, supervisorId, listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getSupervisorAssignmentHistory = createAsyncThunk('getSupervisorAssignmentHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId, listType } = object || {};
  const response = await request('/supervisor-assignments-history-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
