import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCountries = () => {
  const [countries, setCountries] = useState({
    countriesObject: {},
    error: '',
    loading: true
  });
  const [countriesDropdown, setCountriesDropdown] = useState({
    countriesDropdownObject: [],
    error: '',
    loading: true
  });
  const [countriesHistory, setCountriesHistory] = useState({
    countriesHistoryObject: {},
    error: '',
    loading: true
  });

  const countriesData = useSelector((state) => state.countries || {});
  const countriesDropdownData = useSelector((state) => state.countriesDropdown || []);
  const countriesHistoryData = useSelector((state) => state.countriesHistory || {});

  useEffect(() => {
    setCountries((prev) => ({
      ...prev,
      ...countriesData
    }));
  }, [countriesData]);

  useEffect(() => {
    setCountriesDropdown((prev) => ({
      ...prev,
      ...countriesDropdownData
    }));
  }, [countriesDropdownData]);

  useEffect(() => {
    setCountriesHistory((prev) => ({
      ...prev,
      ...countriesHistoryData
    }));
  }, [countriesHistoryData]);

  return { countries, countriesDropdown, countriesHistory };
};
