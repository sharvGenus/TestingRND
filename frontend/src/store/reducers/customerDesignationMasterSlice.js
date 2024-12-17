import { createSlice } from '@reduxjs/toolkit';
import {
  getCustomerDesignationHistory,
  getCustomerDesignations,
  getDepartmentWiseCustomerDesignations
} from '../actions/customerDesignationMasterAction';

export const customerDesignations = createSlice({
  name: 'customerDesignations',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerDesignations.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerDesignations.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDesignationsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerDesignations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const customerDesignationHistory = createSlice({
  name: 'customerDesignationHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerDesignationHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerDesignationHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDesignationHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerDesignationHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const departmentWiseCustomerDesignations = createSlice({
  name: 'departmentWiseCustomerDesignations',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDepartmentWiseCustomerDesignations.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDepartmentWiseCustomerDesignations.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.departmentWiseCustomerDesignationsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDepartmentWiseCustomerDesignations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
