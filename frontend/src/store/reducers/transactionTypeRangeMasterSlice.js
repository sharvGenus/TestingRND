import { createSlice } from '@reduxjs/toolkit';
import { getTransactionTypeRangeList, getTransactionTypeRangeHistory } from 'store/actions';

export const transactionTypeRange = createSlice({
  name: 'transactionTypeRange',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionTypeRangeList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionTypeRangeList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.transactionTypeRangesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTransactionTypeRangeList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactionTypeRangeHistory = createSlice({
  name: 'transactionTypeRangeHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionTypeRangeHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionTypeRangeHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.transactionTypeRangeHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTransactionTypeRangeHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
