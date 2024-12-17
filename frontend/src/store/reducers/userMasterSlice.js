import { createSlice } from '@reduxjs/toolkit';
import {
  clearUsers,
  getAllSupervisors,
  getUsers,
  getUsersByPermission,
  getUsersHistory,
  getUsersSecond,
  getUsersWithForms
} from '../actions/userMasterAction';

export const users = createSlice({
  name: 'users',
  initialState: {
    usersObject: {},
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, usersObject: payload.data, error: '' });
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
    builder.addCase(clearUsers.fulfilled, (state) => {
      Object.assign(state, { loading: false, error: '', usersObject: undefined });
    });
  }
}).reducer;

export const usersByPermission = createSlice({
  name: 'usersByPermission',
  initialState: {
    usersObject: {},
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersByPermission.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getUsersByPermission.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, usersObject: payload.data, error: '' });
    });
    builder.addCase(getUsersByPermission.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
    builder.addCase(clearUsers.fulfilled, (state) => {
      Object.assign(state, { loading: false, error: '', usersObject: undefined });
    });
  }
}).reducer;

export const usersWithForms = createSlice({
  name: 'usersWithForms',
  initialState: {
    usersWithForms: [],
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersWithForms.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getUsersWithForms.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, usersWithForms: payload.data, error: '' });
    });
    builder.addCase(getUsersWithForms.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;

export const usersSecond = createSlice({
  name: 'usersSecond',
  initialState: {
    usersObject: {},
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersSecond.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getUsersSecond.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, usersObject: payload.data, error: '' });
    });
    builder.addCase(getUsersSecond.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;

export const usersHistory = createSlice({
  name: 'usersHistory',
  initialState: {
    usersHistoryObject: {},
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersHistory.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getUsersHistory.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, usersHistoryObject: payload.data, error: '' });
    });
    builder.addCase(getUsersHistory.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;

export const supervisorUsers = createSlice({
  name: 'supervisorUsers',
  initialState: {
    supervisorUsersObject: {},
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSupervisors.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getAllSupervisors.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, supervisorUsersObject: payload.data, error: '' });
    });
    builder.addCase(getAllSupervisors.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;
