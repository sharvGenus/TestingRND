import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useOrganizationLocation = () => {
  const [organizationLocations, setOrganizationLocations] = useState({
    organizationLocationsObject: {},
    error: '',
    loading: true
  });

  const [organizationLocationsHistory, setOrganizationLocationsHistory] = useState({
    organizationLocationsHistoryObject: {},
    error: '',
    loading: true
  });

  const organizationLocationsData = useSelector((state) => state.organizationLocations || {});
  const organizationLocationsHistoryData = useSelector((state) => state.organizationLocationsHistory || []);

  useEffect(() => {
    setOrganizationLocations((prev) => ({
      ...prev,
      ...organizationLocationsData
    }));
  }, [organizationLocationsData]);

  useEffect(() => {
    setOrganizationLocationsHistory((prev) => ({
      ...prev,
      ...organizationLocationsHistoryData
    }));
  }, [organizationLocationsHistoryData]);

  return { organizationLocations, organizationLocationsHistory };
};
