import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getSupervisorTicket = createAsyncThunk('getSupervisorTicket', async (object, { rejectWithValue }) => {
  const response = await request(`/supervisor-ticket-data`, {
    method: 'GET'
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
