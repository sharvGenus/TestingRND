import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCustomerStore = () => {
  const [customerStore, setCustomerStore] = useState({
    customerStoreObject: {},
    error: '',
    loading: true
  });

  const customerStoreData = useSelector((state) => state.customerStore || {});

  useEffect(() => {
    setCustomerStore((prev) => ({
      ...prev,
      ...customerStoreData
    }));
  }, [customerStoreData]);

  return { customerStore };
};
