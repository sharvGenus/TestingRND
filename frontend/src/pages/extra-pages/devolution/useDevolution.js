import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useDevolution = () => {
  const [devolutionConfigList, setDevolutionConfigList] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const [devolutionMappingList, setDevolutionMappingList] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const [devolutionList, setDevolutionList] = useState({
    stocksObject: {},
    error: '',
    loading: true
  });

  const devolutionConfigListData = useSelector((state) => state.devolutionConfig || []);
  const devolutionMappingListData = useSelector((state) => state.devolutionMapping || []);
  const devolutionListData = useSelector((state) => state.devolutionList || []);

  useEffect(() => {
    setDevolutionConfigList((prev) => ({
      ...prev,
      ...devolutionConfigListData
    }));
  }, [devolutionConfigListData]);

  useEffect(() => {
    setDevolutionMappingList((prev) => ({
      ...prev,
      ...devolutionMappingListData
    }));
  }, [devolutionMappingListData]);

  useEffect(() => {
    setDevolutionList((prev) => ({
      ...prev,
      ...devolutionListData
    }));
  }, [devolutionListData]);

  return {
    devolutionConfigList,
    devolutionMappingList,
    devolutionList
  };
};
