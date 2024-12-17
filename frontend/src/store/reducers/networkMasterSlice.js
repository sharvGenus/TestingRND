import { createSlice } from '@reduxjs/toolkit';
import {
  getNetworkHistory,
  getNetworkLevelEntryHistory,
  getNetworkLevelProjects,
  getNetworkLevelParents,
  getNetworkProjects,
  getNetworks
} from '../actions/networkMasterAction';

export const networks = createSlice({
  name: 'networks',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworks.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworks.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const networkProjects = createSlice({
  name: 'networkProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworkProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworkProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networkProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworkProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const networkLevelProjects = createSlice({
  name: 'networkLevelProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworkLevelProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworkLevelProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networkLevelProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworkLevelProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const networkLevelParents = createSlice({
  name: 'networkLevelParents',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworkLevelParents.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworkLevelParents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networkLevelParentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworkLevelParents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const networkHistory = createSlice({
  name: 'networkHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworkHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworkHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networkHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworkHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const networkLevelEntryHistory = createSlice({
  name: 'networkLevelEntryHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNetworkLevelEntryHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getNetworkLevelEntryHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.networkLevelEntryHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getNetworkLevelEntryHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
