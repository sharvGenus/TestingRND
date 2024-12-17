import { createSlice } from '@reduxjs/toolkit';
import {
  getCustomerDepartments,
  getCustomerDepartmentsDropdown,
  getCustomerDepartmentsHistory,
  getCustomerWiseCustomerDepartments
} from '../actions/customerDepartmentMasterAction';

export const customerDepartments = createSlice({
  name: 'customerDepartments',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerDepartments.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerDepartments.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDepartmentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const customerDepartmentsDropdown = createSlice({
  name: 'customerDepartmentsDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerDepartmentsDropdown.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerDepartmentsDropdown.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDepartmentsDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerDepartmentsDropdown.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const customerDepartmentsHistory = createSlice({
  name: 'customerDepartmentsHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerDepartmentsHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerDepartmentsHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDepartmentsHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerDepartmentsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const customerWiseCustomerDepartments = createSlice({
  name: 'customerWiseCustomerDepartments',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerWiseCustomerDepartments.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerWiseCustomerDepartments.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerWiseCustomerDepartmentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerWiseCustomerDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
