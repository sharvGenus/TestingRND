import { createSlice } from '@reduxjs/toolkit';
import { getDropdownFirmLocations, getFirmLocation } from '../actions/firmLocationMasterAction';

export const firmLocations = createSlice({
  name: 'firmsLocation',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFirmLocation.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFirmLocation.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.firmLocationsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFirmLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const firmLocationsDropdown = createSlice({
  name: 'firmlocationsDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownFirmLocations.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownFirmLocations.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.firmLocationsDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownFirmLocations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
