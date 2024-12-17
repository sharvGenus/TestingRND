import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const plantCodeList = createAsyncThunk('plant-code-list', async (id, { rejectWithValue }) => {
  const response = await request('/plant-code-list', {
    method: 'GET',
    query: {
      organizationIntegrationId: id
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const purchaseOrderList = createAsyncThunk('purchase-order-list', async (object, { rejectWithValue }) => {
  const response = await request('/purchase-order-list', {
    method: 'GET',
    query: object
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
