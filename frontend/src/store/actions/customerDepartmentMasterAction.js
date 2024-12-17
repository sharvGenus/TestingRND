import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const getCustomerDepartments = createAsyncThunk('getCustomerDepartments', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy = 'updatedAt', sortOrder = 'DESC', listType } = object || {};
  const response = await request('/customer-department-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageIndex, pageSize, listType }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCustomerDepartmentsDropdown = createAsyncThunk('getCustomerDepartmentsDropdown', async (object, { rejectWithValue }) => {
  const response = await request('/customer-department-dropdown', { method: 'GET', params: object });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getCustomerDepartmentsHistory = createAsyncThunk('getCustomerDepartmentsHistory', async (object, { rejectWithValue }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, recordId } = object || {};
  const response = await request('/customer-department-history-list', {
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

export const getCustomerWiseCustomerDepartments = createAsyncThunk(
  'getCustomerWiseCustomerDepartments',
  async (object, { rejectWithValue }) => {
    const {
      pageIndex,
      pageSize,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
      customerId,
      listType,
      searchString,
      accessors,
      filterObject
    } = object || {};

    const response = await request('/customer-wise-customer-departments-list', {
      method: 'GET',
      query: {
        sort: [sortBy, sortOrder],
        pageIndex,
        pageSize,
        customerId,
        listType,
        searchString,
        accessors,
        filterObject: JSON.stringify(filterObject)
      }
    });

    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);
