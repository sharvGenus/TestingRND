import { createAsyncThunk } from '@reduxjs/toolkit';
import { PAGINATION_CONST } from '../../constants';
import request from '../../utils/request';

export const getSmtp = createAsyncThunk('getSmtp', async (object, { rejectWithValue }) => {
  const pageNumber = object && object.pageIndex ? object.pageIndex : PAGINATION_CONST.pageIndex;
  const rowPerPage = object && object.pageSize ? object.pageSize : PAGINATION_CONST.pageSize;
  const sortBy = object && object.sortBy ? object.sortBy : PAGINATION_CONST.sortBy;
  const sortOrder = object && object.sortOrder ? object.sortOrder : PAGINATION_CONST.sortOrder;
  const listType = object && object.listType === 1 ? null : object.listType;
  const searchString = object && object.searchString;
  const accessors = object && object.accessors;
  const response = await request('/smtp-configuration-list', {
    method: 'GET',
    query: object.all ? {} : { sort: [sortBy, sortOrder], pageNumber, rowPerPage, listType, searchString, accessors }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
