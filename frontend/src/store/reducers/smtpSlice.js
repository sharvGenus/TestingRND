import { createSlice } from '@reduxjs/toolkit';
import { getSmtp } from 'store/actions';

export const smtp = createSlice({
  name: 'smtp',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSmtp.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSmtp.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.smtpObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSmtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
