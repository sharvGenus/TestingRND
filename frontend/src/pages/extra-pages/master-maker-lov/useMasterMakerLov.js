import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useMasterMakerLov = () => {
  const [masterMakerLovs, setMasterMakerLovs] = useState({
    masterMakerLovsObject: {},
    error: '',
    loading: true
  });
  const [masterMakerLovsList, setMasterMakerLovsList] = useState({
    masterMakerLovsObject: {},
    error: '',
    loading: true
  });
  const [masterMakerOrgType, setMasterMakerOrgType] = useState({
    masterObject: [],
    error: '',
    loading: true
  });
  const [masterMakerOrgTypeSecond, setMasterMakerOrgTypeSecond] = useState({
    masterObject: [],
    error: '',
    loading: true
  });
  const [masterMakerOrgTypeThird, setMasterMakerOrgTypeThird] = useState({
    masterObject: [],
    error: '',
    loading: true
  });
  const [masterMakerCurrency, setMasterMakerCurrency] = useState({
    currencyObject: [],
    error: '',
    loading: true
  });
  const [masterMakerGstStatus, setMasterMakerGstStatus] = useState({
    gstStatusObject: [],
    error: '',
    loading: true
  });
  const [masterMakerPaymentTerm, setMasterMakerPaymentTerm] = useState({
    paymentTermObject: [],
    error: '',
    loading: true
  });
  const [masterMakerIncoterms, setMasterMakerIncoterms] = useState({
    incotermsObject: [],
    error: '',
    loading: true
  });
  const [masterMakerTitle, setMasterMakerTitle] = useState({
    titleObject: [],
    error: '',
    loading: true
  });

  const [masterMakerLovHistory, setMasterMakerLovHistory] = useState({
    masterMakerLovHistoryObject: {},
    error: '',
    loading: true
  });

  const masterMakerLovsData = useSelector((state) => state.masterMakerLov || {});
  const masterMakerLovsDataList = useSelector((state) => state.masterMakerLovList || {});
  const masterMakerOrgTypeData = useSelector((state) => state.lovsForMasterName || []);
  const masterMakerOrgTypeDataSecond = useSelector((state) => state.lovsForMasterNameSecond || []);
  const masterMakerOrgTypeDataThird = useSelector((state) => state.lovsForMasterNameThird || []);
  const masterMakerCurrencyData = useSelector((state) => state.currency || []);
  const masterMakerGstStatusData = useSelector((state) => state.gstStatus || []);
  const masterMakerPaymentTermData = useSelector((state) => state.paymentTerm || []);
  const masterMakerIncotermsData = useSelector((state) => state.incoterms || []);
  const masterMakerTitleData = useSelector((state) => state.title || []);
  const masterMakerLovHistoryData = useSelector((state) => state.masterMakerLovHistory || {});

  useEffect(() => {
    setMasterMakerLovs((prev) => ({
      ...prev,
      ...masterMakerLovsData
    }));
  }, [masterMakerLovsData]);
  useEffect(() => {
    setMasterMakerLovsList((prev) => ({
      ...prev,
      ...masterMakerLovsDataList
    }));
  }, [masterMakerLovsDataList]);
  useEffect(() => {
    setMasterMakerOrgType((prev) => ({
      ...prev,
      ...masterMakerOrgTypeData
    }));
  }, [masterMakerOrgTypeData]);
  useEffect(() => {
    setMasterMakerOrgTypeSecond((prev) => ({
      ...prev,
      ...masterMakerOrgTypeDataSecond
    }));
  }, [masterMakerOrgTypeDataSecond]);
  useEffect(() => {
    setMasterMakerOrgTypeThird((prev) => ({
      ...prev,
      ...masterMakerOrgTypeDataThird
    }));
  }, [masterMakerOrgTypeDataThird]);
  useEffect(() => {
    setMasterMakerCurrency((prev) => ({
      ...prev,
      ...masterMakerCurrencyData
    }));
  }, [masterMakerCurrencyData]);
  useEffect(() => {
    setMasterMakerGstStatus((prev) => ({
      ...prev,
      ...masterMakerGstStatusData
    }));
  }, [masterMakerGstStatusData]);
  useEffect(() => {
    setMasterMakerPaymentTerm((prev) => ({
      ...prev,
      ...masterMakerPaymentTermData
    }));
  }, [masterMakerPaymentTermData]);
  useEffect(() => {
    setMasterMakerIncoterms((prev) => ({
      ...prev,
      ...masterMakerIncotermsData
    }));
  }, [masterMakerIncotermsData]);
  useEffect(() => {
    setMasterMakerTitle((prev) => ({
      ...prev,
      ...masterMakerTitleData
    }));
  }, [masterMakerTitleData]);

  useEffect(() => {
    setMasterMakerLovHistory((prev) => ({
      ...prev,
      ...masterMakerLovHistoryData
    }));
  }, [masterMakerLovHistoryData]);

  return {
    masterMakerLovs,
    masterMakerLovsList,
    masterMakerOrgType,
    masterMakerOrgTypeSecond,
    masterMakerOrgTypeThird,
    masterMakerCurrency,
    masterMakerGstStatus,
    masterMakerIncoterms,
    masterMakerPaymentTerm,
    masterMakerLovHistory,
    masterMakerTitle
  };
};
