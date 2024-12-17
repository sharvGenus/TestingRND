import { createSlice } from '@reduxjs/toolkit';
import { plantCodeList, purchaseOrderList } from 'store/actions';

export const plantCodeData = createSlice({
  name: 'plantCodeData',
  initialState: {
    plantCodeDetails: null,
    loading: false,
    error: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(plantCodeList.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(plantCodeList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.plantCodeDetails = payload.data;
        state.error = '';
      })
      .addCase(plantCodeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const purchaseOrderData = createSlice({
  name: 'purchaseOrderData',
  initialState: {
    purchaseOrderDetails: null,
    loading: false,
    error: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(purchaseOrderList.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(purchaseOrderList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.purchaseOrderDetails = payload.poData;
        state.error = '';
      })
      .addCase(purchaseOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;
