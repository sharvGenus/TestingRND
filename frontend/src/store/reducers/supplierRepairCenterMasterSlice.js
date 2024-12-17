import { createSlice } from '@reduxjs/toolkit';
import { getSupplierRepairCenter } from 'store/actions';

export default createSlice({
  name: 'supplierRepairCenter',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupplierRepairCenter.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupplierRepairCenter.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supplierCenterObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupplierRepairCenter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
