import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getOrganizationStores = createAsyncThunk('getOrganizationStores', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    organizationType,
    listType,
    searchString,
    accessors,
    filterObject
  } = object || {};

  const response = await request('/organization-store-list', {
    method: 'GET',
    query: {
      organizationType,
      listType,
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      searchString,
      accessors,
      filterObject
    }
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationStoresAllAccess = createAsyncThunk('getOrganizationStoresAllAccess', async (object, { rejectWithValue }) => {
  const { organizationType, organizationId } = object || {};
  const response = await request('/organization-store-data', {
    method: 'GET',
    query: { organizationType, organizationId, sort: ['updatedAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationStoresSecond = createAsyncThunk('getOrganizationStoresSecond', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, organizationType, listType } = object || {};
  const response = await request('/organization-store-list', {
    method: 'GET',
    query: { organizationType, listType, sort: [sortBy, sortOrder], pageIndex, pageSize }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownOrganizationStores = createAsyncThunk('getDropdownOrganizationStores', async (object, { rejectWithValue }) => {
  const response = await request('/organization-store-list', { method: 'GET', query: { organizationType: object } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownOrganizationStoresSecond = createAsyncThunk(
  'getDropdownOrganizationStoresSecond',
  async (object, { rejectWithValue }) => {
    const response = await request('/organization-store-list', { method: 'GET', query: { organizationType: object } });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getOrgStoreDropdown = createAsyncThunk('getOrgStoreDropdown', async (object, { rejectWithValue }) => {
  const response = await request('/organization-store-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrgViewStoreDropdown = createAsyncThunk('getOrgViewStoreDropdown', async (object, { rejectWithValue }) => {
  const { userId, organizationType } = object;
  const response = await request('/organization-view-store-dropdown', { method: 'GET', query: { userId, organizationType } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationStoresHistory = createAsyncThunk('getOrganizationStoresHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/organization-store-history-list', {
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
