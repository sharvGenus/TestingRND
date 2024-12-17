import { createSlice } from '@reduxjs/toolkit';
import { getMin } from '../actions/minAction';

export const min = createSlice({
  name: 'min',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMin.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.minObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
