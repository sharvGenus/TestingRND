import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCustomers = () => {
  const [customers, setCustomers] = useState({
    customersObject: {},
    error: '',
    loading: true
  });
  const [customersDropdown, setCustomersDropdown] = useState({
    customersDropdownObject: [],
    error: '',
    loading: true
  });

  const customersData = useSelector((state) => state.customers || {});
  const customersDropdownData = useSelector((state) => state.customersDropdown || []);

  useEffect(() => {
    setCustomers((prev) => ({
      ...prev,
      ...customersData
    }));
  }, [customersData]);

  useEffect(() => {
    setCustomersDropdown((prev) => ({
      ...prev,
      ...customersDropdownData
    }));
  }, [customersDropdownData]);

  return { customers, customersDropdown };
};
