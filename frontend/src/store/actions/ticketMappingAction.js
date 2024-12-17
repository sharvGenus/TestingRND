import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getFormWiseTicketMapping = createAsyncThunk('getFormWiseTicketMapping', async (object, { rejectWithValue }) => {
  const response = await request(`/form-wise-ticket-mapping-list`, { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectWiseTicketMapping = createAsyncThunk('getProjectWiseTicketMapping', async (object, { rejectWithValue }) => {
  const projectId = object?.projectId || null;
  const response = await request(`/project-wise-ticket-mapping-list`, { method: 'GET', query: { projectId } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
