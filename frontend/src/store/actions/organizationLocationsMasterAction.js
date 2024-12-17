import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getOrganizationLocationsHistory = createAsyncThunk('getOrganizationLocationsHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/organization-location-history-list', {
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
