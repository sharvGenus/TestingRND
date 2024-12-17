import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useProjectMasterMakerLov = () => {
  const [projectMasterMakerLovs, setProjectMasterMakerLovs] = useState({
    projectMasterMakerLovsObject: {},
    error: '',
    loading: true
  });

  const [masterMakersLovsList, setMasterMakersLovsList] = useState({
    projectMasterMakersListObject: [],
    error: '',
    loading: true
  });

  const [projectMasterMakerLovHistory, setProjectMasterMakerLovHistory] = useState({
    projectMasterMakerLovHistoryObject: {},
    error: '',
    loading: true
  });

  const projectMasterMakerLovsData = useSelector((state) => state.projectMasterMakerLov || {});
  const masterMakerProjectsListData = useSelector((state) => state.masterMakersLovsList || {});
  const projectMasterMakerLovHistoryData = useSelector((state) => state.projectMasterMakerLovHistory || {});

  useEffect(() => {
    setProjectMasterMakerLovs((prev) => ({
      ...prev,
      ...projectMasterMakerLovsData
    }));
  }, [projectMasterMakerLovsData]);

  useEffect(() => {
    setMasterMakersLovsList((prev) => ({
      ...prev,
      ...masterMakerProjectsListData
    }));
  }, [masterMakerProjectsListData]);

  useEffect(() => {
    setProjectMasterMakerLovHistory((prev) => ({
      ...prev,
      ...projectMasterMakerLovHistoryData
    }));
  }, [projectMasterMakerLovHistoryData]);

  return { projectMasterMakerLovs, masterMakersLovsList, projectMasterMakerLovHistory };
};
