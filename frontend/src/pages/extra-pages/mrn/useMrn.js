import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useMrn = () => {
  const [requestedData, setRequestedData] = useState({
    requestedDataObject: {},
    error: '',
    loading: true
  });

  const data = useSelector((state) => state.requestedData || {});
  useEffect(() => {
    setRequestedData((prev) => ({
      ...prev,
      ...data
    }));
  }, [data]);
  return { requestedData };
};
