import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useTransactionTypeRange = () => {
  const [transactionTypeRange, setTransactionTypeRange] = useState({
    transactionTypeRangesObject: {},
    error: '',
    loading: true
  });

  const [transactionTypeRangeHistory, setTransactionTypeRangeHistory] = useState({
    transactionTypeRangeHistoryObject: {},
    error: '',
    loading: true
  });

  const transactionTypeRangeData = useSelector((state) => state.transactionTypeRange || {});
  const transactionTypeRangeHistoryData = useSelector((state) => state.transactionTypeRangeHistory || {});

  useEffect(() => {
    setTransactionTypeRange((prev) => ({
      ...prev,
      ...transactionTypeRangeData
    }));
  }, [transactionTypeRangeData]);

  useEffect(() => {
    setTransactionTypeRangeHistory((prev) => ({
      ...prev,
      ...transactionTypeRangeHistoryData
    }));
  }, [transactionTypeRangeHistoryData]);

  return { transactionTypeRange, transactionTypeRangeHistory };
};
