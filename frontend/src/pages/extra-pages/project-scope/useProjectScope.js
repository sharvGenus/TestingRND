import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useProjectScope = () => {
  const [projectScope, setProjectScope] = useState({
    projectScopeObject: {},
    error: '',
    loading: true
  });

  const [projectScopeHistory, setProjectScopeHistory] = useState({
    projectScopeHistoryObject: {},
    error: '',
    loading: true
  });

  const [projectScopeExtension, setProjectScopeExtension] = useState({
    projectScopeExtensionObject: {},
    error: '',
    loading: true
  });

  const [projectScopeExtensionHistory, setProjectScopeExtensionHistory] = useState({
    projectScopeExtensionHistoryObject: {},
    error: '',
    loading: true
  });

  const [projectScopeSat, setProjectScopeSat] = useState({
    projectScopeSatObject: {},
    error: '',
    loading: true
  });

  const [projectScopeSatHistory, setProjectScopeSatHistory] = useState({
    projectScopeSatHistoryObject: {},
    error: '',
    loading: true
  });

  // -------------------------------------------------------------------------

  const [projectAllScope, setProjectAllScope] = useState({
    projectScopeObject: {},
    error: '',
    loading: true
  });

  const [projectScopeAllHistory, setProjectScopeAllHistory] = useState({
    projectScopeHistoryObject: {},
    error: '',
    loading: true
  });

  const [projectScopeAllExtension, setProjectScopeAllExtension] = useState({
    projectScopeExtensionObject: {},
    error: '',
    loading: true
  });

  const [projectScopeExtensionAllHistory, setProjectScopeExtensionAllHistory] = useState({
    projectScopeExtensionHistoryObject: {},
    error: '',
    loading: true
  });

  const [projectScopeAllSat, setProjectScopeAllSat] = useState({
    projectScopeSatObject: {},
    error: '',
    loading: true
  });

  const [projectScopeSatAllHistory, setProjectScopeSatAllHistory] = useState({
    projectScopeSatHistoryObject: {},
    error: '',
    loading: true
  });

  // ---------------------------------------------------------------------------------------

  const projectScopeData = useSelector((state) => state.projectScope || {});
  const projectScopeHistoryData = useSelector((state) => state.projectScopeHistory || {});
  const projectScopeExtensionData = useSelector((state) => state.projectScopeExtension || {});
  const projectScopeExtensionHistoryData = useSelector((state) => state.projectScopeExtensionHistory || {});
  const projectScopeSatData = useSelector((state) => state.projectScopeSat || {});
  const projectScopeSatHistoryData = useSelector((state) => state.projectScopeSatHistory || {});
  const projectAllScopeData = useSelector((state) => state.projectAllScope || {});
  const projectScopeAllHistoryData = useSelector((state) => state.projectScopeAllHistory || {});
  const projectScopeAllExtensionData = useSelector((state) => state.projectScopeAllExtension || {});
  const projectScopeExtensionAllHistoryData = useSelector((state) => state.projectScopeExtensionAllHistory || {});
  const projectScopeAllSatData = useSelector((state) => state.projectScopeAllSat || {});
  const projectScopeSatAllHistoryData = useSelector((state) => state.projectScopeSatAllHistory || {});

  // ---------------------------------------------------------------------------------------

  useEffect(() => {
    setProjectScope((prev) => ({
      ...prev,
      ...projectScopeData
    }));
  }, [projectScopeData]);

  useEffect(() => {
    setProjectScopeHistory((prev) => ({
      ...prev,
      ...projectScopeHistoryData
    }));
  }, [projectScopeHistoryData]);

  useEffect(() => {
    setProjectScopeExtension((prev) => ({
      ...prev,
      ...projectScopeExtensionData
    }));
  }, [projectScopeExtensionData]);

  useEffect(() => {
    setProjectScopeExtensionHistory((prev) => ({
      ...prev,
      ...projectScopeExtensionHistoryData
    }));
  }, [projectScopeExtensionHistoryData]);

  useEffect(() => {
    setProjectScopeSat((prev) => ({
      ...prev,
      ...projectScopeSatData
    }));
  }, [projectScopeSatData]);

  useEffect(() => {
    setProjectScopeSatHistory((prev) => ({
      ...prev,
      ...projectScopeSatHistoryData
    }));
  }, [projectScopeSatHistoryData]);

  // -------------------------------------------------------------------------------------------

  useEffect(() => {
    setProjectAllScope((prev) => ({
      ...prev,
      ...projectAllScopeData
    }));
  }, [projectAllScopeData]);

  useEffect(() => {
    setProjectScopeAllHistory((prev) => ({
      ...prev,
      ...projectScopeAllHistoryData
    }));
  }, [projectScopeAllHistoryData]);

  useEffect(() => {
    setProjectScopeAllExtension((prev) => ({
      ...prev,
      ...projectScopeAllExtensionData
    }));
  }, [projectScopeAllExtensionData]);

  useEffect(() => {
    setProjectScopeExtensionAllHistory((prev) => ({
      ...prev,
      ...projectScopeExtensionAllHistoryData
    }));
  }, [projectScopeExtensionAllHistoryData]);

  useEffect(() => {
    setProjectScopeAllSat((prev) => ({
      ...prev,
      ...projectScopeAllSatData
    }));
  }, [projectScopeAllSatData]);

  useEffect(() => {
    setProjectScopeSatAllHistory((prev) => ({
      ...prev,
      ...projectScopeSatAllHistoryData
    }));
  }, [projectScopeSatAllHistoryData]);

  // ---------------------------------------------------------------------------------------

  return {
    projectScope,
    projectScopeHistory,
    projectScopeExtension,
    projectScopeExtensionHistory,
    projectScopeSat,
    projectScopeSatHistory,
    projectAllScope,
    projectScopeAllHistory,
    projectScopeAllExtension,
    projectScopeExtensionAllHistory,
    projectScopeAllSat,
    projectScopeSatAllHistory
  };
};
