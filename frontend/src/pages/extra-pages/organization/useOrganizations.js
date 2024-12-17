import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationsAllData, setOrganizationsAllData] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationsAllDataSecond, setOrganizationsAllDataSecond] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationsLocByParent, setOrganizationsLocByParent] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationsLocByParentSecond, setOrganizationsLocByParentSecond] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationsLocation, setOrganizationsLocation] = useState({
    organizationLocationObject: {},
    error: '',
    loading: true
  });

  const [organizationsGetListData, setOrganizationsGetListData] = useState({
    organizationGetListObject: {},
    error: '',
    loading: true
  });
  const [organizationsDropdown, setOrganizationsDropdown] = useState({
    organizationDropdownObject: [],
    error: '',
    loading: true
  });

  const [organizationsLocationDropdown, setOrganizationsLocationDropdown] = useState({
    organizationLocationDropdownObject: [],
    error: '',
    loading: true
  });

  const [organizationsDropdownSecond, setOrganizationsDropdownSecond] = useState({
    organizationDropdownSecondObject: [],
    error: '',
    loading: true
  });

  const [organizationsLocationDropdownSecond, setOrganizationsLocationDropdownSecond] = useState({
    organizationLocationDropdownObject: [],
    error: '',
    loading: true
  });

  const [organizationsList, setOrganizationsList] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });
  const [organizationsListSecond, setOrganizationsListSecond] = useState({
    organizationObject: {},
    error: '',
    loading: true
  });

  const [organizationHistory, setOrganizationsHistory] = useState({
    organizationHistoryObject: {},
    error: '',
    loading: true
  });

  const organizationsData = useSelector((state) => state.organization || []);
  const organizationsAllListdata = useSelector((state) => state.organizationAllData || []);
  const organizationsAllListdataSecond = useSelector((state) => state.organizationAllDataSecond || []);
  const organizationsLocDataByParent = useSelector((state) => state.organizationLocationByParent || []);
  const organizationsLocDataByParentSecond = useSelector((state) => state.organizationLocationByParentSecond || []);
  const organizationsLocationData = useSelector((state) => state.organizationLocation || []);
  const organizationsGetDataList = useSelector((state) => state.organizationListData || []);
  const organizationsListData = useSelector((state) => state.organizationList || []);
  const organizationsDropdownData = useSelector((state) => state.organizationDropdown || []);
  const organizationsLocationDropdownData = useSelector((state) => state.organizationLocationDropdown || []);
  const organizationsLocationDropdownSecondData = useSelector((state) => state.organizationLocationDropdownSecond || []);
  const organizationsDropdownSecondData = useSelector((state) => state.organizationDropdownSecond || []);
  const organizationListSecondData = useSelector((state) => state.organizationListSecond || []);
  const organizationHistoryData = useSelector((state) => state.organizationHistory || []);

  useEffect(() => {
    setOrganizations((prev) => ({
      ...prev,
      ...organizationsData
    }));
  }, [organizationsData]);

  useEffect(() => {
    setOrganizationsAllData((prev) => ({
      ...prev,
      ...organizationsAllListdata
    }));
  }, [organizationsAllListdata]);

  useEffect(() => {
    setOrganizationsAllDataSecond((prev) => ({
      ...prev,
      ...organizationsAllListdataSecond
    }));
  }, [organizationsAllListdataSecond]);

  useEffect(() => {
    setOrganizationsLocByParent((prev) => ({
      ...prev,
      ...organizationsLocDataByParent
    }));
  }, [organizationsLocDataByParent]);

  useEffect(() => {
    setOrganizationsLocByParentSecond((prev) => ({
      ...prev,
      ...organizationsLocDataByParentSecond
    }));
  }, [organizationsLocDataByParentSecond]);

  useEffect(() => {
    setOrganizationsLocation((prev) => ({
      ...prev,
      ...organizationsLocationData
    }));
  }, [organizationsLocationData]);

  useEffect(() => {
    setOrganizationsGetListData((prev) => ({
      ...prev,
      ...organizationsGetDataList
    }));
  }, [organizationsGetDataList]);

  useEffect(() => {
    setOrganizationsDropdown((prev) => ({
      ...prev,
      ...organizationsDropdownData
    }));
  }, [organizationsDropdownData]);

  useEffect(() => {
    setOrganizationsLocationDropdown((prev) => ({
      ...prev,
      ...organizationsLocationDropdownData
    }));
  }, [organizationsLocationDropdownData]);

  useEffect(() => {
    setOrganizationsLocationDropdownSecond((prev) => ({
      ...prev,
      ...organizationsLocationDropdownSecondData
    }));
  }, [organizationsLocationDropdownSecondData]);

  useEffect(() => {
    setOrganizationsDropdownSecond((prev) => ({
      ...prev,
      ...organizationsDropdownSecondData
    }));
  }, [organizationsDropdownSecondData]);

  useEffect(() => {
    setOrganizationsList((prev) => ({
      ...prev,
      ...organizationsListData
    }));
  }, [organizationsListData]);

  useEffect(() => {
    setOrganizationsListSecond((prev) => ({
      ...prev,
      ...organizationListSecondData
    }));
  }, [organizationListSecondData]);

  useEffect(() => {
    setOrganizationsHistory((prev) => ({
      ...prev,
      ...organizationHistoryData
    }));
  }, [organizationHistoryData]);

  return {
    organizations,
    organizationsAllData,
    organizationsAllDataSecond,
    organizationsLocByParent,
    organizationsLocByParentSecond,
    organizationsGetListData,
    organizationsDropdown,
    organizationsDropdownSecond,
    organizationsList,
    organizationsListSecond,
    organizationHistory,
    organizationsLocation,
    organizationsLocationDropdown,
    organizationsLocationDropdownSecond
  };
};
