import { createSlice } from '@reduxjs/toolkit';
import { getCurrentDropdownStates, getStates, getStatesHistory } from '../actions/stateMasterAction';
import { getDropdownStates } from '../actions/stateMasterAction';

export const states = createSlice({
  name: 'states',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStates.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.statesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
export const statesDropdown = createSlice({
  name: 'statesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownStates.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownStates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.statesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownStates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
export const currentStatesDropdown = createSlice({
  name: 'currentStatesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentDropdownStates.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCurrentDropdownStates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentStatesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCurrentDropdownStates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const statesHistory = createSlice({
  name: 'statesHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatesHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStatesHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.statesHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStatesHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
