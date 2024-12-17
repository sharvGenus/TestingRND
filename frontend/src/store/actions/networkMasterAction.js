import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getNetworks = createAsyncThunk('getNetworks', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/network-hierarchies-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, levelType: 'network' }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getNetworkProjects = createAsyncThunk('getNetworkProjects', async (object, { rejectWithValue }) => {
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
  const response = await request('/network-hierarchies-project-list', {
    method: 'GET',
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      levelType: 'network',
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

export const getNetworkLevelProjects = createAsyncThunk('getNetworkLevelProjects', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    networkId,
    searchString,
    accessors,
    filterObject
  } = object || {};
  const response = await request('/network-level-entry-dropdown', {
    method: 'GET',
    params: networkId,
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType, searchString, accessors, filterObject }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getNetworkLevelParents = createAsyncThunk('getNetworkLevelParents', async (object, { rejectWithValue }) => {
  const { sortBy = 'updatedAt', sortOrder = 'DESC', listType, networkId } = object || {};
  const response = await request('/network-level-entry-dropdown', {
    method: 'GET',
    params: networkId,
    query: { sort: [sortBy, sortOrder], listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getNetworkHistory = createAsyncThunk('getNetworkHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/network-hierarchies-history-list', {
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

export const getNetworkLevelEntryHistory = createAsyncThunk('getNetworkLevelEntryHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/network-level-entry-history-list', {
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
