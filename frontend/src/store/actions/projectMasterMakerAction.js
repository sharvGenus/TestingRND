import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getProjectMasterMaker = createAsyncThunk('getProjectMasterMaker', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/project-master-maker-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMasterMakerProjects = createAsyncThunk('getMasterMakerProjects', async (object, { rejectWithValue }) => {
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

  const response = await request('/master-maker-project-list', {
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

export const getProjectMasterMakerHistory = createAsyncThunk('getProjectMasterMakerHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/project-master-maker-history-list', {
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
