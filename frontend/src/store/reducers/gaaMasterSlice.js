import { createSlice } from '@reduxjs/toolkit';
import {
  getGAAHistory,
  getGAALevelEntryHistory,
  getGaa,
  getGaaLevelProjects,
  getGaaLevelParents,
  getGaaProjects,
  getProjectAreaLevels
} from '../actions/gaaMasterAction';

export const gaa = createSlice({
  name: 'gaa',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGaa.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGaa.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGaa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const gaaProjects = createSlice({
  name: 'gaaProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGaaProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGaaProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGaaProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const gaaLevelProjects = createSlice({
  name: 'gaaLevelProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGaaLevelProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGaaLevelProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaLevelProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGaaLevelProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const gaaLevelParents = createSlice({
  name: 'gaaLevelParents',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGaaLevelParents.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGaaLevelParents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaLevelParentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGaaLevelParents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectAreaLevels = createSlice({
  name: 'projectAreaLevels',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectAreaLevels.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectAreaLevels.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectAreaLevelsObject = payload.data;
      state.accessRank = payload.accessRank;
      state.error = '';
    });
    builder.addCase(getProjectAreaLevels.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const gaaHistory = createSlice({
  name: 'gaaHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGAAHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGAAHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGAAHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const gaaLevelEntryHistory = createSlice({
  name: 'gaaLevelEntryHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGAALevelEntryHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getGAALevelEntryHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.gaaLevelEntryHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getGAALevelEntryHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
