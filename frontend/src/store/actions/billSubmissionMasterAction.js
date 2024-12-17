import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getBillSubmissions = createAsyncThunk('getBillSubmissions', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType, searchString, accessors, projectId } = object || {};
  const response = await request('/bill-submissions-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, searchString, accessors, projectId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMaterialDetails = createAsyncThunk('getMaterialDetails', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', billingBasicDetailId } = object || {};
  const response = await request('/bill-material-submissions-list', {
    method: 'GET',
    query: { billingBasicDetailId, sort: [sortBy, sortOrder], pageIndex, pageSize }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
