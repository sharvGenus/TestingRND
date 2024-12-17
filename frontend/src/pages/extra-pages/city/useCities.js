import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCities = () => {
  const [cities, setCities] = useState({
    citiesObject: {},
    error: '',
    loading: true
  });
  const [citiesDropdown, setCitiesDropdown] = useState({
    citiesDropdownObject: [],
    error: '',
    loading: true
  });
  const [currentCitiesDropdown, setCurrentCitiesDropdown] = useState({
    currentCitiesDropdownObject: [],
    error: '',
    loading: true
  });
  const [citiesHistory, setCitiesHistory] = useState({
    countriesHistoryObject: {},
    error: '',
    loading: true
  });

  const citiesData = useSelector((state) => state.cities || {});
  const citiesDropdownData = useSelector((state) => state.citiesDropdown || []);
  const currentCitiesDropdownData = useSelector((state) => state.currentCitiesDropdown || []);
  const citiesHistoryData = useSelector((state) => state.citiesHistory || {});

  useEffect(() => {
    setCities((prev) => ({
      ...prev,
      ...citiesData
    }));
  }, [citiesData]);

  useEffect(() => {
    setCitiesDropdown((prev) => ({
      ...prev,
      ...citiesDropdownData
    }));
  }, [citiesDropdownData]);
  useEffect(() => {
    setCurrentCitiesDropdown((prev) => ({
      ...prev,
      ...currentCitiesDropdownData
    }));
  }, [currentCitiesDropdownData]);

  useEffect(() => {
    setCitiesHistory((prev) => ({
      ...prev,
      ...citiesHistoryData
    }));
  }, [citiesHistoryData]);

  return { cities, citiesDropdown, currentCitiesDropdown, citiesHistory };
};
