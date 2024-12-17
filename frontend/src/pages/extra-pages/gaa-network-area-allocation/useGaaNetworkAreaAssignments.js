import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useGaaNetworkAreaAssignments = () => {
  const [gaaNetworkAreaAllocation, setGaaNetworkAreaAllocation] = useState({
    gaaNetworkAreaAllocationObject: {},
    error: '',
    loading: true
  });

  const gaaNetworkAreaAllocationData = useSelector((state) => state.gaaNetworkAreaAllocation || {});

  useEffect(() => {
    setGaaNetworkAreaAllocation((prev) => ({
      ...prev,
      ...gaaNetworkAreaAllocationData
    }));
  }, [gaaNetworkAreaAllocationData]);

  return { gaaNetworkAreaAllocation };
};
