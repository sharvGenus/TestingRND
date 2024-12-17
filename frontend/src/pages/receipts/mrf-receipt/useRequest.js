import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useRequest = () => {
  const [transactionRequest, setTransactionRequest] = useState({
    requestDetails: {},
    error: '',
    loading: true
  });

  const requestData = useSelector((state) => state.requestList || {});
  useEffect(() => {
    setTransactionRequest((prev) => ({
      ...prev,
      ...requestData
    }));
  }, [requestData]);

  return { transactionRequest };
};
