import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCustomerDesignations = () => {
  const [customerDesignations, setCustomerDesignations] = useState({
    customerDesignationsObject: {},
    error: '',
    loading: true
  });

  const [customerDesignationHistory, setCustomerDesignationHistory] = useState({
    customerDesignationHistoryObject: {},
    error: '',
    loading: true
  });

  const [departmentWiseCustomerDesignations, setDepartmentWiseCustomerDesignations] = useState({
    departmentWiseCustomerDesignationsObject: {},
    error: '',
    loading: true
  });

  const customerDesignationsData = useSelector((state) => state.customerDesignations || {});
  const customerDesignationHistoryData = useSelector((state) => state.customerDesignationHistory || {});
  const departmentWiseCustomerDesignationsData = useSelector((state) => state.departmentWiseCustomerDesignations || {});

  useEffect(() => {
    setCustomerDesignations((prev) => ({
      ...prev,
      ...customerDesignationsData
    }));
  }, [customerDesignationsData]);

  useEffect(() => {
    setCustomerDesignationHistory((prev) => ({
      ...prev,
      ...customerDesignationHistoryData
    }));
  }, [customerDesignationHistoryData]);

  useEffect(() => {
    setDepartmentWiseCustomerDesignations((prev) => ({
      ...prev,
      ...departmentWiseCustomerDesignationsData
    }));
  }, [departmentWiseCustomerDesignationsData]);

  return { customerDesignations, customerDesignationHistory, departmentWiseCustomerDesignations };
};
