import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getFirmStoreLocations = createAsyncThunk('getFirmStoreLocations', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, listType, organizationType, searchString, accessors, filterObject } = object || {};
  const response = await request('/organization-store-location-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, organizationType, listType, searchString, accessors, filterObject }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCompanyStoreLocations = createAsyncThunk('getCompanyStoreLocations', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, listType, organizationType, searchString, accessors, filterObject } = object || {};
  const response = await request('/organization-store-location-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, organizationType, listType, searchString, accessors, filterObject }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationStoreLocationsHistory = createAsyncThunk(
  'getOrganizationStoreLocationsHistory',
  async (object, { rejectWithValue }) => {
    const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
    const response = await request('/organization-store-location-history-list', {
      method: 'GET',
      query: { sort: [sortBy, sortOrder], pageIndex, pageSize },
      params: recordId
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);
