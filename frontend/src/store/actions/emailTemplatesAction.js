import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getEmailTemplates = createAsyncThunk('getEmailTemplates', async (queryParams, { rejectWithValue }) => {
  const response = await request('/email-template-list', { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
