import { createSlice } from '@reduxjs/toolkit';
import { getBillSubmissions, getMaterialDetails } from '../actions/index';

export const billSubmissions = createSlice({
  name: 'billSubmissions',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBillSubmissions.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getBillSubmissions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.billSubmissionsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getBillSubmissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const billMaterialSubmissions = createSlice({
  name: 'billMaterialSubmissions',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialDetails.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.billMaterialSubmissionsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
