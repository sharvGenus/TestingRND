import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getProjects = createAsyncThunk('getProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    searchString,
    accessors,
    filterObject,
    getAll
  } = object || {};

  const response = await request('/project-list', {
    method: 'GET',
    query: {
      ...(!getAll && { sort: [sortBy, sortOrder] }),
      ...(!getAll && { pageIndex }),
      ...(!getAll && { pageSize }),
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

export const getProjectDetails = createAsyncThunk('getProjectDetails', async (object, { rejectWithValue }) => {
  const response = await request('/project-details', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownProjects = createAsyncThunk('getDropdownProjects', async (object, { rejectWithValue }) => {
  const response = await request('/project-dropdown', { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDropdownAllProjects = createAsyncThunk('getDropdownAllProjects', async (object, { rejectWithValue }) => {
  const response = await request('/all-project-dropdown', { method: 'GET' });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectsForRoleOrUser = createAsyncThunk('getProjectsForRoleOrUser', async (object, { rejectWithValue }) => {
  const response = await request('/project-governed-for-role-or-user', { method: 'GET', query: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectsHistory = createAsyncThunk('getProjectsHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/project-history-list', {
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
