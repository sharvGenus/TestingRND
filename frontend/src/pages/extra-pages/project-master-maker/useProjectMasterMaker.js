import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useProjectMasterMaker = () => {
  const [projectMasterMakers, setProjectMasterMakers] = useState({
    projectMasterMakerObject: {},
    error: '',
    loading: true
  });

  const [masterMakerProjects, setMasterMakerProjects] = useState({
    masterMakerProjectsObject: [],
    error: '',
    loading: true
  });

  const [projectMasterMakerHistory, setProjectMasterMakerHistory] = useState({
    projectMasterMakerHistoryObject: {},
    error: '',
    loading: true
  });

  const projectMasterMakersData = useSelector((state) => state.projectMasterMaker || {});
  const masterMakerProjectsData = useSelector((state) => state.masterMakerProjects || {});
  const projectMasterMakerHistoryData = useSelector((state) => state.projectMasterMakerHistory || {});

  useEffect(() => {
    setProjectMasterMakers((prev) => ({
      ...prev,
      ...projectMasterMakersData
    }));
  }, [projectMasterMakersData]);

  useEffect(() => {
    setMasterMakerProjects((prev) => ({
      ...prev,
      ...masterMakerProjectsData
    }));
  }, [masterMakerProjectsData]);

  useEffect(() => {
    setProjectMasterMakerHistory((prev) => ({
      ...prev,
      ...projectMasterMakerHistoryData
    }));
  }, [projectMasterMakerHistoryData]);

  return { projectMasterMakers, masterMakerProjects, projectMasterMakerHistory };
};
