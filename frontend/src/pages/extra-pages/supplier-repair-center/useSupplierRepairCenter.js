import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSupplierRepairCenter = () => {
  const [supplierRepairCenter, setSupplierRepairCenter] = useState({
    supplierRepairCenter: {},
    error: '',
    loading: true
  });

  const supplierRepairCenterData = useSelector((state) => state.supplierRepairCenter || {});

  useEffect(() => {
    setSupplierRepairCenter((prev) => ({
      ...prev,
      ...supplierRepairCenterData
    }));
  }, [supplierRepairCenterData]);

  return { supplierRepairCenter };
};
