import { createSlice } from '@reduxjs/toolkit';
import { getFirms, getDropdownFirms } from '../actions/firmMasterAction';

export const firms = createSlice({
  name: 'firms',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFirms.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFirms.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.firmsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFirms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const firmsDropdown = createSlice({
  name: 'firmsDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownFirms.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownFirms.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.firmsDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownFirms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
