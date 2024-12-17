import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useOrganizationStoreLocation = () => {
  // Organization Store Location One
  const [companyStoreLocations, setCompanyStoreLocations] = useState({
    companyStoreLocationsObject: {},
    error: '',
    loading: true
  });
  const companyStoreLocationsData = useSelector((state) => state.companyStoreLocations || {});
  useEffect(() => {
    setCompanyStoreLocations((prev) => ({
      ...prev,
      ...companyStoreLocationsData
    }));
  }, [companyStoreLocationsData]);

  // Organization Store Location Two
  const [firmStoreLocations, setFirmStoreLocations] = useState({
    firmStoreLocationsObject: {},
    error: '',
    loading: true
  });
  const firmStoreLocationsData = useSelector((state) => state.firmStoreLocations || {});
  useEffect(() => {
    setFirmStoreLocations((prev) => ({
      ...prev,
      ...firmStoreLocationsData
    }));
  }, [firmStoreLocationsData]);

  // History of Organization Store Location

  const [organizationStoreLocationsHistory, setOrganizationStoreLocationsHistory] = useState({
    organizationStoreLocationsHistoryObject: {},
    error: '',
    loading: true
  });

  const organizationStoreLocationsHistoryData = useSelector((state) => state.organizationStoreLocationsHistory || []);

  useEffect(() => {
    setOrganizationStoreLocationsHistory((prev) => ({
      ...prev,
      ...organizationStoreLocationsHistoryData
    }));
  }, [organizationStoreLocationsHistoryData]);

  return { companyStoreLocations, firmStoreLocations, organizationStoreLocationsHistory };
};
