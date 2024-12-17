import { createSlice } from '@reduxjs/toolkit';
import { getSupplier, getDropdownSupplier } from '../actions/supplierMasterAction';

export const supplier = createSlice({
  name: 'supplier',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupplier.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupplier.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supplierObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupplier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const supplierDropdown = createSlice({
  name: 'supplierDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownSupplier.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownSupplier.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supplierDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownSupplier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
