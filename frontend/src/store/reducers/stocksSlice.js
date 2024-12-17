import { createSlice } from '@reduxjs/toolkit';
import {
  getSerialNumbers,
  getStocks,
  getTransactions,
  getDataBySTONo,
  getDetailsByRefNo,
  getDetailsByRefNoSecond,
  getDetailsByRefNoThird,
  getStoreLocationsTransactions,
  getTransactionsSecond,
  getAllSerialNumbers,
  getSerialNumbersSecond,
  getTransactionsQty,
  getTransactionsSecondQty,
  getStoreLocationsStock,
  getStocksByDate,
  getStocksByDateForExport,
  getTransactionMaterialList,
  getTxnByMaterial,
  getTxnByLocationMaterial,
  getStoreStockReport,
  getStockLedgerMaterialList
} from 'store/actions';

export const stocks = createSlice({
  name: 'stocks',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStocks.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStocks.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStocks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactions = createSlice({
  name: 'transactions',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allTransactionData;
      state.error = '';
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactionsSecond = createSlice({
  name: 'transactionsSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionsSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionsSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allTransactionData;
      state.error = '';
    });
    builder.addCase(getTransactionsSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactionsQty = createSlice({
  name: 'transactionsQty',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionsQty.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionsQty.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.quantityInStore;
      state.error = '';
    });
    builder.addCase(getTransactionsQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactionsSecondQty = createSlice({
  name: 'transactionsSecondQty',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionsSecondQty.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionsSecondQty.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.quantityInStore;
      state.error = '';
    });
    builder.addCase(getTransactionsSecondQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const serialNumbers = createSlice({
  name: 'serialNumbers',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSerialNumbers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSerialNumbers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload?.serialNumbersByMaterial;
      state.error = '';
    });
    builder.addCase(getSerialNumbers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const serialNumbersSecond = createSlice({
  name: 'serialNumbersSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSerialNumbersSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSerialNumbersSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload?.serialNumbersByMaterial;
      state.error = '';
    });
    builder.addCase(getSerialNumbersSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const allSerialNumbers = createSlice({
  name: 'allSerialNumbers',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSerialNumbers.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllSerialNumbers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload?.data;
      state.error = '';
    });
    builder.addCase(getAllSerialNumbers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stoData = createSlice({
  name: 'stoData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDataBySTONo.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDataBySTONo.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stoDataObject = payload?.data;
      state.error = '';
    });
    builder.addCase(getDataBySTONo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const refData = createSlice({
  name: 'refData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDetailsByRefNo.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNo.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.refDataObject = payload?.data;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const refDataSecond = createSlice({
  name: 'refDataSecond',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDetailsByRefNoSecond.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNoSecond.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.refDataSecondObject = payload?.data;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNoSecond.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const refDataThird = createSlice({
  name: 'refDataThird',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDetailsByRefNoThird.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNoThird.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.refDataThirdObject = payload?.data;
      state.error = '';
    });
    builder.addCase(getDetailsByRefNoThird.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const storeLocationsTransactions = createSlice({
  name: 'storeLocationsTransactions',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreLocationsTransactions.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStoreLocationsTransactions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allStoreLocationTransactionData;
      state.error = '';
    });
    builder.addCase(getStoreLocationsTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const storeLocationsStock = createSlice({
  name: 'storeLocationsStock',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreLocationsStock.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStoreLocationsStock.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allStoreLocationsStock = payload?.allStoreLocationsStock;
      state.error = '';
    });
    builder.addCase(getStoreLocationsStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stocksByDate = createSlice({
  name: 'stocksByDate',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStocksByDate.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStocksByDate.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStocksByDate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stocksByDateForExport = createSlice({
  name: 'stocksByDateForExport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStocksByDateForExport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStocksByDateForExport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStocksByDateForExport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const transactionMaterialList = createSlice({
  name: 'transactionMaterialList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionMaterialList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTransactionMaterialList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getTransactionMaterialList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const txnByMaterial = createSlice({
  name: 'txnByMaterial',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTxnByMaterial.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTxnByMaterial.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allTransactionData;
      state.error = '';
    });
    builder.addCase(getTxnByMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const txnByLocationMaterial = createSlice({
  name: 'txnByLocationMaterial',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTxnByLocationMaterial.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getTxnByLocationMaterial.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allStoreLocationTransactionData;
      state.error = '';
    });
    builder.addCase(getTxnByLocationMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const storeStockReport = createSlice({
  name: 'storeStockReport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreStockReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStoreStockReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allStoreLocationTransactionData;
      state.error = '';
    });
    builder.addCase(getStoreStockReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stockLedgerMaterialList = createSlice({
  name: 'stockLedgerMaterialList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStockLedgerMaterialList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStockLedgerMaterialList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.allTransactionData;
      state.error = '';
    });
    builder.addCase(getStockLedgerMaterialList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
