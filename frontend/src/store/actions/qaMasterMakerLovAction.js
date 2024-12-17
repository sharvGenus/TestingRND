import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getQAMasterMakerLov = createAsyncThunk('getQAMasterMakerLov', async (object, { rejectWithValue }) => {
  const {
    pageIndex,
    pageSize,
    sortBy = 'updatedAt',
    sortOrder = 'DESC',
    listType,
    searchString,
    accessors,
    selectedQAMaster,
    filterObject
  } = object || {};

  const response = await request('/qa-master-maker-lovs-list', {
    method: 'GET',
    query: {
      sort: [sortBy, sortOrder],
      pageIndex,
      pageSize,
      listType,
      searchString,
      masterId: selectedQAMaster,
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

export const getQAMasterMakerLovHistory = createAsyncThunk('getQAMasterMakerLovHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/qa-master-maker-lovs-history-list', {
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
