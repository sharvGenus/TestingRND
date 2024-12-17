import { createSlice } from '@reduxjs/toolkit';
import { getFormProjectWise, getFormResponses, getFormWithRoles, getFormWithUsers, getSecondFormResponses } from 'store/actions';

export const formResponsesSlice = createSlice({
  name: 'formResponses',
  initialState: {
    formResponseObject: [],
    error: '',
    loading: false
  },
  reducers: {
    reset() {
      return {
        formResponseObject: [],
        error: '',
        loading: false
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFormResponses.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getFormResponses.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, formResponseObject: payload.data, error: '' });
    });
    builder.addCase(getFormResponses.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
});
export const formResponses = formResponsesSlice.reducer;

export const secondFormResponses = createSlice({
  name: 'secondFormResponses',
  initialState: {
    formResponseObject: [],
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSecondFormResponses.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getSecondFormResponses.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, formResponseObject: payload.data, error: '' });
    });
    builder.addCase(getSecondFormResponses.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload });
    });
  }
}).reducer;

export const formsProjectWise = createSlice({
  name: 'formsProjectWise',
  initialState: {
    formsObject: [],
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormProjectWise.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getFormProjectWise.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, formsObject: payload.data, error: '' });
    });
    builder.addCase(getFormProjectWise.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload, formsObject: [] });
    });
  }
}).reducer;

export const formsWithRoles = createSlice({
  name: 'formsWithRoles',
  initialState: {
    formsObject: [],
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormWithRoles.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getFormWithRoles.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, formsObject: payload.data, error: '' });
    });
    builder.addCase(getFormWithRoles.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload, formsObject: [] });
    });
  }
}).reducer;

export const formsWithUsers = createSlice({
  name: 'formsWithUsers',
  initialState: {
    formsObject: [],
    error: '',
    loading: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormWithUsers.pending, (state) => {
      Object.assign(state, { loading: true, error: '' });
    });
    builder.addCase(getFormWithUsers.fulfilled, (state, { payload }) => {
      Object.assign(state, { loading: false, formsObject: payload.data, error: '' });
    });
    builder.addCase(getFormWithUsers.rejected, (state, action) => {
      Object.assign(state, { loading: false, error: action.payload, formsObject: [] });
    });
  }
}).reducer;
