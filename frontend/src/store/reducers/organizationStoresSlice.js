import { createSlice } from '@reduxjs/toolkit';
import {
  getDropdownOrganizationStores,
  getDropdownOrganizationStoresSecond,
  getOrgStoreDropdown,
  getOrganizationStores,
  getOrganizationStoresAllAccess,
  getOrganizationStoresHistory,
  getOrganizationStoresSecond,
  getOrgViewStoreDropdown
} from 'store/actions/organizationStoresAction';

export const organizationStores = createSlice({
  name: 'organizationStores',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationStores.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationStores.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationStores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationStoresAllAccess = createSlice({
  name: 'organizationStoresAllAccess',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationStoresAllAccess.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresAllAccess.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresAllAccess.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationStoresSecond = createSlice({
  name: 'organizationStoresSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationStoresSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationStoreDropdown = createSlice({
  name: 'organizationStoreDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganizationStores.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationStores.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationStores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationStoreDropdownSecond = createSlice({
  name: 'organizationStoreDropdownSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganizationStoresSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationStoresSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoreDropdownSecondObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationStoresSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const orgStoreDropDown = createSlice({
  name: 'orgStoreDropDown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrgStoreDropdown.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrgStoreDropdown.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orgStoreDropDownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrgStoreDropdown.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const orgViewStoreDropDown = createSlice({
  name: 'orgViewStoreDropDown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrgViewStoreDropdown.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrgViewStoreDropdown.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orgViewStoreDropDownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrgViewStoreDropdown.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationStoresHistory = createSlice({
  name: 'organizationStoresHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationStoresHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationStoresHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationStoresHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
