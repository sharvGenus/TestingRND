import { createSlice } from '@reduxjs/toolkit';
import { getProjectMasterMakerLov, getMasterMakersLovsList, getProjectMasterMakerLovHistory } from '../actions/projectMasterMakerLovAction';

export const projectMasterMakerLov = createSlice({
  name: 'projectMasterMakerLov',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectMasterMakerLov.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerLov.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectMasterMakerLovsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerLov.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const masterMakersLovsList = createSlice({
  name: 'masterMakersLovsList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakersLovsList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakersLovsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectMasterMakersListObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakersLovsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectMasterMakerLovHistory = createSlice({
  name: 'projectMasterMakerLovHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectMasterMakerLovHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerLovHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectMasterMakerLovHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerLovHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
