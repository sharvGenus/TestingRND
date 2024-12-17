import { createSlice } from '@reduxjs/toolkit';
import {
  getRural,
  getRuralHistory,
  getRuralLevelEntryHistory,
  getRuralLevelParents,
  getRuralLevelProjects,
  getRuralProjects
} from 'store/actions';

export const rural = createSlice({
  name: 'rural',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRural.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRural.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRural.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ruralProjects = createSlice({
  name: 'ruralProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRuralProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRuralProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRuralProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ruralLevelProjects = createSlice({
  name: 'ruralLevelProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRuralLevelProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRuralLevelProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralLevelProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRuralLevelProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ruralLevelParents = createSlice({
  name: 'ruralLevelParents',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRuralLevelParents.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRuralLevelParents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralLevelParentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRuralLevelParents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ruralHistory = createSlice({
  name: 'ruralHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRuralHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRuralHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRuralHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const ruralLevelEntryHistory = createSlice({
  name: 'ruralLevelEntryHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRuralLevelEntryHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRuralLevelEntryHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ruralLevelEntryHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRuralLevelEntryHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
