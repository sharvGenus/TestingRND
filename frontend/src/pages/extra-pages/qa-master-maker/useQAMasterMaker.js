import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useQAMasterMaker = () => {
  const [masterMakerQAs, setMasterMakerQAs] = useState({
    qaMasterMakerObject: {},
    error: '',
    loading: true
  });

  const [qaMasterMakerHistory, setQAMasterMakerHistory] = useState({
    qaMasterMakerHistoryObject: {},
    error: '',
    loading: true
  });

  const masterMakerQAsData = useSelector((state) => state.qaMasterMaker || {});
  const qaMasterMakerHistoryData = useSelector((state) => state.qaMasterMakerHistory || {});

  useEffect(() => {
    setMasterMakerQAs((prev) => ({
      ...prev,
      ...masterMakerQAsData
    }));
  }, [masterMakerQAsData]);

  useEffect(() => {
    setQAMasterMakerHistory((prev) => ({
      ...prev,
      ...qaMasterMakerHistoryData
    }));
  }, [qaMasterMakerHistoryData]);

  return { masterMakerQAs, qaMasterMakerHistory };
};
