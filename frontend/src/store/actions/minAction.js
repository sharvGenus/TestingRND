import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getMin = createAsyncThunk('getMin', async (queryParams, { rejectWithValue }) => {
  const response = await request('/transaction-list', { method: 'GET', query: queryParams });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
