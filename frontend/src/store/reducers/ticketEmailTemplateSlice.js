import { createSlice } from '@reduxjs/toolkit';
import { getTicketEmailTemplates } from 'store/actions';

export const ticketEmailTemplates = createSlice({
  name: 'ticketEmailTemplates',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTicketEmailTemplates.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTicketEmailTemplates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ticketEmailTemplates = payload.data;
      state.error = '';
    });
    builder.addCase(getTicketEmailTemplates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
