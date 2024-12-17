import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getRoles = createAsyncThunk('getRoles', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, all, projectId } = object || {};
  const response = await request('/role-list', {
    method: 'GET',
    query: all ? {} : { sort: [sortBy, sortOrder], pageIndex, pageSize, projectId }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getRoleProjects = createAsyncThunk('getRoleProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    searchString,
    accessors,
    selectedProject,
    filterObject
  } = object || {};

  const response = await request('/role-dropdown', {
    method: 'GET',
    params: selectedProject,
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

export const getRolesHistory = createAsyncThunk('getRolesHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/role-history-list', {
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
