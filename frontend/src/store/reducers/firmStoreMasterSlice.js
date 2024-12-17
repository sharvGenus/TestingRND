import { createSlice } from '@reduxjs/toolkit';
import { getFirmsStore } from '../actions/firmStoreMasterAction';

export default createSlice({
  name: 'firmsStore',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFirmsStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFirmsStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.firmsStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFirmsStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
