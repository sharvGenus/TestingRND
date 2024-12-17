import { createAsyncThunk } from '@reduxjs/toolkit';
import { PAGINATION_CONST } from '../../constants';
import request from '../../utils/request';

export const getSupplierRepairCenter = createAsyncThunk('getSupplierRepairCenter', async (object, { rejectWithValue }) => {
  const pageNumber = object && object.pageIndex ? object.pageIndex : PAGINATION_CONST.pageIndex;
  const rowPerPage = object && object.pageSize ? object.pageSize : PAGINATION_CONST.pageSize;
  const sortBy = object && object.sortBy ? object.sortBy : PAGINATION_CONST.sortBy;
  const sortOrder = object && object.sortOrder ? object.sortOrder : PAGINATION_CONST.sortOrder;
  const response = await request('/supplier-repair-centers-list', {
    method: 'GET',
    query: { sort: [sortBy, sortOrder], pageNumber, rowPerPage }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});