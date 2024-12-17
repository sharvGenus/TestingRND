import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useNetworks = () => {
  const [networks, setNetworks] = useState({
    networksObject: {},
    error: '',
    loading: true
  });

  const [networkProjects, setNetworkProjects] = useState({
    networkProjectsObject: [],
    error: '',
    loading: true
  });

  const [networkLevelProjects, setNetworkLevelProjects] = useState({
    networkLevelProjectsObject: [],
    error: '',
    loading: true
  });

  const [networkLevelParents, setNetworkLevelParents] = useState({
    networkLevelParentsObject: [],
    error: '',
    loading: true
  });

  const [networkHistory, setNetworkHistory] = useState({
    networkHistoryObject: {},
    error: '',
    loading: true
  });

  const [networkLevelEntryHistory, setNetworkLevelEntryHistory] = useState({
    networkLevelEntryHistoryObject: {},
    error: '',
    loading: true
  });

  const networksData = useSelector((state) => state.networks || {});
  const networkProjectsData = useSelector((state) => state.networkProjects || {});
  const networkLevelProjectsData = useSelector((state) => state.networkLevelProjects || {});
  const networkLevelParentsData = useSelector((state) => state.networkLevelParents || {});
  const networkHistoryData = useSelector((state) => state.networkHistory || {});
  const networkLevelEntryHistoryData = useSelector((state) => state.networkLevelEntryHistory || {});

  useEffect(() => {
    setNetworks((prev) => ({
      ...prev,
      ...networksData
    }));
  }, [networksData]);

  useEffect(() => {
    setNetworkProjects((prev) => ({
      ...prev,
      ...networkProjectsData
    }));
  }, [networkProjectsData]);

  useEffect(() => {
    setNetworkLevelProjects((prev) => ({
      ...prev,
      ...networkLevelProjectsData
    }));
  }, [networkLevelProjectsData]);

  useEffect(() => {
    setNetworkLevelParents((prev) => ({
      ...prev,
      ...networkLevelParentsData
    }));
  }, [networkLevelParentsData]);

  useEffect(() => {
    setNetworkHistory((prev) => ({
      ...prev,
      ...networkHistoryData
    }));
  }, [networkHistoryData]);

  useEffect(() => {
    setNetworkLevelEntryHistory((prev) => ({
      ...prev,
      ...networkLevelEntryHistoryData
    }));
  }, [networkLevelEntryHistoryData]);

  return { networks, networkProjects, networkLevelProjects, networkLevelParents, networkHistory, networkLevelEntryHistory };
};
