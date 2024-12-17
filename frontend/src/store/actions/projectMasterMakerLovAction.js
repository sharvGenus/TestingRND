import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getProjectMasterMakerLov = createAsyncThunk('getProjectMasterMakerLov', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder } = object || {};
  const response = await request('/project-master-maker-lovs-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getMasterMakersLovsList = createAsyncThunk('getMasterMakersLovsList', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    searchString,
    accessors,
    selectedProjectMaster,
    filterObject
  } = object || {};

  const response = await request('/project-master-maker-lovs', {
    method: 'GET',
    params: selectedProjectMaster || 'all',
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

export const getProjectMasterMakerLovHistory = createAsyncThunk('getProjectMasterMakerLovHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/project-master-maker-lovs-history-list', {
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
