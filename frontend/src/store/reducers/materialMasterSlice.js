import { createSlice } from '@reduxjs/toolkit';
import {
  getMaterial,
  getDropdownMaterial,
  getDropdownUom,
  getDropdownMaterialType,
  getMaterialByIntegrationId,
  getMaterialHistory
} from '../actions/materialMasterAction';

export const material = createSlice({
  name: 'material',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterial.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterial.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialByIntegrationId = createSlice({
  name: 'materialByIntegrationId',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialByIntegrationId.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialByIntegrationId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialByIntegrationId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialDropdown = createSlice({
  name: 'materialDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownMaterial.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownMaterial.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const uomDropdown = createSlice({
  name: 'uomDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownUom.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownUom.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.uomDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownUom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialTypeDropdown = createSlice({
  name: 'materialTypeDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownMaterialType.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownMaterialType.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialTypeDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownMaterialType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialHistory = createSlice({
  name: 'materialHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
