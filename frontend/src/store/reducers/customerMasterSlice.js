import { createSlice } from '@reduxjs/toolkit';
import { getCustomers, getDropdownCustomers } from '../actions/customerMasterAction';

export const customers = createSlice({
  name: 'customers',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customersObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const customersDropdown = createSlice({
  name: 'customersDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownCustomers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownCustomers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customersDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
