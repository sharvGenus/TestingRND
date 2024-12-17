import { createSlice } from '@reduxjs/toolkit';
import { getQAMasterMakerLov, getQAMasterMakerLovHistory } from '../actions/qaMasterMakerLovAction';

export const qaMasterMakerLov = createSlice({
  name: 'qaMasterMakerLov',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQAMasterMakerLov.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerLov.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.qaMasterMakerLovsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerLov.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const qaMasterMakerLovHistory = createSlice({
  name: 'qaMasterMakerLovHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQAMasterMakerLovHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerLovHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.qaMasterMakerLovHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerLovHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
