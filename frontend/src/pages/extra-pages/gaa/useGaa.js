import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useGaa = () => {
  const [gaa, setGaa] = useState({
    gaaObject: {},
    error: '',
    loading: true
  });

  const [gaaProjects, setGaaProjects] = useState({
    gaaProjectsObject: [],
    error: '',
    loading: true
  });

  const [gaaLevelProjects, setGaaLevelProjects] = useState({
    gaaLevelProjectsObject: [],
    error: '',
    loading: true
  });

  const [gaaLevelParents, setGaaLevelParents] = useState({
    gaaLevelParentsObject: [],
    error: '',
    loading: true
  });

  const [projectAreaLevels, setProjectAreaLevels] = useState({
    projectAreaLevelsObject: [],
    error: '',
    loading: false
  });

  const [gaaHistory, setGaaHistory] = useState({
    gaaHistoryObject: {},
    error: '',
    loading: true
  });

  const [gaaLevelEntryHistory, setGaaLevelEntryHistory] = useState({
    gaaLevelEntryHistoryObject: {},
    error: '',
    loading: true
  });

  const gaaData = useSelector((state) => state.gaa || {});
  const gaaProjectsData = useSelector((state) => state.gaaProjects || {});
  const gaaLevelProjectsData = useSelector((state) => state.gaaLevelProjects || {});
  const gaaLevelParentsData = useSelector((state) => state.gaaLevelParents || {});
  const projectAreaLevelsData = useSelector((state) => state.projectAreaLevels || {});
  const gaaHistoryData = useSelector((state) => state.gaaHistory || {});
  const gaaLevelEntryHistoryData = useSelector((state) => state.gaaLevelEntryHistory || {});

  useEffect(() => {
    setGaa((prev) => ({
      ...prev,
      ...gaaData
    }));
  }, [gaaData]);

  useEffect(() => {
    setGaaProjects((prev) => ({
      ...prev,
      ...gaaProjectsData
    }));
  }, [gaaProjectsData]);

  useEffect(() => {
    setGaaLevelProjects((prev) => ({
      ...prev,
      ...gaaLevelProjectsData
    }));
  }, [gaaLevelProjectsData]);

  useEffect(() => {
    setGaaLevelParents((prev) => ({
      ...prev,
      ...gaaLevelParentsData
    }));
  }, [gaaLevelParentsData]);

  useEffect(() => {
    setProjectAreaLevels((prev) => ({
      ...prev,
      ...projectAreaLevelsData
    }));
  }, [projectAreaLevelsData]);

  useEffect(() => {
    setGaaHistory((prev) => ({
      ...prev,
      ...gaaHistoryData
    }));
  }, [gaaHistoryData]);

  useEffect(() => {
    setGaaLevelEntryHistory((prev) => ({
      ...prev,
      ...gaaLevelEntryHistoryData
    }));
  }, [gaaLevelEntryHistoryData]);

  return { gaa, gaaProjects, gaaLevelProjects, gaaLevelParents, projectAreaLevels, gaaHistory, gaaLevelEntryHistory };
};
