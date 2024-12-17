import { PAGINATION_CONST } from 'constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../utils/request';

export const fetchTransactionDetails = createAsyncThunk('transaction-details', async (transactionId, { rejectWithValue }) => {
  const response = await request(`/transaction-details`, { method: 'GET', params: transactionId });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const fetchStockLedgerDetailList = createAsyncThunk('fetchStockLedgerDetailList', async (object, { rejectWithValue }) => {
  const pageNumber = object && object.pageIndex ? object.pageIndex : PAGINATION_CONST.pageIndex;
  const rowPerPage = object && object.pageSize ? object.pageSize : PAGINATION_CONST.pageSize;
  const sortBy = object && object.sortBy ? object.sortBy : PAGINATION_CONST.sortBy;
  const sortOrder = object && object.sortOrder ? object.sortOrder : PAGINATION_CONST.sortOrder;
  const searchString = object && object.searchString;
  const accessors = object && object.accessors;

  const response = await request('/stock-ledger-detail-list', {
    method: 'GET',
    query: {
      transactionTypeId: object?.transactionTypeId,
      referenceDocumentNumber: object?.referenceDocumentNumber,
      sort: [sortBy, sortOrder],
      pageNumber: pageNumber,
      rowPerPage: rowPerPage,
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
