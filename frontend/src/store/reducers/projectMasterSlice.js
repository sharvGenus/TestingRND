import { createSlice } from '@reduxjs/toolkit';
import {
  getProjects,
  getDropdownProjects,
  getProjectsHistory,
  getProjectsForRoleOrUser,
  getDropdownAllProjects,
  getProjectDetails
} from '../actions/projectMasterAction';

export const projects = createSlice({
  name: 'projects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectDetails = createSlice({
  name: 'projectDetails',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectDetails.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectDetailsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectsDropdown = createSlice({
  name: 'projectsDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectsDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const allProjectsDropdown = createSlice({
  name: 'allProjectsDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownAllProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownAllProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectsDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownAllProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectsForRoleOrUser = createSlice({
  name: 'projectsForRoleOrUser',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectsForRoleOrUser.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectsForRoleOrUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectsForRoleOrUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectsHistory = createSlice({
  name: 'projectsHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectsHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectsHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectsHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
