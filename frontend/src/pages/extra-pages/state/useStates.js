import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useStates = () => {
  const [states, setStates] = useState({
    statesObject: {},
    error: '',
    loading: true
  });
  const [statesDropdown, setstatesDropdown] = useState({
    statesDropdownObject: [],
    error: '',
    loading: true
  });
  const [currentStatesDropdown, setCurrentStatesDropdown] = useState({
    currentStatesDropdownObject: [],
    error: '',
    loading: true
  });
  const [statesHistory, setStatesHistory] = useState({
    statesHistoryObject: {},
    error: '',
    loading: true
  });

  const statesData = useSelector((state) => state.states || {});
  const statesDropdownData = useSelector((state) => state.statesDropdown || []);
  const currentStatesDropdownData = useSelector((state) => state.currentStatesDropdown || []);
  const statesHistoryData = useSelector((state) => state.statesHistory || {});

  useEffect(() => {
    setStates((prev) => ({
      ...prev,
      ...statesData
    }));
  }, [statesData]);
  useEffect(() => {
    setstatesDropdown((prev) => ({
      ...prev,
      ...statesDropdownData
    }));
  }, [statesDropdownData]);
  useEffect(() => {
    setCurrentStatesDropdown((prev) => ({
      ...prev,
      ...currentStatesDropdownData
    }));
  }, [currentStatesDropdownData]);
  useEffect(() => {
    setStatesHistory((prev) => ({
      ...prev,
      ...statesHistoryData
    }));
  }, [statesHistoryData]);

  return { states, statesDropdown, currentStatesDropdown, statesHistory };
};
