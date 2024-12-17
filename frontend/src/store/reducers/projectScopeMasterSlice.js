import { createSlice } from '@reduxjs/toolkit';
import {
  getProjectScope,
  getProjectScopeExtension,
  getProjectScopeExtensionHistory,
  getProjectScopeHistory,
  getProjectScopeSat,
  getProjectScopeSatHistory,
  getProjectAllScope,
  getProjectScopeAllExtension,
  getProjectScopeExtensionAllHistory,
  getProjectScopeAllHistory,
  getProjectScopeAllSat,
  getProjectScopeSatAllHistory
} from 'store/actions/projectScopeMasterAction';

export const projectScope = createSlice({
  name: 'projectScope',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScope.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScope.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScope.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeHistory = createSlice({
  name: 'projectScopeHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeExtension = createSlice({
  name: 'projectScopeExtension',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeExtension.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtension.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeExtensionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtension.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeExtensionHistory = createSlice({
  name: 'projectScopeExtensionHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeExtensionHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtensionHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeExtensionHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtensionHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeSat = createSlice({
  name: 'projectScopeSat',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeSat.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeSat.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeSatObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeSat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeSatHistory = createSlice({
  name: 'projectScopeSatHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeSatHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeSatHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeSatHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeSatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

// ---------------------------------------------------------------

export const projectAllScope = createSlice({
  name: 'projectAllScope',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectAllScope.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectAllScope.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectAllScope.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeAllHistory = createSlice({
  name: 'projectScopeAllHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeAllHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeAllExtension = createSlice({
  name: 'projectScopeAllExtension',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeAllExtension.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllExtension.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeExtensionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllExtension.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeExtensionAllHistory = createSlice({
  name: 'projectScopeExtensionAllHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeExtensionAllHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtensionAllHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeExtensionHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeExtensionAllHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeAllSat = createSlice({
  name: 'projectScopeAllSat',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeAllSat.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllSat.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeSatObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeAllSat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectScopeSatAllHistory = createSlice({
  name: 'projectScopeSatAllHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectScopeSatAllHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectScopeSatAllHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectScopeSatHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectScopeSatAllHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
