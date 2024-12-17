import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getRural = createAsyncThunk('getRural', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/rural-hierarchies-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, levelType: 'rural' }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getRuralProjects = createAsyncThunk('getRuralProjects', async (object, { rejectWithValue }) => {
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

  const response = await request('/rural-hierarchies-project-list', {
    method: 'GET',
    params: projectId,
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      levelType: 'rural',
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

export const getRuralLevelProjects = createAsyncThunk('getRuralLevelProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    ruralId,
    searchString,
    accessors,
    filterObject
  } = object || {};
  const response = await request('/rural-level-entry-dropdown', {
    method: 'GET',
    params: ruralId,
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, searchString, accessors, filterObject }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getRuralLevelParents = createAsyncThunk('getRuralLevelParents', async (object, { rejectWithValue }) => {
  const { sortBy = 'updatedAt', sortOrder = 'DESC', listType, ruralId } = object || {};
  const response = await request('/rural-level-entry-dropdown', {
    method: 'GET',
    params: ruralId,
    query: { sort: [sortBy, sortOrder], listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getRuralHistory = createAsyncThunk('getRuralHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/rural-hierarchies-history-list', {
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

export const getRuralLevelEntryHistory = createAsyncThunk('getRuralLevelEntryHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/rural-level-entry-history-list', {
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
