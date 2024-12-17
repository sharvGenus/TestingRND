import { createSlice } from '@reduxjs/toolkit';
import { getTicketAgingCount, getTicketByProject, getTicketHistory } from 'store/actions';

export const tickets = createSlice({
  name: 'tickets',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTicketByProject.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTicketByProject.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ticketsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTicketByProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ticketAging = createSlice({
  name: 'ticketAging',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTicketAgingCount.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTicketAgingCount.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ticketAgingObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTicketAgingCount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ticketHistory = createSlice({
  name: 'ticketHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTicketHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTicketHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ticketHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTicketHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
