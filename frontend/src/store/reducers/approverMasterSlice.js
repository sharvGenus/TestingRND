import { createSlice } from '@reduxjs/toolkit';
import { getApprovers, getAllApprovers, getApproversList } from '../actions/approverMasterAction';

export const approvers = createSlice({
  name: 'approvers',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getApprovers.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getApprovers.fulfilled, (state, { payload }) => {
      Object.assign(state, { approversObject: payload.data, loading: false, error: '' });
    });
    builder.addCase(getApprovers.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;

export const getAllApproversList = createSlice({
  name: 'getAllApproversList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllApprovers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllApprovers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.approversListObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAllApprovers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const getAllApproversData = createSlice({
  name: 'getAllApproversData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getApproversList.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getApproversList.fulfilled, (state, { payload }) => {
      Object.assign(state, { approversListObject: payload.data, loading: false, error: '' });
    });
    builder.addCase(getApproversList.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;
