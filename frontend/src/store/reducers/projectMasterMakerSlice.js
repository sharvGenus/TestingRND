import { createSlice } from '@reduxjs/toolkit';
import { getMasterMakerProjects, getProjectMasterMaker, getProjectMasterMakerHistory } from '../actions/projectMasterMakerAction';

export const projectMasterMaker = createSlice({
  name: 'projectMasterMaker',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectMasterMaker.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectMasterMaker.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectMasterMakerObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectMasterMaker.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const masterMakerProjects = createSlice({
  name: 'masterMakerProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectMasterMakerHistory = createSlice({
  name: 'projectMasterMakerHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectMasterMakerHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectMasterMakerHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectMasterMakerHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
