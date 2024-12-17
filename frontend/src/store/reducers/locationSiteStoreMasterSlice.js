import { createSlice } from '@reduxjs/toolkit';
import { getDropdownLocationSiteStore, getLocationSiteStore } from '../actions/locationSiteStoreMasterAction';

export const locationSiteStore = createSlice({
  name: 'locationSiteStore',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLocationSiteStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getLocationSiteStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.locationSiteStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getLocationSiteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const locationSiteStoreDropdown = createSlice({
  name: 'locationSiteStoreDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownLocationSiteStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownLocationSiteStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.locationSiteStoreDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownLocationSiteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
