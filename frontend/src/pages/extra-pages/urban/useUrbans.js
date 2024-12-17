import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useUrbans = () => {
  const [urbans, setUrbans] = useState({
    urbansObject: {},
    error: '',
    loading: true
  });

  const [urbanProjects, setUrbanProjects] = useState({
    urbanProjectsObject: [],
    error: '',
    loading: true
  });

  const [urbanLevelProjects, setUrbanLevelProjects] = useState({
    urbanLevelProjectsObject: [],
    error: '',
    loading: true
  });

  const [urbanLevelParents, setUrbanLevelParents] = useState({
    urbanLevelParentsObject: [],
    error: '',
    loading: true
  });

  const [urbanHistory, setUrbanHistory] = useState({
    urbanHistoryObject: {},
    error: '',
    loading: true
  });

  const [urbanLevelEntryHistory, setUrbanLevelEntryHistory] = useState({
    urbanLevelEntryHistoryObject: {},
    error: '',
    loading: true
  });

  const urbansData = useSelector((state) => state.urbans || {});
  const urbanProjectsData = useSelector((state) => state.urbanProjects || {});
  const urbanLevelProjectsData = useSelector((state) => state.urbanLevelProjects || {});
  const urbanLevelParentsData = useSelector((state) => state.urbanLevelParents || {});
  const urbanHistoryData = useSelector((state) => state.urbanHistory || {});
  const urbanLevelEntryHistoryData = useSelector((state) => state.urbanLevelEntryHistory || {});

  useEffect(() => {
    setUrbans((prev) => ({
      ...prev,
      ...urbansData
    }));
  }, [urbansData]);

  useEffect(() => {
    setUrbanProjects((prev) => ({
      ...prev,
      ...urbanProjectsData
    }));
  }, [urbanProjectsData]);

  useEffect(() => {
    setUrbanLevelProjects((prev) => ({
      ...prev,
      ...urbanLevelProjectsData
    }));
  }, [urbanLevelProjectsData]);

  useEffect(() => {
    setUrbanLevelParents((prev) => ({
      ...prev,
      ...urbanLevelParentsData
    }));
  }, [urbanLevelParentsData]);

  useEffect(() => {
    setUrbanHistory((prev) => ({
      ...prev,
      ...urbanHistoryData
    }));
  }, [urbanHistoryData]);

  useEffect(() => {
    setUrbanLevelEntryHistory((prev) => ({
      ...prev,
      ...urbanLevelEntryHistoryData
    }));
  }, [urbanLevelEntryHistoryData]);

  return { urbans, urbanProjects, urbanLevelProjects, urbanLevelParents, urbanHistory, urbanLevelEntryHistory };
};
