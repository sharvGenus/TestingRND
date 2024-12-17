import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useReports = () => {
  const [deliveryReports, setDeliveryReports] = useState({
    deliveryReportsObject: {},
    error: '',
    loading: true
  });
  const [contractorReconciliationReports, setContractorReconciliationReports] = useState({
    contractorReconciliationReportsObject: {},
    error: '',
    loading: true
  });
  const [storeDashboardReports, setStoreDashboardReports] = useState({
    storeDashboardReportsObject: {},
    error: '',
    loading: true
  });

  const [contractorReports, setContractorReports] = useState({
    contractorReportsObject: {},
    error: '',
    loading: true
  });

  const [stockReports, setStockReports] = useState({
    stockReportsObject: {},
    error: '',
    loading: true
  });

  const [agingOfMaterialReports, setAgingOfMaterialReports] = useState({
    agingOfMaterialReportsObject: {},
    error: '',
    loading: true
  });

  const [dateWiseProductivityReports, setDateWiseProductivityReports] = useState({
    dateWiseProductivityReportsObject: {},
    error: '',
    loading: true
  });

  const [validationStatusReports, setValidationStatusReports] = useState({
    validationStatusReportsObject: {},
    error: '',
    loading: true
  });

  const [userWiseValidationStatusReports, setUserWiseValidationStatusReports] = useState({
    userWiseValidationStatusReportsObject: [],
    error: '',
    loading: true
  });

  const [areaWiseProductivityReports, setAreaWiseProductivityReports] = useState({
    areaWiseProductivityReportsObject: [],
    error: '',
    loading: true
  });
  const [userWiseProductivityReports, setUserWiseProductivityReports] = useState({
    userWiseProductivityReportsObject: [],
    error: '',
    loading: true
  });
  const [mdmDataSyncReport, setMdmDataSyncReport] = useState({
    mdmDataSyncReportObject: [],
    error: '',
    loading: true
  });

  const [mdmPayloadStatus, setMdmPayloadStatus] = useState({
    mdmPayloadStatusObject: [],
    error: '',
    loading: true
  });

  const [agingOfMaterialReportsSubData, setAgingOfMaterialReportsSubData] = useState({
    agingOfMaterialSubDataObject: {},
    error: '',
    loading: true
  });

  const [materialSerialNoReports, setMaterialSerialNoReports] = useState({
    materialSerialNoReportsObject: {},
    error: '',
    loading: true
  });

  const [documentWiseReports, setDocumentWiseReports] = useState({
    documentWiseReportsObject: {},
    error: '',
    loading: true
  });

  const deliveryReportsData = useSelector((state) => state.deliveryReports || []);
  const contractorReconciliationData = useSelector((state) => state.contractorReconciliationReports || []);
  const storeDashboardReportsData = useSelector((state) => state.storeDashboardReports || []);
  const contractorReportsData = useSelector((state) => state.contractorReports || []);
  const stockReportsData = useSelector((state) => state.stockReports || []);
  const agingOfMaterialReportsData = useSelector((state) => state.agingOfMaterialReports || []);
  const dateWiseProductivityReportsData = useSelector((state) => state.dateWiseProductivityReports || []);
  const materialSerialNoReportsData = useSelector((state) => state.agingOfMaterialReports || []);
  const documentWiseReportsData = useSelector((state) => state.documentWiseReports || []);
  const agingOfMaterialReportsSubDataData = useSelector((state) => state.agingOfMaterialReportsSubData || []);
  const validationStatusReportsData = useSelector((state) => state.validationStatusReports || []);
  const userWiseValidationStatusReportsData = useSelector((state) => state.userWiseValidationStatusReports || []);
  const areaWiseProductivityReportsData = useSelector((state) => state.areaWiseProductivityReports || []);
  const mdmDataSyncReportData = useSelector((state) => state.mdmDataSyncReport || []);
  const mdmPayloadStatusData = useSelector((state) => state.mdmPayloadStatus || []);
  const userWiseProductivityReportsData = useSelector((state) => state.userWiseProductivityReports || []);

  useEffect(() => {
    setDeliveryReports((prev) => ({
      ...prev,
      ...deliveryReportsData
    }));
  }, [deliveryReportsData]);
  useEffect(() => {
    setContractorReconciliationReports((prev) => ({
      ...prev,
      ...contractorReconciliationData
    }));
  }, [contractorReconciliationData]);
  useEffect(() => {
    setStoreDashboardReports((prev) => ({
      ...prev,
      ...storeDashboardReportsData
    }));
  }, [storeDashboardReportsData]);
  useEffect(() => {
    setContractorReports((prev) => ({
      ...prev,
      ...contractorReportsData
    }));
  }, [contractorReportsData]);
  useEffect(() => {
    setStockReports((prev) => ({
      ...prev,
      ...stockReportsData
    }));
  }, [stockReportsData]);
  useEffect(() => {
    setAgingOfMaterialReports((prev) => ({
      ...prev,
      ...agingOfMaterialReportsData
    }));
  }, [agingOfMaterialReportsData]);
  useEffect(() => {
    setDateWiseProductivityReports((prev) => ({
      ...prev,
      ...dateWiseProductivityReportsData
    }));
  }, [dateWiseProductivityReportsData]);
  useEffect(() => {
    setMaterialSerialNoReports((prev) => ({
      ...prev,
      ...materialSerialNoReportsData
    }));
  }, [materialSerialNoReportsData]);
  useEffect(() => {
    setValidationStatusReports((prev) => ({
      ...prev,
      ...validationStatusReportsData
    }));
  }, [validationStatusReportsData]);
  useEffect(() => {
    setUserWiseValidationStatusReports((prev) => ({
      ...prev,
      ...userWiseValidationStatusReportsData
    }));
  }, [userWiseValidationStatusReportsData]);
  useEffect(() => {
    setDocumentWiseReports((prev) => ({
      ...prev,
      ...documentWiseReportsData
    }));
  }, [documentWiseReportsData]);
  useEffect(() => {
    setAgingOfMaterialReportsSubData((prev) => ({
      ...prev,
      ...agingOfMaterialReportsSubDataData
    }));
  }, [agingOfMaterialReportsSubDataData]);
  useEffect(() => {
    setAreaWiseProductivityReports((prev) => ({
      ...prev,
      ...areaWiseProductivityReportsData
    }));
  }, [areaWiseProductivityReportsData]);
  useEffect(() => {
    setMdmDataSyncReport((prev) => ({
      ...prev,
      ...mdmDataSyncReportData
    }));
  }, [mdmDataSyncReportData]);
  useEffect(() => {
    setMdmPayloadStatus((prev) => ({
      ...prev,
      ...mdmPayloadStatusData
    }));
  }, [mdmPayloadStatusData]);
  useEffect(() => {
    setUserWiseProductivityReports((prev) => ({
      ...prev,
      ...userWiseProductivityReportsData
    }));
  }, [userWiseProductivityReportsData]);
  return {
    deliveryReports,
    contractorReconciliationReports,
    storeDashboardReports,
    contractorReports,
    stockReports,
    agingOfMaterialReports,
    materialSerialNoReports,
    documentWiseReports,
    dateWiseProductivityReports,
    validationStatusReports,
    agingOfMaterialReportsSubData,
    userWiseValidationStatusReports,
    areaWiseProductivityReports,
    mdmDataSyncReport,
    mdmPayloadStatus,
    userWiseProductivityReports
  };
};
