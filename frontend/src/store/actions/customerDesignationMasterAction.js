import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getCustomerDesignations = createAsyncThunk('getCustomerDesignations', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType } = object || {};
  const response = await request('/customer-designation-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCustomerDesignationHistory = createAsyncThunk('getCustomerDesignationHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/customer-designation-history-list', {
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

export const getDepartmentWiseCustomerDesignations = createAsyncThunk(
  'getDepartmentWiseCustomerDesignations',
  async (object, { rejectWithValue }) => {
    const {
      pageIndex,
      pageSize,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
      customerDepartmentId,
      listType,
      searchString,
      accessors,
      filterObject
    } = object || {};
    const response = await request('/department-wise-customer-designations-list', {
      method: 'GET',
      query: { sort: [sortBy, sortOrder], pageIndex, pageSize, customerDepartmentId, listType, searchString, accessors, filterObject }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);
