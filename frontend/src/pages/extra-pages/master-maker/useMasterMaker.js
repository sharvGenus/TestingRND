import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useMasterMaker = () => {
  const [masterMakers, setMasterMakers] = useState({
    masterMakerObject: {},
    error: '',
    loading: true
  });

  const [masterMakerHistory, setMasterMakerHistory] = useState({
    masterMakerHistoryObject: {},
    error: '',
    loading: true
  });

  const masterMakersData = useSelector((state) => state.masterMaker || {});
  const masterMakerHistoryData = useSelector((state) => state.masterMakerHistory || {});

  useEffect(() => {
    setMasterMakers((prev) => ({
      ...prev,
      ...masterMakersData
    }));
  }, [masterMakersData]);

  useEffect(() => {
    setMasterMakerHistory((prev) => ({
      ...prev,
      ...masterMakerHistoryData
    }));
  }, [masterMakerHistoryData]);

  return { masterMakers, masterMakerHistory };
};
