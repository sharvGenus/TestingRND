import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useQAMasterMakerLov = () => {
  const [qaMasterMakerLovs, setQAMasterMakerLovs] = useState({
    qaMasterMakerLovsObject: {},
    error: '',
    loading: true
  });

  const [masterMakersLovsList, setMasterMakersLovsList] = useState({
    qaMasterMakersListObject: [],
    error: '',
    loading: true
  });

  const [qaMasterMakerLovHistory, setQAMasterMakerLovHistory] = useState({
    qaMasterMakerLovHistoryObject: {},
    error: '',
    loading: true
  });

  const qaMasterMakerLovsData = useSelector((state) => state.qaMasterMakerLov || {});
  const masterMakerQAsListData = useSelector((state) => state.masterMakersLovsList || {});
  const qaMasterMakerLovHistoryData = useSelector((state) => state.qaMasterMakerLovHistory || {});

  useEffect(() => {
    setQAMasterMakerLovs((prev) => ({
      ...prev,
      ...qaMasterMakerLovsData
    }));
  }, [qaMasterMakerLovsData]);

  useEffect(() => {
    setMasterMakersLovsList((prev) => ({
      ...prev,
      ...masterMakerQAsListData
    }));
  }, [masterMakerQAsListData]);

  useEffect(() => {
    setQAMasterMakerLovHistory((prev) => ({
      ...prev,
      ...qaMasterMakerLovHistoryData
    }));
  }, [qaMasterMakerLovHistoryData]);

  return { qaMasterMakerLovs, masterMakersLovsList, qaMasterMakerLovHistory };
};
