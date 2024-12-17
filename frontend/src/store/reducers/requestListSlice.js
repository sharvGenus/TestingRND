import { createSlice } from '@reduxjs/toolkit';
import { fetchRequestDetails, getDataByRequestNo } from '../actions/requestListAction';

export const requestList = createSlice({
  name: 'requestList',
  initialState: {
    requestDetails: null,
    loading: false,
    error: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestDetails.pending, (state) => {
        Object.assign(state, { loading: true, error: '' });
      })
      .addCase(fetchRequestDetails.fulfilled, (state, { payload }) => {
        Object.assign(state, { requestDetails: payload.data, loading: false, error: '' });
      })
      .addCase(fetchRequestDetails.rejected, (state, { payload }) => {
        Object.assign(state, { error: payload, loading: false });
      });
  }
}).reducer;

export const requestedData = createSlice({
  name: 'requestedData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDataByRequestNo.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDataByRequestNo.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.requestedDataObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDataByRequestNo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
