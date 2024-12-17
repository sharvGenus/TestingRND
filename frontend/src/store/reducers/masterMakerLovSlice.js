import { createSlice } from '@reduxjs/toolkit';
import {
  getMasterMakerLov,
  getDropdownMasterMakers,
  getLovsForMasterName,
  getCurrency,
  getGstStatus,
  getPaymentTerm,
  getIncoterms,
  getMasterMakerLovList,
  getTitle,
  getMasterMakerLovHistory,
  getLovsForMasterNameSecond,
  getLovsForMasterNameThird
} from '../actions/masterMakerLovAction';

export const masterMakerLov = createSlice({
  name: 'masterMakerLov',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerLov.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerLov.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerLovsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerLov.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const masterMakerLovList = createSlice({
  name: 'masterMakerLovList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerLovList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerLovList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerLovsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerLovList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const masterMakersDropdown = createSlice({
  name: 'masterMakersDropdown',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDropdownMasterMakers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDropdownMasterMakers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakersDropdownObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDropdownMasterMakers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const lovsForMasterName = createSlice({
  name: 'lovsForMasterName',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLovsForMasterName.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getLovsForMasterName.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.masterObject = payload.data;
        state.error = '';
      })
      .addCase(getLovsForMasterName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const lovsForMasterNameSecond = createSlice({
  name: 'lovsForMasterNameSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLovsForMasterNameSecond.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getLovsForMasterNameSecond.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.masterObject = payload.data;
        state.error = '';
      })
      .addCase(getLovsForMasterNameSecond.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const lovsForMasterNameThird = createSlice({
  name: 'lovsForMasterNameThird',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLovsForMasterNameThird.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getLovsForMasterNameThird.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.masterObject = payload.data;
        state.error = '';
      })
      .addCase(getLovsForMasterNameThird.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const currency = createSlice({
  name: 'currency',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrency.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getCurrency.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currencyObject = payload.data;
        state.error = '';
      })
      .addCase(getCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const gstStatus = createSlice({
  name: 'gstStatus',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGstStatus.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getGstStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.gstStatusObject = payload.data;
        state.error = '';
      })
      .addCase(getGstStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const paymentTerm = createSlice({
  name: 'paymentTerm',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentTerm.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getPaymentTerm.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.paymentTermObject = payload.data;
        state.error = '';
      })
      .addCase(getPaymentTerm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const incoterms = createSlice({
  name: 'incoterms',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncoterms.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getIncoterms.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.incotermsObject = payload.data;
        state.error = '';
      })
      .addCase(getIncoterms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const title = createSlice({
  name: 'title',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTitle.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getTitle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.titleObject = payload.data;
        state.error = '';
      })
      .addCase(getTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}).reducer;

export const masterMakerLovHistory = createSlice({
  name: 'masterMakerLovHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterMakerLovHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMasterMakerLovHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.masterMakerLovHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMasterMakerLovHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
