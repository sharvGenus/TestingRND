import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getUsers = createAsyncThunk('getUsers', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    lockType,
    organizationId,
    organisationBranchId,
    roleId,
    searchString,
    accessors,
    supervision,
    projectId,
    filterObject,
    all,
    hasAccess = 'false'
  } = object || {};
  const response = await request('/user-list', {
    method: 'GET',
    query: {
      roleId,
      supervision,
      listType,
      lockType,
      hasAccess,
      ...(organisationBranchId ? { organisationBranchId: organisationBranchId } : { organizationId: organizationId }),
      ...(!all && { sort: [sortBy, sortOrder], pageIndex, pageSize, filterObject, searchString, accessors, projectId: [projectId] })
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUsersByPermission = createAsyncThunk('getUsersByPermission', async (object, { rejectWithValue }) => {
  const { contractorStoreId } = object || {};
  const response = await request('/user-by-store-permission', {
    method: 'GET',
    query: {
      contractorStoreId
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const clearUsers = createAsyncThunk('clearUsers', async () => {
  return true;
});

export const getUsersWithForms = createAsyncThunk('getUsersWithForms', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, listType, organizationId, roleId, supervision, all } = object || {};
  const response = await request('/user-list-with-form-access', {
    method: 'GET',
    query: all ? { organizationId, roleId, supervision, listType } : { pageIndex, pageSize, organizationId, roleId, supervision, listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUsersSecond = createAsyncThunk('getUsersSecond', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, listType, organizationId, roleId, supervision, projectId } = object || {};
  const response = await request('/user-list', {
    method: 'GET',
    query: object.all
      ? { organizationId, roleId, supervision, listType }
      : { sort: [sortBy, sortOrder], pageIndex, pageSize, organizationId, roleId, supervision, listType, projectId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUsersHistory = createAsyncThunk('getUsersHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, recordId } = object || {};
  const response = await request('/user-history-list', {
    method: 'GET',
    query: { sort: ['updatedAt', 'DESC'], pageIndex, pageSize },
    params: recordId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllSupervisors = createAsyncThunk('getAllSupervisors', async (object, { rejectWithValue }) => {
  const { projectId, organizationId, hasAccess = false } = object || {};
  const response = await request('/supervisor-list', {
    method: 'GET',
    query: { projectId, organizationId, hasAccess }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
