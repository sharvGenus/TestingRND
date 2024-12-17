import { createSlice } from '@reduxjs/toolkit';
import { getMaterialQuantity, getMaterialQuantityByProjectAndMaterial } from 'store/actions';

export const materialQuantities = createSlice({
  name: 'materialQuantities',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialQuantity.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialQuantity.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialQuantitiesObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialQuantitiesByCondition = createSlice({
  name: 'materialQuantitiesByCondition',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialQuantityByProjectAndMaterial.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialQuantityByProjectAndMaterial.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialQuantitiesByConditionObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialQuantityByProjectAndMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
