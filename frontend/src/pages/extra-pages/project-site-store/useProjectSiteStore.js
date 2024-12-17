import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useProjectSiteStore = () => {
  const [projectSiteStore, setProjectSiteStore] = useState({
    projectSiteStoreObject: {},
    error: '',
    loading: true
  });
  const [projectSiteStoreDropdown, setprojectSiteStoreDropdown] = useState({
    projectSiteStoreDropdownObject: [],
    error: '',
    loading: true
  });

  const projectSiteStoreData = useSelector((state) => state.projectSiteStore || {});
  const projectSiteStoreDropdownData = useSelector((state) => state.projectSiteStoreDropdown || []);

  useEffect(() => {
    setProjectSiteStore((prev) => ({
      ...prev,
      ...projectSiteStoreData
    }));
  }, [projectSiteStoreData]);
  useEffect(() => {
    setprojectSiteStoreDropdown((prev) => ({
      ...prev,
      ...projectSiteStoreDropdownData
    }));
  }, [projectSiteStoreDropdownData]);

  return { projectSiteStore, projectSiteStoreDropdown };
};
