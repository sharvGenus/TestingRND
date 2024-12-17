import { createSlice } from '@reduxjs/toolkit';
import { fetchStockLedgerDetailList, fetchTransactionDetails } from '../actions/transactionReceiptAction';

export const transactionReceipt = createSlice({
  name: 'transactionReceipt',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactionDetails.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(fetchTransactionDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.transactionDetails = payload.data;
      state.error = '';
    });
    builder.addCase(fetchTransactionDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stockLedgerDetailList = createSlice({
  name: 'stockLedgerDetailList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStockLedgerDetailList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(fetchStockLedgerDetailList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stockLedgerDetailListObject = payload.data;
      state.error = '';
    });
    builder.addCase(fetchStockLedgerDetailList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
