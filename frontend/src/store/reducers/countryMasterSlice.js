import { createSlice } from '@reduxjs/toolkit';
import { getCountries, getCountriesHistory, getDropdownCountries } from '../actions/countryMasterAction';

export const countries = createSlice({
  name: 'countries',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCountries.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCountries.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.countriesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCountries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const countriesDropdown = createSlice({
  name: 'countriesDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownCountries.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownCountries.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.countriesDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownCountries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const countriesHistory = createSlice({
  name: 'countriesHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCountriesHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getCountriesHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.countriesHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getCountriesHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
