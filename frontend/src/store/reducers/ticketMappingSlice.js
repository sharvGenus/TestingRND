import { createSlice } from '@reduxjs/toolkit';
import { getFormWiseTicketMapping, getProjectWiseTicketMapping } from 'store/actions';

export const formWiseTicketMapping = createSlice({
  name: 'formWiseTicketMapping',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormWiseTicketMapping.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getFormWiseTicketMapping.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.formWiseTicketMappingObject = payload.data;
      state.error = '';
    });
    builder.addCase(getFormWiseTicketMapping.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectWiseTicketMapping = createSlice({
  name: 'projectWiseTicketMapping',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectWiseTicketMapping.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectWiseTicketMapping.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectWiseTicketMappingObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectWiseTicketMapping.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
