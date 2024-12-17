import { PAGINATION_CONST } from 'constants';
import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getApprovers = createAsyncThunk('getApprovers', async (object, { rejectWithValue }) => {
  const pageNumber = object && object.pageIndex ? object.pageIndex : PAGINATION_CONST.pageIndex;
  const rowPerPage = object && object.pageSize ? object.pageSize : PAGINATION_CONST.pageSize;
  const sortBy = object && object.sortBy ? object.sortBy : PAGINATION_CONST.sortBy;
  const sortOrder = object && object.sortOrder ? object.sortOrder : PAGINATION_CONST.sortOrder;
  const { projectId, transactionTypeId, storeId } = object;
  const response = await request('/approver-list', {
    method: 'GET',
    params: storeId ? `${projectId}/${transactionTypeId}/${storeId}` : `${projectId}/${transactionTypeId}/null`,
    query: object.all ? { sort: [sortBy, sortOrder] } : { sort: [sortBy, sortOrder], pageNumber, rowPerPage }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllApprovers = createAsyncThunk('getAllApprovers', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', searchString, accessors, filterObject } = object || {};

  const response = await request('/approver-get-all-list', {
    method: 'GET',
    query: {
      pageIndex,
      pageSize,
      sort: [sortBy, sortOrder],
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

export const getApproversList = createAsyncThunk('getApproversList', async (object, { rejectWithValue }) => {
  const response = await request('/request-approver-list', {
    method: 'GET',
    query: object?.storeId
      ? { transactionTypeId: object?.transactionTypeId, requestNumber: object?.requestNumber, storeId: object?.storeId }
      : { transactionTypeId: object?.transactionTypeId, requestNumber: object?.requestNumber }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
