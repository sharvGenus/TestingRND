import { createSlice } from '@reduxjs/toolkit';
import { getSupervisorTicket } from 'store/actions';

export const supervisorTickets = createSlice({
  name: 'supervisorTickets',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupervisorTicket.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupervisorTicket.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supervisorTicketObj = payload.data;
      state.error = '';
    });
    builder.addCase(getSupervisorTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
