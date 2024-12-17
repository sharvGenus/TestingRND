import { createSlice } from '@reduxjs/toolkit';
import { getDropdownProjectSiteStore, getProjectSiteStore } from '../actions/projectSiteStoreMasterAction';

export const projectSiteStore = createSlice({
  name: 'projectSiteStore',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectSiteStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectSiteStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectSiteStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectSiteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectSiteStoreDropdown = createSlice({
  name: 'projectSiteStoreDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownProjectSiteStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownProjectSiteStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectSiteStoreDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownProjectSiteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
