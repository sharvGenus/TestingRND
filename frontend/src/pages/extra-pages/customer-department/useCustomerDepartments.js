import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCustomerDepartments = () => {
  const [customerDepartments, setCustomerDepartments] = useState({
    customerDepartmentsObject: {},
    error: '',
    loading: true
  });

  const [customerDepartmentsDropdown, setCustomerDepartmentsDropdown] = useState({
    customerDepartmentsDropdownObject: [],
    error: '',
    loading: true
  });

  const [customerDepartmentsHistory, setCustomerDepartmentsHistory] = useState({
    customerDepartmentsHistoryObject: {},
    error: '',
    loading: true
  });

  const [customerWiseCustomerDepartments, setCustomerWiseCustomerDepartments] = useState({
    customerWiseCustomerDepartmentsObject: {},
    error: '',
    loading: true
  });

  const customerDepartmentsData = useSelector((state) => state.customerDepartments || {});
  const customerDepartmentsDropdownData = useSelector((state) => state.customerDepartmentsDropdown || {});
  const customerDepartmentsHistoryData = useSelector((state) => state.customerDepartmentsHistory || {});
  const customerWiseCustomerDepartmentsData = useSelector((state) => state.customerWiseCustomerDepartments || {});

  useEffect(() => {
    setCustomerDepartments((prev) => ({
      ...prev,
      ...customerDepartmentsData
    }));
  }, [customerDepartmentsData]);

  useEffect(() => {
    setCustomerDepartmentsDropdown((prev) => ({
      ...prev,
      ...customerDepartmentsDropdownData
    }));
  }, [customerDepartmentsDropdownData]);

  useEffect(() => {
    setCustomerDepartmentsHistory((prev) => ({
      ...prev,
      ...customerDepartmentsHistoryData
    }));
  }, [customerDepartmentsHistoryData]);

  useEffect(() => {
    setCustomerWiseCustomerDepartments((prev) => ({
      ...prev,
      ...customerWiseCustomerDepartmentsData
    }));
  }, [customerWiseCustomerDepartmentsData]);

  return { customerDepartments, customerDepartmentsDropdown, customerDepartmentsHistory, customerWiseCustomerDepartments };
};
