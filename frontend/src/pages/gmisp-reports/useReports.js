import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useReports = () => {
  const [storeWiseMaterialReport, setStoreWiseMaterialReport] = useState({
    storeWiseMaterial: [],
    error: '',
    loading: true
  });

  const [contractorWiseMaterialSummaryReport, setContractorWiseMaterialSummaryReport] = useState({
    storeWiseMaterial: [],
    error: '',
    loading: true
  });

  const [materialTypeForReport, setMaterialTypeForReport] = useState({
    materialTypeArr: [],
    error: '',
    loading: true
  });

  const [stocksByDate, setStocksByDate] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const [stocksByDateForExport, setStocksByDateForExport] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const [executiveDashboard, setExecutiveDashboard] = useState({
    executiveDashboardObject: {},
    error: '',
    loading: false
  });

  const [areaWiseProgressDashboard, setAreaWiseProgressDashboard] = useState({
    areaWiseProgressDashboardObject: {},
    error: '',
    loading: false
  });

  const [contractorDashboard, setContractorDashboard] = useState({
    contractorDashboardObject: {},
    error: '',
    loading: false
  });

  const [projectSummaryDashboard, setProjectSummaryDashboard] = useState({
    projectSummaryDashboardObject: {},
    error: '',
    loading: false
  });

  const [projectSummaryCumulativeStatus, setProjectSummaryCumulativeStatus] = useState({
    projectSummaryCumulativeStatusObject: {},
    error: '',
    loading: false
  });

  const [supervisorDashboard, setSupervisorDashboard] = useState({
    supervisorDashboardObject: {},
    error: '',
    loading: false
  });

  const [supervisorCumulativeSummary, setSupervisorCumulativeSummary] = useState({
    supervisorCumulativeSummaryObject: {},
    error: '',
    loading: false
  });

  const storeWiseMaterialReportData = useSelector((state) => state.storeWiseMaterialReport || {});
  const contractorWiseMaterialSummaryReportData = useSelector((state) => state.contractorWiseMaterialSummaryReport || {});
  const materialTypeForReportData = useSelector((state) => state.materialTypeForReport || {});
  const stocksByDateData = useSelector((state) => state.stocksByDate || {});
  const stocksByDateForExportData = useSelector((state) => state.stocksByDateForExport || {});
  const executiveDashboardData = useSelector((state) => state.executiveDashboard);
  const areaWiseProgressDashboardData = useSelector((state) => state.areaWiseProgressDashboard);
  const contractorDashboardData = useSelector((state) => state.contractorDashboard);
  const projectSummaryDashboardData = useSelector((state) => state.projectSummaryDashboard);
  const projectSummaryCumulativeStatusData = useSelector((state) => state.projectSummaryCumulativeStatus);
  const supervisorDashboardData = useSelector((state) => state.supervisorDashboard);
  const supervisorCumulativeSummaryData = useSelector((state) => state.supervisorCumulativeSummary);

  useEffect(() => {
    setStoreWiseMaterialReport((prev) => ({
      ...prev,
      ...storeWiseMaterialReportData
    }));
  }, [storeWiseMaterialReportData]);

  useEffect(() => {
    setContractorWiseMaterialSummaryReport((prev) => ({
      ...prev,
      ...contractorWiseMaterialSummaryReportData
    }));
  }, [contractorWiseMaterialSummaryReportData]);

  useEffect(() => {
    setMaterialTypeForReport((prev) => ({
      ...prev,
      ...materialTypeForReportData
    }));
  }, [materialTypeForReportData]);

  useEffect(() => {
    setStocksByDate((prev) => ({
      ...prev,
      ...stocksByDateData
    }));
  }, [stocksByDateData]);

  useEffect(() => {
    setStocksByDateForExport((prev) => ({
      ...prev,
      ...stocksByDateForExportData
    }));
  }, [stocksByDateForExportData]);

  useEffect(() => {
    setExecutiveDashboard((prev) => ({
      ...prev,
      ...executiveDashboardData
    }));
  }, [executiveDashboardData]);

  useEffect(() => {
    setAreaWiseProgressDashboard((prev) => ({
      ...prev,
      ...areaWiseProgressDashboardData
    }));
  }, [areaWiseProgressDashboardData]);

  useEffect(() => {
    setContractorDashboard((prev) => ({
      ...prev,
      ...contractorDashboardData
    }));
  }, [contractorDashboardData]);

  useEffect(() => {
    setProjectSummaryDashboard((prev) => ({
      ...prev,
      ...projectSummaryDashboardData
    }));
  }, [projectSummaryDashboardData]);

  useEffect(() => {
    setProjectSummaryCumulativeStatus((prev) => ({
      ...prev,
      ...projectSummaryCumulativeStatusData
    }));
  }, [projectSummaryCumulativeStatusData]);

  useEffect(() => {
    setSupervisorDashboard((prev) => ({
      ...prev,
      ...supervisorDashboardData
    }));
  }, [supervisorDashboardData]);

  useEffect(() => {
    setSupervisorCumulativeSummary((prev) => ({
      ...prev,
      ...supervisorCumulativeSummaryData
    }));
  }, [supervisorCumulativeSummaryData]);

  return {
    storeWiseMaterialReport,
    contractorWiseMaterialSummaryReport,
    materialTypeForReport,
    stocksByDate,
    stocksByDateForExport,
    executiveDashboard,
    areaWiseProgressDashboard,
    contractorDashboard,
    projectSummaryDashboard,
    projectSummaryCumulativeStatus,
    supervisorDashboard,
    supervisorCumulativeSummary
  };
};
