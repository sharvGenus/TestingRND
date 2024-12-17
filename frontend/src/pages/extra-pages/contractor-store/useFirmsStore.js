import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useFirmsStore = () => {
  const [firmsStore, setFirmsStore] = useState({
    firmsStoreObject: {},
    error: '',
    loading: true
  });

  const firmsStoreData = useSelector((state) => state.firmsStore || {});

  useEffect(() => {
    setFirmsStore((prev) => ({
      ...prev,
      ...firmsStoreData
    }));
  }, [firmsStoreData]);

  return { firmsStore };
};
