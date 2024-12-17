import { createSlice } from '@reduxjs/toolkit';
import {
  getUrbanHistory,
  getUrbanLevelEntryHistory,
  getUrbanLevelParents,
  getUrbanLevelProjects,
  getUrbanProjects,
  getUrbans
} from 'store/actions';

export const urbans = createSlice({
  name: 'urbans',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbans.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbans.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbansObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const urbanProjects = createSlice({
  name: 'urbanProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbanProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbanProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbanProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbanProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const urbanLevelProjects = createSlice({
  name: 'urbanLevelProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbanLevelProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbanLevelProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbanLevelProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbanLevelProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const urbanLevelParents = createSlice({
  name: 'urbanLevelParents',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbanLevelParents.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbanLevelParents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbanLevelParentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbanLevelParents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const urbanHistory = createSlice({
  name: 'urbanHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbanHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbanHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbanHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbanHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const urbanLevelEntryHistory = createSlice({
  name: 'urbanLevelEntryHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUrbanLevelEntryHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUrbanLevelEntryHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.urbanLevelEntryHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUrbanLevelEntryHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
