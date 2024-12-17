import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useFirms = () => {
  const [firms, setFirms] = useState({
    firmsObject: {},
    error: '',
    loading: true
  });
  const [firmsDropdown, setfirmsDropdown] = useState({
    firmsDropdownObject: [],
    error: '',
    loading: true
  });

  const firmsData = useSelector((state) => state.firms || {});
  const firmsDropdownData = useSelector((state) => state.firmsDropdown || []);

  useEffect(() => {
    setFirms((prev) => ({
      ...prev,
      ...firmsData
    }));
  }, [firmsData]);
  useEffect(() => {
    setfirmsDropdown((prev) => ({
      ...prev,
      ...firmsDropdownData
    }));
  }, [firmsDropdownData]);

  return { firms, firmsDropdown };
};
