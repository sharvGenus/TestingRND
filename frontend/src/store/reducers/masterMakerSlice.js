import { createSlice } from '@reduxjs/toolkit';
import { getMasterMaker, getMasterMakerHistory } from '../actions/masterMakerAction';

export const masterMaker = createSlice({
  name: 'masterMaker',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMaker.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMaker.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMaker.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const masterMakerHistory = createSlice({
  name: 'masterMakerHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
