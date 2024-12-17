import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSupplier = () => {
  const [supplier, setSupplier] = useState({
    supplierObject: {},
    error: '',
    loading: true
  });
  const [supplierDropdown, setsupplierDropdown] = useState({
    supplierDropdownObject: [],
    error: '',
    loading: true
  });

  const supplierData = useSelector((state) => state.supplier || {});
  const supplierDropdownData = useSelector((state) => state.supplierDropdown || []);

  useEffect(() => {
    setSupplier((prev) => ({
      ...prev,
      ...supplierData
    }));
  }, [supplierData]);
  useEffect(() => {
    setsupplierDropdown((prev) => ({
      ...prev,
      ...supplierDropdownData
    }));
  }, [supplierDropdownData]);

  return { supplier, supplierDropdown };
};
