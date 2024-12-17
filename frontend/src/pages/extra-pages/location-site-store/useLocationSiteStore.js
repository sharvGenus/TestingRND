import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useLocationSiteStore = () => {
  const [locationSiteStore, setLocationSiteStore] = useState({
    locationSiteStoreObject: {},
    error: '',
    loading: true
  });
  const [locationSiteStoreDropdown, setlocationSiteStoreDropdown] = useState({
    locationSiteStoreDropdownObject: [],
    error: '',
    loading: true
  });

  const locationSiteStoreData = useSelector((state) => state.locationSiteStore || {});
  const locationSiteStoreDropdownData = useSelector((state) => state.locationSiteStoreDropdown || []);

  useEffect(() => {
    setLocationSiteStore((prev) => ({
      ...prev,
      ...locationSiteStoreData
    }));
  }, [locationSiteStoreData]);
  useEffect(() => {
    setlocationSiteStoreDropdown((prev) => ({
      ...prev,
      ...locationSiteStoreDropdownData
    }));
  }, [locationSiteStoreDropdownData]);

  return { locationSiteStore, locationSiteStoreDropdown };
};
