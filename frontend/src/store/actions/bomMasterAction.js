import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getMaterialQuantity = createAsyncThunk('getMaterialQuantity', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType } = object || {};
  const response = await request('/material-quantity-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMaterialQuantityByProjectAndMaterial = createAsyncThunk(
  'getMaterialQuantityByProjectAndMaterial',
  async (object, { rejectWithValue }) => {
    const { projectId, materialId, pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType } = object || {};
    const response = await request('/material-quantity-project-and-material-list', {
      method: 'GET',
      query: { projectId, materialId, sort: [sortBy, sortOrder], pageIndex, pageSize, listType }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);
