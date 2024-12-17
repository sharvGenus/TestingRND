import { createAsyncThunk } from '@reduxjs/toolkit';
// import { PAGINATION_CONST } from '../../constants';
import request from '../../utils/request';

export const fetchRequestDetails = createAsyncThunk('request-list', async (object, { rejectWithValue }) => {
  // const pageNumber = object && object.pageIndex ? object.pageIndex : PAGINATION_CONST.pageIndex;
  // const rowPerPage = object && object.pageSize ? object.pageSize : PAGINATION_CONST.pageSize;
  const sortBy = object && object.sortBy && object.sortBy;
  const sortOrder = object && object.sortOrder && object.sortOrder;
  const searchString = object && object.searchString;
  const accessors = object && object.accessors;
  const response = await request('/request-list', {
    method: 'GET',
    query: {
      transactionTypeId: object?.transactionTypeId,
      referenceDocumentNumber: object?.referenceDocumentNumber,
      projectId: object?.projectId,
      fromStoreId: object?.fromStoreId,
      toStoreId: object?.toStoreId,
      status: object?.status,
      excludeCancel: object?.excludeCancel,
      isProcessed: object?.isProcessed,
      approvalStatus: object?.approvalStatus,
      sort: [sortBy, sortOrder],
      // pageNumber: pageNumber,
      // rowPerPage: rowPerPage,
      searchString,
      accessors
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDataByRequestNo = createAsyncThunk('getDataByRequestNo', async (queryParams, { rejectWithValue }) => {
  const response = await request('/request-list', { method: 'GET', query: { referenceDocumentNumber: queryParams } });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
