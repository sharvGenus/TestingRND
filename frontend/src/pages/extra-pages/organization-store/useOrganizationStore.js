import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useOrganizationStore = () => {
  const [organizationStores, setOrganizationStores] = useState({
    organizationStoreObject: {},
    error: '',
    loading: true
  });

  const [organizationStoresAllAccess, setOrganizationStoresAllAccess] = useState({
    organizationStoreObject: {},
    error: '',
    loading: true
  });

  const [organizationStoresSecond, setOrganizationStoresSecond] = useState({
    organizationStoreObject: [],
    error: '',
    loading: true
  });

  const [organizationStoresDropdown, setOrganizationStoresDropdown] = useState({
    organizationStoreDropdownObject: {},
    error: '',
    loading: true
  });

  const [organizationStoresDropdownSecond, setOrganizationStoresDropdownSecond] = useState({
    organizationStoreDropdownSecondObject: {},
    error: '',
    loading: true
  });

  const [orgStoreDropDown, setOrgStoreDropDown] = useState({
    orgStoreDropDownObject: {},
    error: '',
    loading: true
  });

  const [orgViewStoreDropDown, setOrgViewStoreDropDown] = useState({
    orgViewStoreDropDownObject: {},
    error: '',
    loading: true
  });

  const [organizationStoresHistory, setOrganizationStoresHistory] = useState({
    organizationStoresHistoryObject: {},
    error: '',
    loading: true
  });

  const organizationStoresData = useSelector((state) => state.organizationStores || {});
  const organizationStoresDataAllAccess = useSelector((state) => state.organizationStoresAllAccess || {});
  const organizationStoresSecondData = useSelector((state) => state.organizationStoresSecond || []);
  const organizationStoresDropdownData = useSelector((state) => state.organizationStoreDropdown || []);
  const organizationStoresDropdownDataSecond = useSelector((state) => state.organizationStoreDropdownSecond || []);
  const orgStoreDropDownData = useSelector((state) => state.orgStoreDropDown || []);
  const orgViewStoreDropDownData = useSelector((state) => state.orgViewStoreDropDown || []);
  const organizationStoresHistoryData = useSelector((state) => state.organizationStoresHistory || []);

  useEffect(() => {
    setOrganizationStores((prev) => ({
      ...prev,
      ...organizationStoresData
    }));
  }, [organizationStoresData]);
  useEffect(() => {
    setOrganizationStoresAllAccess((prev) => ({
      ...prev,
      ...organizationStoresDataAllAccess
    }));
  }, [organizationStoresDataAllAccess]);

  useEffect(() => {
    setOrganizationStoresSecond((prev) => ({
      ...prev,
      ...organizationStoresSecondData
    }));
  }, [organizationStoresSecondData]);

  useEffect(() => {
    setOrganizationStoresDropdown((prev) => ({
      ...prev,
      ...organizationStoresDropdownData
    }));
  }, [organizationStoresDropdownData]);

  useEffect(() => {
    setOrganizationStoresDropdownSecond((prev) => ({
      ...prev,
      ...organizationStoresDropdownDataSecond
    }));
  }, [organizationStoresDropdownDataSecond]);

  useEffect(() => {
    setOrgStoreDropDown((prev) => ({
      ...prev,
      ...orgStoreDropDownData
    }));
  }, [orgStoreDropDownData]);

  useEffect(() => {
    setOrgViewStoreDropDown((prev) => ({
      ...prev,
      ...orgViewStoreDropDownData
    }));
  }, [orgViewStoreDropDownData]);

  useEffect(() => {
    setOrganizationStoresHistory((prev) => ({
      ...prev,
      ...organizationStoresHistoryData
    }));
  }, [organizationStoresHistoryData]);

  return {
    organizationStores,
    organizationStoresSecond,
    organizationStoresDropdown,
    orgStoreDropDown,
    orgViewStoreDropDown,
    organizationStoresHistory,
    organizationStoresAllAccess,
    organizationStoresDropdownSecond
  };
};
