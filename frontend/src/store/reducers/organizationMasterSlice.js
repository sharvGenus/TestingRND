import { createSlice } from '@reduxjs/toolkit';
import {
  getOrganizations,
  getDropdownOrganization,
  getDropdownOrganizationSecond,
  getOrganizationList,
  getOrganizationListSecond,
  getOrganizationsListData,
  getOrganizationsHistory,
  getOrganizationsLocation,
  getDropdownOrganizationLocation,
  getOrganizationsLocationByParent,
  getDropdownOrganizationLocationSecond,
  getOrganizationsLocationByParentSecond,
  getOrganizationListDataSecond,
  getOrganizationListData
} from '../actions/organizationMasterAction';

export const organization = createSlice({
  name: 'organization',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizations.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizations.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationAllData = createSlice({
  name: 'organizationAllData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationListData.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationListData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationListData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationAllDataSecond = createSlice({
  name: 'organizationAllDataSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationListDataSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationListDataSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationListDataSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationLocationByParent = createSlice({
  name: 'organizationLocationByParent',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationsLocationByParent.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocationByParent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocationByParent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationLocationByParentSecond = createSlice({
  name: 'organizationLocationByParentSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationsLocationByParentSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocationByParentSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocationByParentSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationLocation = createSlice({
  name: 'organizationLocation',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationsLocation.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocation.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationLocationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationsLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationListData = createSlice({
  name: 'organizationListData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationsListData.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationsListData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationGetListObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationsListData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationDropdown = createSlice({
  name: 'organizationDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganization.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganization.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganization.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationLocationDropdown = createSlice({
  name: 'organizationLocationDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganizationLocation.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationLocation.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationLocationDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationLocationDropdownSecond = createSlice({
  name: 'organizationLocationDropdownSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganizationLocationSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationLocationSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationLocationDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationLocationSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationDropdownSecond = createSlice({
  name: 'organizationDropdownSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownOrganizationSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationDropdownSecondObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownOrganizationSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationList = createSlice({
  name: 'organizationList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationListSecond = createSlice({
  name: 'organizationListSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationListSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationListSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationListSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const organizationHistory = createSlice({
  name: 'organizationHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganizationsHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getOrganizationsHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.organizationHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getOrganizationsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
