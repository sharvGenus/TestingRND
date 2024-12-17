import { createSlice } from '@reduxjs/toolkit';
import { getCities, getCitiesHistory, getCurrentDropdownCities, getDropdownCities } from '../actions/cityMasterAction';

export const cities = createSlice({
  name: 'cities',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCities.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCities.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.citiesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const citiesDropdown = createSlice({
  name: 'citiesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownCities.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownCities.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.citiesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownCities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const currentCitiesDropdown = createSlice({
  name: 'currentCitiesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentDropdownCities.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCurrentDropdownCities.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.currentCitiesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCurrentDropdownCities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const citiesHistory = createSlice({
  name: 'citiesHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCitiesHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCitiesHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.citiesHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCitiesHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
