import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getUrbans = createAsyncThunk('getUrbans', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/urban-hierarchies-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, levelType: 'urban' }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUrbanProjects = createAsyncThunk('getUrbanProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'rank',
    sortOrder = 'ASC',
    listType,
    projectId,
    searchString,
    accessors,
    filterObject,
    userId
  } = object || {};
  const response = await request('/urban-hierarchies-project-list', {
    method: 'GET',
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      levelType: 'urban',
      searchString,
      accessors,
      filterObject,
      userId
    },
    params: projectId
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUrbanLevelProjects = createAsyncThunk('getUrbanLevelProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    urbanId,
    searchString,
    accessors,
    filterObject
  } = object || {};
  const response = await request('/urban-level-entry-dropdown', {
    method: 'GET',
    params: urbanId,
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, searchString, accessors, filterObject }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUrbanLevelParents = createAsyncThunk('getUrbanLevelParents', async (object, { rejectWithValue }) => {
  const { sortBy = 'updatedAt', sortOrder = 'DESC', listType, urbanId } = object || {};
  const response = await request('/urban-level-entry-dropdown', {
    method: 'GET',
    params: urbanId,
    query: { sort: [sortBy, sortOrder], listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getUrbanHistory = createAsyncThunk('getUrbanHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/urban-hierarchies-history-list', {
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

export const getUrbanLevelEntryHistory = createAsyncThunk('getUrbanLevelEntryHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/urban-level-entry-history-list', {
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
