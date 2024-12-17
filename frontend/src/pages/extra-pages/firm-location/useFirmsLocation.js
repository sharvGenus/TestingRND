import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useFirmLocations = () => {
  const [firmLocations, setFirmLocations] = useState({
    firmLocationsObject: {},
    error: '',
    loading: true
  });
  const [firmLocationsDropdown, setfirmLocationsDropdown] = useState({
    firmLocationsDropdownObject: [],
    error: '',
    loading: true
  });

  const firmLocationsData = useSelector((state) => state.firmLocations || {});
  const firmLocationsDropdownData = useSelector((state) => state.firmLocationsDropdown || []);

  useEffect(() => {
    setFirmLocations((prev) => ({
      ...prev,
      ...firmLocationsData
    }));
  }, [firmLocationsData]);
  useEffect(() => {
    setfirmLocationsDropdown((prev) => ({
      ...prev,
      ...firmLocationsDropdownData
    }));
  }, [firmLocationsDropdownData]);

  return { firmLocations, firmLocationsDropdown };
};
