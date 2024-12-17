import { createSlice } from '@reduxjs/toolkit';
import {
  getFirmStoreLocations,
  getCompanyStoreLocations,
  getOrganizationStoreLocationsHistory
} from 'store/actions/organizationStoreLocationActions';

export const firmStoreLocations = createSlice({
  name: 'firmStoreLocations',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFirmStoreLocations.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getFirmStoreLocations.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.firmStoreLocationsObject = payload.data;
      })
      .addCase(getFirmStoreLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const companyStoreLocations = createSlice({
  name: 'companyStoreLocations',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyStoreLocations.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getCompanyStoreLocations.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.companyStoreLocationsObject = payload.data;
      })
      .addCase(getCompanyStoreLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const organizationStoreLocationsHistory = createSlice({
  name: 'organizationStoreLocationsHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationStoreLocationsHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationStoreLocationsHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreLocationsHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationStoreLocationsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
