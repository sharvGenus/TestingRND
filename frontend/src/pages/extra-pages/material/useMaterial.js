import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useMaterial = () => {
  const [material, setMaterial] = useState({
    materialObject: {},
    error: '',
    loading: true
  });
  const [materialContent, setMaterialContent] = useState({
    materialObject: {},
    error: '',
    loading: true
  });

  const [materialDropdown, setmaterialDropdown] = useState({
    materialDropdownObject: [],
    error: '',
    loading: true
  });
  const [uomDropdown, setuomDropdown] = useState({
    uomDropdownObject: [],
    error: '',
    loading: true
  });
  const [materialTypeDropdown, setMaterialTypeDropdown] = useState({
    materialTypeDropdownObject: [],
    error: '',
    loading: true
  });

  const [materialHistory, setMaterialHistory] = useState({
    materialHistoryObject: {},
    error: '',
    loading: true
  });

  const materialData = useSelector((state) => state.material || {});
  const materialDataSet = useSelector((state) => state.materialByIntegrationId || {});
  const materialDropdownData = useSelector((state) => state.materialDropdown || []);
  const uomDropdownData = useSelector((state) => state.uomDropdown || []);
  const materialTypeDropdownData = useSelector((state) => state.materialTypeDropdown || []);
  const materialHistoryData = useSelector((state) => state.materialHistory || {});

  useEffect(() => {
    setMaterial((prev) => ({
      ...prev,
      ...materialData
    }));
  }, [materialData]);
  useEffect(() => {
    setMaterialContent((prev) => ({
      ...prev,
      ...materialDataSet
    }));
  }, [materialDataSet]);
  useEffect(() => {
    setmaterialDropdown((prev) => ({
      ...prev,
      ...materialDropdownData
    }));
  }, [materialDropdownData]);
  useEffect(() => {
    setuomDropdown((prev) => ({
      ...prev,
      ...uomDropdownData
    }));
  }, [uomDropdownData]);
  useEffect(() => {
    setMaterialTypeDropdown((prev) => ({
      ...prev,
      ...materialTypeDropdownData
    }));
  }, [materialTypeDropdownData]);

  useEffect(() => {
    setMaterialHistory((prev) => ({
      ...prev,
      ...materialHistoryData
    }));
  }, [materialHistoryData]);

  return { material, materialDropdown, uomDropdown, materialTypeDropdown, materialContent, materialHistory };
};
