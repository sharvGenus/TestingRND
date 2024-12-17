import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getStocks = createAsyncThunk('getStocks', async (object, { rejectWithValue }) => {
  const response = await request('/stock-ledger-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: { projectId: object.project, storeId: object.storeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTransactions = createAsyncThunk('getTransactions', async (object, { rejectWithValue }) => {
  const response = await request('/transaction-list', {
    method: 'GET',
    timeoutOverride: 20 * 60000,
    query: {
      projectId: object.project,
      storeId: object.store,
      ...(object.material && { materialId: object.material }),
      ...(object.withoutTransaction && { withoutTransaction: 1 }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTransactionsSecond = createAsyncThunk('getTransactionsSecond', async (object, { rejectWithValue }) => {
  const response = await request('/transaction-list', {
    method: 'GET',
    timeoutOverride: 20 * 60000,
    query: {
      projectId: object.project,
      storeId: object.store,
      ...(object.material && { materialId: object.material }),
      ...(object.withoutTransaction && { withoutTransaction: 1 }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTransactionsQty = createAsyncThunk('getTransactionsQty', async (object, { rejectWithValue }) => {
  const response = await request('/store-quantity-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: object.material
      ? {
          projectId: object.project,
          storeId: object.store,
          materialId: object.material,
          isRestricted: object.restricted,
          sort: ['createdAt', 'DESC']
        }
      : { projectId: object.project, storeId: object.store, isRestricted: object.restricted, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTransactionsSecondQty = createAsyncThunk('getTransactionsSecondQty', async (object, { rejectWithValue }) => {
  const response = await request('/store-quantity-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: object.material
      ? {
          projectId: object.project,
          storeId: object.store,
          materialId: object.material,
          isRestricted: object.restricted,
          sort: ['createdAt', 'DESC']
        }
      : { projectId: object.project, storeId: object.store, isRestricted: object.restricted, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getSerialNumbers = createAsyncThunk('getSerialNumbers', async (object, { rejectWithValue }) => {
  const response = await request('/active-serial-number-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      materialId: object.material,
      storeLocationId: object.storeLocation,
      installerId: object.installer,
      stockLedgerId: object.stockLedger,
      sort: ['createdAt', 'ASC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getSerialNumbersSecond = createAsyncThunk('getSerialNumbersSecond', async (object, { rejectWithValue }) => {
  const response = await request('/active-serial-number-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      materialId: object.material,
      storeLocationId: object.storeLocation,
      installerId: object.installer,
      sort: ['createdAt', 'ASC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAllSerialNumbers = createAsyncThunk('getAllSerialNumbers', async (object, { rejectWithValue }) => {
  const response = await request('/serial-number-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      materialId: object.material,
      ...(object.storeLocation && { storeLocationId: object.storeLocation }),
      ...(object.stockLedger && { stockLedgerId: object.stockLedger }),
      ...(object.status && { status: object.status }),
      rowPerPage: object.pageSize,
      pageNumber: object.pageNumber,
      sort: ['createdAt', 'ASC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDataBySTONo = createAsyncThunk('getDataBySTONo', async (queryParams, { rejectWithValue }) => {
  const response = await request('/stock-ledger-detail-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: { transactionTypeId: queryParams.transactionTypeId, referenceDocumentNumber: queryParams.requisitionNumber }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDetailsByRefNoSecond = createAsyncThunk('getDetailsByRefNo', async (queryParams, { rejectWithValue }) => {
  const { transactionTypeId, requestNumber, storeId, projectId } = queryParams;
  const response = await request('/stock-ledger-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: storeId
      ? {
          transactionTypeId: transactionTypeId,
          requestNumber: requestNumber,
          storeId: storeId,
          projectId: projectId
        }
      : {
          transactionTypeId: transactionTypeId,
          requestNumber: requestNumber,
          projectId: projectId
        }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDetailsByRefNo = createAsyncThunk('getDetailsByRefNoSecond', async (queryParams, { rejectWithValue }) => {
  const sortBy = queryParams?.sortBy || 'updatedAt';
  const sortOrder = queryParams?.sortOrder || 'DESC';

  const response = await request('/stock-ledger-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      ...(queryParams.referenceDocumentNumber && { referenceDocumentNumber: queryParams.referenceDocumentNumber }),
      projectId: queryParams.projectId,
      isCancelled: queryParams.isCancelled,
      isProcessed: queryParams.isProcessed,
      storeId: queryParams.storeId,
      transactionTypeId: queryParams.transactionTypeId,
      ...(queryParams.otherStoreId && { otherStoreId: queryParams.otherStoreId }),
      ...(queryParams.storeLocationId && { storeLocationId: queryParams.storeLocationId }),
      ...(queryParams.materialId && { materialId: queryParams.materialId }),
      ...(queryParams.requestNumber && { requestNumber: queryParams.requestNumber }),
      sort: [sortBy, sortOrder]
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStoreLocationsTransactions = createAsyncThunk('getStoreLocationsTransactions', async (object, { rejectWithValue }) => {
  const response = await request('/store-location-transaction-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      storeLocationId: object.storeLocation,
      installerId: object.installerId,
      materialId: object.material,
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDetailsByRefNoThird = createAsyncThunk('getDetailsByRefNoThird', async (queryParams, { rejectWithValue }) => {
  const sortBy = queryParams?.sortBy || 'updatedAt';
  const sortOrder = queryParams?.sortOrder || 'DESC';
  const response = await request('/stock-ledger-with-serial-number-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      ...(queryParams.referenceDocumentNumber && { referenceDocumentNumber: queryParams.referenceDocumentNumber }),
      ...(queryParams.requestNumber && { requestNumber: queryParams.requestNumber }),
      projectId: queryParams.projectId,
      isCancelled: queryParams.isCancelled,
      isProcessed: queryParams.isProcessed,
      storeId: queryParams.storeId,
      transactionTypeId: queryParams.transactionTypeId,
      ...(queryParams.storeLocationId && { storeLocationId: queryParams.storeLocationId }),
      ...(queryParams.otherStoreId && { otherStoreId: queryParams.otherStoreId }),
      ...(queryParams.otherProjectId && { otherProjectId: queryParams.otherProjectId }),
      ...(queryParams.getNegativeOnly && { isNegative: queryParams.getNegativeOnly }),
      sort: [sortBy, sortOrder]
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStoreLocationsStock = createAsyncThunk('getStoreLocationsStock', async (queryParams, { rejectWithValue }) => {
  const response = await request('/store-locations-stock', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: queryParams.projectId,
      storeId: queryParams.storeId,
      ...(queryParams.storeLocationId && { storeLocationId: queryParams.storeLocationId }),
      ...(queryParams.installerId && { installerId: queryParams.installerId }),
      ...(queryParams.materialId && { materialId: queryParams.materialId }),
      ...(queryParams.supplierId && { supplierId: queryParams.supplierId }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStocksByDate = createAsyncThunk('getStocksByDate', async (object, { rejectWithValue }) => {
  const response = await request('/stock-ledger-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.projectId,
      ...(object.storeId && { storeId: object.storeId }),
      ...(object.transactionTypeId && { transactionTypeId: object.transactionTypeId }),
      ...(object.fromDate && { fromDate: object.fromDate }),
      ...(object.toDate && { toDate: object.toDate }),
      rowPerPage: object.pageSize,
      pageNumber: object.pageIndex,
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStocksByDateForExport = createAsyncThunk('getStocksByDateForExport', async (object, { rejectWithValue }) => {
  const response = await request('/stock-ledger-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.projectId,
      ...(object.storeId && { storeId: object.storeId }),
      ...(object.transactionTypeId && { transactionTypeId: object.transactionTypeId }),
      ...(object.fromDate && { fromDate: object.fromDate }),
      ...(object.toDate && { toDate: object.toDate }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTransactionMaterialList = createAsyncThunk('getTransactionMaterialList', async (object, { rejectWithValue }) => {
  const response = await request('/transaction-material-list', {
    method: 'GET',
    timeoutOverride: 20 * 60000,
    query: {
      projectId: object.project,
      storeId: object.store
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTxnByMaterial = createAsyncThunk('getTxnByMaterial', async (object, { rejectWithValue }) => {
  const response = await request('/txn-by-material-list', {
    method: 'GET',
    timeoutOverride: 20 * 60000,
    query: {
      projectId: object.project,
      storeId: object.store,
      ...(object.material && { materialId: object.material })
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getTxnByLocationMaterial = createAsyncThunk('getTxnByLocationMaterial', async (object, { rejectWithValue }) => {
  const response = await request('/txn-by-location-material-list', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      storeLocationId: object.storeLocation,
      installerId: object.installerId,
      materialId: object.material
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStoreStockReport = createAsyncThunk('getStoreStockReport', async (object, { rejectWithValue }) => {
  const response = await request('/store-stock-report', {
    timeoutOverride: 20 * 60000,
    method: 'GET',
    query: {
      projectId: object.project,
      storeId: object.store,
      storeLocationId: object.storeLocation,
      installerId: object.installerId,
      materialId: object.material
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStockLedgerMaterialList = createAsyncThunk('getStockLedgerMaterialList', async (object, { rejectWithValue }) => {
  const response = await request('/stock-ledger-material-list', {
    method: 'GET',
    timeoutOverride: 20 * 60000,
    query: {
      projectId: object.project,
      storeId: object.store,
      ...(object.material && { materialId: object.material }),
      ...(object.withoutTransaction && { withoutTransaction: 1 }),
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});
