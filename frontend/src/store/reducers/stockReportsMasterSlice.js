import { createSlice } from '@reduxjs/toolkit';
import {
  getDeliveryReports,
  getContractorReconciliationReports,
  getStoreDashboardReports,
  getContractorReports,
  getStockReports,
  getAgingOfMaterialReports,
  getMaterialSerialNoReports,
  getDocumentWiseReports,
  getStoreWiseMaterialReport,
  getMaterialTypesForReport,
  getContractorWiseMaterialSummaryReport,
  getAgingOfMaterialSubData,
  getDateWiseProductivityReport,
  getValidationStatusReport,
  getUserWiseValidationStatusReport,
  getAreaWiseProductivityReport,
  getMdmDataSyncReport,
  getMdmPayLoadStatus,
  getAreaWiseProgressDashboard,
  getContractorDashboard,
  getProjectSummaryDashboard,
  getExecutiveDashboard,
  getProjectSummaryCumulativeStatus,
  getSupervisorDashboard,
  getSupervisorCumulativeSummary,
  getMaterialGrnReports,
  getUserWiseProductivityReport
} from 'store/actions';

export const deliveryReports = createSlice({
  name: 'deliveryReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDeliveryReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDeliveryReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.deliveryReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDeliveryReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const contractorReconciliationReports = createSlice({
  name: 'contractorReconciliationReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContractorReconciliationReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getContractorReconciliationReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorReconciliationReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getContractorReconciliationReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const storeDashboardReports = createSlice({
  name: 'storeDashboardReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreDashboardReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStoreDashboardReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.storeDashboardReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStoreDashboardReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const contractorReports = createSlice({
  name: 'contractorReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContractorReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getContractorReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getContractorReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const stockReports = createSlice({
  name: 'stockReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStockReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStockReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stockReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getStockReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const agingOfMaterialReports = createSlice({
  name: 'agingOfMaterialReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAgingOfMaterialReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAgingOfMaterialReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.agingOfMaterialReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAgingOfMaterialReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const dateWiseProductivityReports = createSlice({
  name: 'dateWiseProductivityReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDateWiseProductivityReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDateWiseProductivityReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.dateWiseProductivityReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDateWiseProductivityReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const validationStatusReports = createSlice({
  name: 'validationStatusReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getValidationStatusReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getValidationStatusReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.validationStatusReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getValidationStatusReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const userWiseValidationStatusReports = createSlice({
  name: 'userWiseValidationStatusReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserWiseValidationStatusReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUserWiseValidationStatusReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userWiseValidationStatusReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getUserWiseValidationStatusReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const areaWiseProductivityReports = createSlice({
  name: 'areaWiseProductivityReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAreaWiseProductivityReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAreaWiseProductivityReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.areaWiseProductivityReportsObject = payload?.data;
      state.error = '';
    });
    builder.addCase(getAreaWiseProductivityReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const userWiseProductivityReports = createSlice({
  name: 'userWiseProductivityReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserWiseProductivityReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUserWiseProductivityReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userWiseProductivityReports = payload?.data?.rows;
      state.error = '';
    });
    builder.addCase(getUserWiseProductivityReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const mdmDataSyncReport = createSlice({
  name: 'mdmDataSyncReport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMdmDataSyncReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMdmDataSyncReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.mdmDataSyncReportObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMdmDataSyncReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const mdmPayloadStatus = createSlice({
  name: 'mdmPayloadStatus',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMdmPayLoadStatus.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMdmPayLoadStatus.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.mdmPayloadStatusObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMdmPayLoadStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const agingOfMaterialReportsSubData = createSlice({
  name: 'agingOfMaterialReportsSubData',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAgingOfMaterialSubData.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAgingOfMaterialSubData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.agingOfMaterialSubDataObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAgingOfMaterialSubData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialSerialNoReports = createSlice({
  name: 'materialSerialNoReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialSerialNoReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialSerialNoReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialSerialNoReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialSerialNoReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const documentWiseReports = createSlice({
  name: 'documentWiseReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDocumentWiseReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDocumentWiseReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.documentWiseReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDocumentWiseReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const storeWiseMaterialReport = createSlice({
  name: 'storeWiseMaterialReport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreWiseMaterialReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getStoreWiseMaterialReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.storeWiseMaterial = payload?.storeWiseMaterial || [];
      state.error = '';
    });
    builder.addCase(getStoreWiseMaterialReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const contractorWiseMaterialSummaryReport = createSlice({
  name: 'contractorWiseMaterialSummaryReport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContractorWiseMaterialSummaryReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getContractorWiseMaterialSummaryReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.storeWiseMaterial = payload?.storeWiseMaterial || [];
      state.error = '';
    });
    builder.addCase(getContractorWiseMaterialSummaryReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialTypeForReport = createSlice({
  name: 'materialTypeForReport',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialTypesForReport.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialTypesForReport.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialTypeArr = payload?.materialTypeArr || [];
      state.error = '';
    });
    builder.addCase(getMaterialTypesForReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const executiveDashboard = createSlice({
  name: 'executiveDashboard',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExecutiveDashboard.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getExecutiveDashboard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.executiveDashboardObject = payload.data;
      state.error = '';
    });
    builder.addCase(getExecutiveDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const areaWiseProgressDashboard = createSlice({
  name: 'areaWiseProgressDashboard',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAreaWiseProgressDashboard.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAreaWiseProgressDashboard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.areaWiseProgressDashboardObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAreaWiseProgressDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const contractorDashboard = createSlice({
  name: 'contractorDashboard',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContractorDashboard.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getContractorDashboard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorDashboardObject = payload.data;
      state.error = '';
    });
    builder.addCase(getContractorDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectSummaryDashboard = createSlice({
  name: 'projectSummaryDashboard',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectSummaryDashboard.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectSummaryDashboard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectSummaryDashboardObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectSummaryDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const projectSummaryCumulativeStatus = createSlice({
  name: 'projectSummaryCumulativeStatus',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectSummaryCumulativeStatus.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getProjectSummaryCumulativeStatus.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.projectSummaryCumulativeStatusObject = payload.data;
      state.error = '';
    });
    builder.addCase(getProjectSummaryCumulativeStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const supervisorDashboard = createSlice({
  name: 'supervisorDashboard',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupervisorDashboard.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupervisorDashboard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supervisorDashboardObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupervisorDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const supervisorCumulativeSummary = createSlice({
  name: 'supervisorCumulativeSummary',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupervisorCumulativeSummary.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupervisorCumulativeSummary.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supervisorCumulativeSummaryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupervisorCumulativeSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const materialGrnReports = createSlice({
  name: 'materialGrnReports',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaterialGrnReports.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMaterialGrnReports.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.materialGrnReportsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getMaterialGrnReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
