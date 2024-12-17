import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useBillSubmissions = () => {
  const [billSubmissions, setBillSubmissions] = useState({
    billSubmissionsObject: {},
    error: '',
    loading: true
  });
  const [billMaterialSubmissions, setBillSubmissionsDropdown] = useState({
    billMaterialSubmissionsObject: {},
    error: '',
    loading: true
  });

  const billSubmissionsData = useSelector((state) => state.billSubmissions || {});
  const billMaterialSubmissionsData = useSelector((state) => state.billMaterialSubmissions || {});

  useEffect(() => {
    setBillSubmissions((prev) => ({
      ...prev,
      ...billSubmissionsData
    }));
  }, [billSubmissionsData]);

  useEffect(() => {
    setBillSubmissionsDropdown((prev) => ({
      ...prev,
      ...billMaterialSubmissionsData
    }));
  }, [billMaterialSubmissionsData]);

  return { billSubmissions, billMaterialSubmissions };
};
