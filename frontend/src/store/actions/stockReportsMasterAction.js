import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '../../utils/request';

export const getDeliveryReports = createAsyncThunk('getDeliveryReports', async (object, { rejectWithValue }) => {
  const { projectId, transactionTypeId, storeId, fromDate, toDate } = object;
  const response = await request('/delivery-report-list', {
    method: 'GET',
    query: { projectId, transactionTypeId, storeId, fromDate, toDate, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getContractorReconciliationReports = createAsyncThunk(
  'getContractorReconciliationReports',
  async (object, { rejectWithValue }) => {
    const { projectId, organizationId, storeId } = object;
    const response = await request('/delivery-report-list', {
      method: 'GET',
      query: { projectId, organizationId, storeId, sort: ['createdAt', 'DESC'] }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getStoreDashboardReports = createAsyncThunk('getStoreDashboardReports', async (object, { rejectWithValue }) => {
  const { projectId, transactionTypeId, storeId } = object;
  const response = await request('/delivery-report-list', {
    method: 'GET',
    query: { projectId, transactionTypeId, storeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getContractorReports = createAsyncThunk('getContractorReports', async (object, { rejectWithValue }) => {
  const { projectId, organizationId, storeId, materialId } = object;
  const response = await request('/contractor-report-list', {
    method: 'GET',
    query: { projectId, organizationId, storeId, materialId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStockReports = createAsyncThunk('getStockReports', async (object, { rejectWithValue }) => {
  const { projectId, organizationId, storeId } = object;
  const response = await request('/stock-report-list', {
    method: 'GET',
    query: organizationId
      ? { projectId, organizationId, storeId, sort: ['createdAt', 'DESC'] }
      : { projectId, storeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getAgingOfMaterialReports = createAsyncThunk('getAgingOfMaterialReports', async (object, { rejectWithValue }) => {
  const { projectId, organizationId, storeId, branchId, materialId, pageSize, pageIndex } = object;
  const response = await request('/aging-material-report-list', {
    method: 'GET',
    query: {
      pageSize,
      pageIndex,
      projectId,
      branchId,
      materialId,
      ...(organizationId && { organizationId }),
      storeId,
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDateWiseProductivityReport = createAsyncThunk('getDateWiseProductivityReport', async (object = {}, { rejectWithValue }) => {
  const { projectId, formId, formType, pageSize, pageIndex, approver, dateFrom, dateTo, gaaLevelDetails } = object;
  const response = await request('/date-wise-productivity-report', {
    method: 'GET',
    query: { projectId, formId, formType, pageSize, pageIndex, approver, gaaLevelDetails, dateFrom, dateTo, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getValidationStatusReport = createAsyncThunk('getValidationStatusReport', async (object, { rejectWithValue }) => {
  const { projectId, formId, formType, pageSize, pageIndex, approver, dateFrom, dateTo, gaaLevelDetails, setReportData, setCount } = object;
  const response = await request('/validation-status-report', {
    method: 'GET',
    query: { projectId, formId, formType, pageSize, pageIndex, approver, dateFrom, dateTo, gaaLevelDetails, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    setReportData(response?.data?.data?.rows);
    setCount(response?.data?.data?.count);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getUserWiseValidationStatusReport = createAsyncThunk(
  'getUserWiseValidationStatusReport',
  async (object, { rejectWithValue }) => {
    const {
      projectId,
      formId,
      formType,
      pageSize,
      pageIndex,
      approver,
      dateFrom,
      dateTo,
      gaaLevelDetails,
      setReportsData,
      setReportsCount
    } = object;
    const response = await request('/forms-generate-forms-report', {
      method: 'GET',
      query: { projectId, formId, formType, pageSize, pageIndex, approver, dateFrom, dateTo, gaaLevelDetails, sort: ['createdAt', 'DESC'] }
    });
    if (response.success) {
      setReportsData(response?.data?.data?.rows);
      setReportsCount(response?.data?.data?.count);
      return response.data;
    }
    const error = response.error?.message || response.error || 'Something went wrong';
    throw rejectWithValue(error);
  }
);

export const getAreaWiseProductivityReport = createAsyncThunk('getAreaWiseProductivityReport', async (object, { rejectWithValue }) => {
  const { projectId, formType, formId, gaaHierarchy, pageSize, pageIndex, dateFrom, dateTo, setReportsData, setCount } = object;
  const response = await request('/area-wise-productivity', {
    method: 'GET',
    query: { projectId, formType, formId, gaaHierarchy, pageSize, pageIndex, dateFrom, dateTo, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    setCount(response?.data?.data?.count);
    setReportsData(response?.data?.data?.rows);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getUserWiseProductivityReport = createAsyncThunk('getUserWiseProductivityReport', async (object, { rejectWithValue }) => {
  const { projectId, formType, formId, gaaHierarchy, pageSize, pageIndex, dateFrom, dateTo, setReportData, setCount } = object;
  const response = await request('/userWise-productivity-reports', {
    method: 'GET',
    query: {
      projectId: projectId,
      formTypeId: formType,
      formId: formId,
      gaaHierarchy: gaaHierarchy,
      rowPerPage: pageSize,
      pageNumber: pageIndex,
      dateFrom: dateFrom,
      dateTo: dateTo,
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    setCount(response?.data?.data?.count);
    setReportData(response?.data?.data?.rows);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getMdmDataSyncReport = createAsyncThunk('getMdmDataSyncReport', async (object, { rejectWithValue }) => {
  const {
    projectId,
    formId,
    formType,
    pageSize,
    pageIndex,
    mdmPayloadStatus,
    gaaLevelDetails,
    dateFrom,
    dateTo,
    setIsLoading,
    setReportsData
  } = object;
  const response = await request('/form-form-responses', {
    method: 'POST',
    body: {
      projectId,
      formId,
      formType,
      pageSize,
      pageIndex,
      mdmPayloadStatus,
      gaaLevelFilter: gaaLevelDetails,
      dateFrom,
      dateTo,
      sort: ['createdAt', 'DESC']
    }
  });
  if (response.success) {
    setIsLoading(false);
    setReportsData(response?.data?.data?.rows);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  setIsLoading(false);
  throw rejectWithValue(error);
});

export const getMdmPayLoadStatus = createAsyncThunk('getMdmPayLoadStatus', async (object, { rejectWithValue }) => {
  const { formId } = object;
  const response = await request('/forms-mdm-payload-status-dropdown', {
    method: 'GET',
    query: {
      formId
    }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getAgingOfMaterialSubData = createAsyncThunk('getAgingOfMaterialSubData', async (object, { rejectWithValue }) => {
  const { projectId, materialId, storeId, pageSize, pageIndex } = object;
  const response = await request('/aging-material-sub-report-list', {
    method: 'GET',
    query: { pageSize, pageIndex, projectId, materialId, storeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getMaterialSerialNoReports = createAsyncThunk('getMaterialSerialNoReports', async (object, { rejectWithValue }) => {
  const { projectId, organizationId, storeId } = object;
  const response = await request('/aging-material-report-list', {
    method: 'GET',
    query: organizationId
      ? { projectId, organizationId, storeId, sort: ['createdAt', 'DESC'] }
      : { projectId, storeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getDocumentWiseReports = createAsyncThunk('getDocumentWiseReports', async (object, { rejectWithValue }) => {
  const { projectId, transactionTypeId, storeId, fromDate, toDate } = object;
  const response = await request('/document-wise-report-list', {
    method: 'GET',
    query: { projectId, transactionTypeId, storeId, fromDate, toDate, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getStoreWiseMaterialReport = createAsyncThunk('getStoreWiseMaterialReport', async (object, { rejectWithValue }) => {
  const { projectId, storeId, materialTypeId } = object;
  const response = await request('/store-wise-material-summary-report', {
    method: 'GET',
    query: { projectId, storeId, materialTypeId, sort: ['createdAt', 'DESC'] }
  });

  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getContractorWiseMaterialSummaryReport = createAsyncThunk(
  'getContractorWiseMaterialSummaryReport',
  async (object, { rejectWithValue }) => {
    const { projectId, storeId, contractorId, materialTypeId } = object;
    const response = await request('/contractor-wise-material-summary-report', {
      method: 'GET',
      query: { projectId, storeId, contractorId, materialTypeId, sort: ['createdAt', 'DESC'] }
    });

    if (response.success) {
      return response.data;
    }
    const error = response.error && response.error.message ? response.error.message : response.error;
    throw rejectWithValue(error || 'Something went wrong');
  }
);

export const getMaterialTypesForReport = createAsyncThunk('getMaterialTypesForReport', async (object, { rejectWithValue }) => {
  const { projectId, storeId, contractorId } = object || {};
  const response = await request('/get-material-types-for-report', {
    method: 'GET',
    query: { projectId, ...(contractorId && { contractorId }), ...(storeId && { storeId }), sort: ['createdAt', 'DESC'] }
  });

  if (response.success) {
    return response.data;
  }
  const error = response.error && response.error.message ? response.error.message : response.error;
  throw rejectWithValue(error || 'Something went wrong');
});

export const getExecutiveDashboard = createAsyncThunk('getExecutiveDashboard', async (object, { rejectWithValue }) => {
  const { projectId } = object || {};
  const response = await request('/executive-dashboard', {
    method: 'GET',
    query: { projectId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getAreaWiseProgressDashboard = createAsyncThunk('getAreaWiseProgressDashboard', async (object, { rejectWithValue }) => {
  const { gaaLevelDetails, projectId, fromDate, toDate, activityType } = object;
  const response = await request('/area-wise-progress-dashboard', {
    method: 'GET',
    query: { gaaLevelDetails, projectId, fromDate, toDate, activityType, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getContractorDashboard = createAsyncThunk('getContractorDashboard', async (object, { rejectWithValue }) => {
  const { projectId, meterTypeId } = object || {};
  const response = await request('/contractor-dashboard', {
    method: 'GET',
    query: { projectId, meterTypeId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getProjectSummaryDashboard = createAsyncThunk('getProjectSummaryDashboard', async (object, { rejectWithValue }) => {
  const { projectId } = object;
  const response = await request('/project-summary-dashboard', {
    method: 'GET',
    query: { projectId, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getProjectSummaryCumulativeStatus = createAsyncThunk(
  'getProjectSummaryCumulativeStatus',
  async (object, { rejectWithValue }) => {
    const { projectId, dateTimeFrom, dateTimeTo } = object;
    const response = await request('/project-summary-dashboard', {
      method: 'GET',
      query: { projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly: true, sort: ['createdAt', 'DESC'] }
    });
    if (response.success) {
      return response.data;
    }
    const error = response.error?.message || response.error || 'Something went wrong';
    throw rejectWithValue(error);
  }
);

export const getSupervisorDashboard = createAsyncThunk('getSupervisorDashboard', async (object, { rejectWithValue }) => {
  const { projectId, taskType } = object;
  const response = await request('/supervisor-dashboard', {
    method: 'GET',
    query: { projectId, taskType, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getSupervisorCumulativeSummary = createAsyncThunk('getSupervisorCumulativeSummary', async (object, { rejectWithValue }) => {
  const { projectId, dateTimeFrom, dateTimeTo, taskType } = object;
  const response = await request('/supervisor-dashboard', {
    method: 'GET',
    query: { projectId, dateTimeFrom, dateTimeTo, taskType, cumulativeStatusOnly: true, sort: ['createdAt', 'DESC'] }
  });
  if (response.success) {
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getMaterialGrnReports = createAsyncThunk('getMaterialGrnReports', async (object, { rejectWithValue }) => {
  const { projectId, materialTypeId, itemSerialNoFrom, itemSerialNoTo, dateFrom, dateTo, pageSize, pageIndex, setData, setCount } = object;
  const response = await request('/material-grn-report', {
    method: 'GET',
    query: {
      projectId,
      materialTypeId,
      itemSerialNoFrom,
      itemSerialNoTo,
      dateFrom,
      dateTo,
      pageSize,
      pageIndex
    }
  });
  if (response.success) {
    setData(response?.data?.data?.rows);
    setCount(response?.data?.data?.count || 0);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});

export const getProductivitySummaryReport = createAsyncThunk('getProductivitySummaryReport', async (object, { rejectWithValue }) => {
  const { projectId, gaaHierarchyDetails, dateFrom, dateTo, pageSize, pageIndex, pagination = true, setReportsData, setCount } = object;
  const response = await request('/productivity-summary-report', {
    method: 'POST',
    query: { pageSize, pageIndex, pagination, sort: ['createdAt', 'DESC'] },
    body: { projectId, gaaHierarchyDetails, dateFrom, dateTo }
  });
  if (response.success) {
    setCount(response?.data?.data?.count);
    setReportsData(response?.data?.data?.rows);
    return response.data;
  }
  const error = response.error?.message || response.error || 'Something went wrong';
  throw rejectWithValue(error);
});
