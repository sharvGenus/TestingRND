import { createSlice } from '@reduxjs/toolkit';
import { getMasterMakerQAs, getQAMasterMakerHistory } from '../actions/qaMasterMakerAction';

export const qaMasterMaker = createSlice({
  name: 'qaMasterMaker',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerQAs.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerQAs.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.qaMasterMakerObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerQAs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const qaMasterMakerHistory = createSlice({
  name: 'qaMasterMakerHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQAMasterMakerHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.qaMasterMakerHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getQAMasterMakerHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
