import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getDevolutionConfig = createAsyncThunk('getDevolutionConfig', async (object, { rejectWithValue }) => {
  const response = await request('/devolution-config-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      rowPerPage: object.pageSize,
      pageNumber: object.pageIndex,
      ...(object.searchString && { searchString: object.searchString }),
      ...(object.accessors && { accessors: object.accessors }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDevolutionMapping = createAsyncThunk('getDevolutionMapping', async (object, { rejectWithValue }) => {
  const response = await request('/devolution-mapping-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      devolutionConfigId: object.devolutionConfigId,
      rowPerPage: object.pageSize,
      pageNumber: object.pageIndex,
      sort: ['updatedAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDevolutionList = createAsyncThunk('getDevolutionList', async (object, { rejectWithValue }) => {
  const response = await request('/devolution-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      ...(object.customerId && { customerId: object.customerId }),
      ...(object.customerStoreId && { customerStoreId: object.customerStoreId }),
      ...(object.projectId && { projectId: object.projectId }),
      ...(object.formId && { formId: object.formId }),
      ...(object.approvalStatus && { approvalStatus: object.approvalStatus }),
      ...(object.gaaHierarchy && { gaaHierarchy: object.gaaHierarchy }),
      ...(object.searchString && { searchString: object.searchString }),
      ...(object.accessors && { accessors: object.accessors }),
      ...(object.pageSize && { rowPerPage: object.pageSize }),
      ...(object.pageIndex && { pageNumber: object.pageIndex }),
      ...(object.filterObject && { filterObject: object.filterObject }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
