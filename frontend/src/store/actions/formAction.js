import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const formAction = createAsyncThunk('formAction', async (object, { rejectWithValue }) => {
  const response = await request(object.url, { method: 'POST', body: object.body });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
