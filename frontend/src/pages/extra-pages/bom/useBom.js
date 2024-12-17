import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useBom = () => {
  const [materialQuantities, setMaterialQuantities] = useState({
    materialQuantitiesObject: {},
    error: '',
    loading: true
  });

  const [materialQuantitiesByCondition, setMaterialQuantitiesByCondition] = useState({
    materialQuantitiesByConditionObject: [],
    error: '',
    loading: true
  });

  const materialQuantitiesData = useSelector((state) => state.materialQuantities || []);
  const materialQuantitiesByConditionData = useSelector((state) => state.materialQuantitiesByCondition || []);

  useEffect(() => {
    setMaterialQuantities((prev) => ({
      ...prev,
      ...materialQuantitiesData
    }));
  }, [materialQuantitiesData]);

  useEffect(() => {
    setMaterialQuantitiesByCondition((prev) => ({
      ...prev,
      ...materialQuantitiesByConditionData
    }));
  }, [materialQuantitiesByConditionData]);

  return { materialQuantities, materialQuantitiesByCondition };
};
