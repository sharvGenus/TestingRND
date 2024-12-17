import { createSlice } from '@reduxjs/toolkit';
import { getGaaNetworkAreaAllocation } from 'store/actions';

export const gaaNetworkAreaAllocation = createSlice({
  name: 'gaaNetworkAreaAllocation',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGaaNetworkAreaAllocation.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGaaNetworkAreaAllocation.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaNetworkAreaAllocationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGaaNetworkAreaAllocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
