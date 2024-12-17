import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getOrganizations = createAsyncThunk('getOrganizations', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, listType, searchString, accessors, filterObject } = object || {};
  const response = await request('/organization-list', {
    method: 'GET',
    params: object?.transactionTypeId,
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
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

export const getOrganizationsLocationByParent = createAsyncThunk(
  'getOrganizationsLocationByParent',
  async (object, { rejectWithValue }) => {
    const { pageIndex, pageSize, sortBy, sortOrder, listType, hasAccess = false } = object || {};
    const response = await request('/organization-location-by-parent-list', {
      method: 'GET',
      params: object?.params,
      query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, hasAccess }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getOrganizationsLocationByParentSecond = createAsyncThunk(
  'getOrganizationsLocationByParentSecond',
  async (object, { rejectWithValue }) => {
    const { pageIndex, pageSize, sortBy, sortOrder, listType } = object || {};
    const response = await request('/organization-location-by-parent-list', {
      method: 'GET',
      params: object?.params,
      query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getOrganizationsLocation = createAsyncThunk('getOrganizationsLocation', async (object, { rejectWithValue }) => {
  const { transactionTypeId, pageIndex, pageSize, sortBy, sortOrder, listType, all, searchString, accessors, filterObject } = object || {};
  const query = all
    ? {}
    : {
        sort: [sortBy, sortOrder],
        pageIndex,
        pageSize,
        listType,
        searchString,
        accessors,
        filterObject
      };

  const response = await request('/organization-location-list', {
    method: 'GET',
    params: transactionTypeId,
    query
  });

  if (response.success) {
    return response.data;
  }

  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationsListData = createAsyncThunk('getOrganizationsListData', async (object, { rejectWithValue }) => {
  const response = await request('/organization-get-all-list', {
    method: 'GET'
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownOrganization = createAsyncThunk('getDropdownOrganization', async (object, { rejectWithValue }) => {
  // please dont append anything in URL wihout taking prior confirmation
  const response = await request('/organization-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownOrganizationLocation = createAsyncThunk('getDropdownOrganizationLocation', async (object, { rejectWithValue }) => {
  const response = await request('/organization-location-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownOrganizationLocationSecond = createAsyncThunk(
  'getDropdownOrganizationLocationSecond',
  async (object, { rejectWithValue }) => {
    const response = await request('/organization-location-dropdown', { method: 'GET', params: object });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getDropdownOrganizationSecond = createAsyncThunk('getDropdownOrganizationSecond', async (object, { rejectWithValue }) => {
  const { organizationTypeId, multiId } = object || {};
  const response = await request('/organization-dropdown', { method: 'GET', params: organizationTypeId, query: { multiId } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationList = createAsyncThunk('getOrganizationList', async (object, { rejectWithValue }) => {
  const response = await request('/organization-list', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationListData = createAsyncThunk('getOrganizationListData', async (object, { rejectWithValue }) => {
  const { organizationTypeId, parentId } = object;
  const response = await request('/organization-list-data', { method: 'GET', query: { organizationTypeId, parentId } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationListDataSecond = createAsyncThunk('getOrganizationListDataSecond', async (object, { rejectWithValue }) => {
  const { organizationTypeId, parentId } = object;
  const response = await request('/organization-list-data', { method: 'GET', query: { organizationTypeId, parentId } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationListSecond = createAsyncThunk('getOrganizationListSecond', async (object, { rejectWithValue }) => {
  const response = await request('/organization-list', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getOrganizationsHistory = createAsyncThunk('getOrganizationsHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/organization-history-list', {
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
