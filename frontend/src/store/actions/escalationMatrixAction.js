import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getEscalationMatrix = createAsyncThunk('getEscalationMatrix', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize } = object || {};
  const response = await request(`/escalation-matrix-list`, {
    method: 'GET',
    query: { pageIndex, pageSize }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
