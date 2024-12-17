import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCompanies = () => {
  const [companies, setCompanies] = useState({
    companiesObject: {},
    error: '',
    loading: true
  });
  const [companiesDropdown, setCompaniesDropdown] = useState({
    companiesDropdownObject: [],
    error: '',
    loading: true
  });

  const companiesData = useSelector((state) => state.companies || {});
  const companiesDropdownData = useSelector((state) => state.companiesDropdown || []);

  useEffect(() => {
    setCompanies((prev) => ({
      ...prev,
      ...companiesData
    }));
  }, [companiesData]);

  useEffect(() => {
    setCompaniesDropdown((prev) => ({
      ...prev,
      ...companiesDropdownData
    }));
  }, [companiesDropdownData]);

  return { companies, companiesDropdown };
};
