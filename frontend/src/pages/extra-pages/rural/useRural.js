import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useRural = () => {
  const [rural, setRural] = useState({
    ruralObject: {},
    error: '',
    loading: true
  });

  const [ruralProjects, setRuralProjects] = useState({
    ruralProjectsObject: [],
    error: '',
    loading: true
  });

  const [ruralLevelProjects, setRuralLevelProjects] = useState({
    ruralLevelProjectsObject: [],
    error: '',
    loading: true
  });

  const [ruralLevelParents, setRuralLevelParents] = useState({
    ruralLevelParentsObject: [],
    error: '',
    loading: true
  });

  const [projectAreaLevels, setProjectAreaLevels] = useState({
    projectAreaLevelsObject: [],
    error: '',
    loading: false
  });

  const [ruralHistory, setRuralHistory] = useState({
    ruralHistoryObject: {},
    error: '',
    loading: true
  });

  const [ruralLevelEntryHistory, setRuralLevelEntryHistory] = useState({
    ruralLevelEntryHistoryObject: {},
    error: '',
    loading: true
  });

  const ruralData = useSelector((state) => state.rural || {});
  const ruralProjectsData = useSelector((state) => state.ruralProjects || {});
  const ruralLevelProjectsData = useSelector((state) => state.ruralLevelProjects || {});
  const ruralLevelParentsData = useSelector((state) => state.ruralLevelParents || {});
  const projectAreaLevelsData = useSelector((state) => state.projectAreaLevels || {});
  const ruralHistoryData = useSelector((state) => state.ruralHistory || {});
  const ruralLevelEntryHistoryData = useSelector((state) => state.ruralLevelEntryHistory || {});

  useEffect(() => {
    setRural((prev) => ({
      ...prev,
      ...ruralData
    }));
  }, [ruralData]);

  useEffect(() => {
    setRuralProjects((prev) => ({
      ...prev,
      ...ruralProjectsData
    }));
  }, [ruralProjectsData]);

  useEffect(() => {
    setRuralLevelProjects((prev) => ({
      ...prev,
      ...ruralLevelProjectsData
    }));
  }, [ruralLevelProjectsData]);

  useEffect(() => {
    setRuralLevelParents((prev) => ({
      ...prev,
      ...ruralLevelParentsData
    }));
  }, [ruralLevelParentsData]);

  useEffect(() => {
    setProjectAreaLevels((prev) => ({
      ...prev,
      ...projectAreaLevelsData
    }));
  }, [projectAreaLevelsData]);

  useEffect(() => {
    setRuralHistory((prev) => ({
      ...prev,
      ...ruralHistoryData
    }));
  }, [ruralHistoryData]);

  useEffect(() => {
    setRuralLevelEntryHistory((prev) => ({
      ...prev,
      ...ruralLevelEntryHistoryData
    }));
  }, [ruralLevelEntryHistoryData]);

  return { rural, ruralProjects, ruralLevelProjects, ruralLevelParents, projectAreaLevels, ruralHistory, ruralLevelEntryHistory };
};
