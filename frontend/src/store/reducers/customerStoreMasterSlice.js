import { createSlice } from '@reduxjs/toolkit';
import { getCustomerStore } from '../../store/actions/customerStoreMasterAction';

export default createSlice({
  name: 'customerStore',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerStore.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCustomerStore.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCustomerStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
