import { createSlice } from '@reduxjs/toolkit';
import { getOrganizationLocationsHistory } from '../actions/organizationLocationsMasterAction';

export const organizationLocationsHistory = createSlice({
  name: 'organizationLocationsHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationLocationsHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationLocationsHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationLocationsHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationLocationsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
