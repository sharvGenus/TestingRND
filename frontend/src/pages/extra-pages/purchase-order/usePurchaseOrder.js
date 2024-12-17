import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const usePurchaseOrder = () => {
  const [plantCodeData, setPlantCodeData] = useState({
    plantCodeDetails: {},
    error: '',
    loading: true
  });
  const [purchaseOrderData, setpurchaseOrderData] = useState({
    purchaseOrderDetails: {},
    error: '',
    loading: true
  });

  const pcdata = useSelector((state) => state.plantCodeData || {});
  const podata = useSelector((state) => state.purchaseOrderData || {});

  useEffect(() => {
    setPlantCodeData((prev) => ({
      ...prev,
      ...pcdata
    }));
  }, [pcdata]);

  useEffect(() => {
    setpurchaseOrderData((prev) => ({
      ...prev,
      ...podata
    }));
  }, [podata]);

  return { plantCodeData, purchaseOrderData };
};
