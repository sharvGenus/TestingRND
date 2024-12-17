import { createSlice } from '@reduxjs/toolkit';
import { getCompanies, getDropdownCompanies } from '../actions/companyMasterAction';

export const companies = createSlice({
  name: 'companies',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCompanies.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companiesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCompanies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const companiesDropdown = createSlice({
  name: 'companiesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownCompanies.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownCompanies.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companiesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownCompanies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
