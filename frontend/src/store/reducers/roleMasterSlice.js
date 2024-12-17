import { createSlice } from '@reduxjs/toolkit';
import { getRoleProjects, getRoles, getRolesHistory } from '../actions/roleMasterAction';

export const roles = createSlice({
  name: 'roles',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoles.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRoles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rolesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const roleProjects = createSlice({
  name: 'roleProjects',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoleProjects.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRoleProjects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.roleProjectsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRoleProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const rolesHistory = createSlice({
  name: 'rolesHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRolesHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getRolesHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rolesHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getRolesHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
