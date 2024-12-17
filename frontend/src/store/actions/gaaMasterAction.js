import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getGaa = createAsyncThunk('getGaa', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/gaa-hierarchies-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, levelType: 'gaa' }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getGaaProjects = createAsyncThunk('getGaaProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'rank',
    sortOrder = 'ASC',
    listType,
    projectId,
    userId,
    searchString,
    accessors,
    filterObject
  } = object || {};

  const response = await request('/gaa-hierarchies-project-list', {
    method: 'GET',
    params: projectId,
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      levelType: 'gaa',
      searchString,
      accessors,
      filterObject,
      userId
    }
  });

  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getGaaLevelProjects = createAsyncThunk('getGaaLevelProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    gaaId,
    searchString,
    accessors,
    filterObject
  } = object || {};
  const response = await request('/gaa-level-entry-dropdown', {
    method: 'GET',
    params: gaaId,
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, searchString, accessors, filterObject }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getGaaLevelParents = createAsyncThunk('getGaaLevelParents', async (object, { rejectWithValue }) => {
  const { sortBy = 'updatedAt', sortOrder = 'DESC', listType, gaaId } = object || {};
  const response = await request('/gaa-level-entry-dropdown', {
    method: 'GET',
    params: gaaId,
    query: { sort: [sortBy, sortOrder], listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getProjectAreaLevels = createAsyncThunk('getProjectAreaLevels', async (object, { rejectWithValue }) => {
  let { projectId, formId, isAccessForAllResponses } = object || {};
  if (typeof object === 'string') {
    projectId = object;
  }
  const response = await request('/area-project-level', {
    method: 'GET',
    params: projectId || formId,
    query: { formId, isAccessForAllResponses, sort: ['rank', 'ASC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getGAAHistory = createAsyncThunk('getGAAHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/gaa-hierarchies-history-list', {
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

export const getGAALevelEntryHistory = createAsyncThunk('getGAALevelEntryHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/gaa-level-entry-history-list', {
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
