import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useDefaultFormAttributes = () => {
  const [forms, setForms] = useState({
    formDataObject: [],
    error: '',
    loading: true
  });
  const [dropdownLov, setDropdownLov] = useState({
    dropdownLovDataObject: [],
    sourceColumnByIdObject: {},
    error: '',
    loading: true
  });
  const [payloadParentDropdown, setPayloadParentDropdown] = useState({
    payloadParentDataObject: [],
    error: '',
    loading: true
  });
  const [webforms, setwebforms] = useState({
    webformDataObject: [],
    error: '',
    loading: true
  });
  const [formDetail, setFormDetail] = useState({
    formDetailObject: [],
    error: '',
    loading: true
  });
  const [defaultFormAttributes, setDefaultAttributes] = useState({
    defaultFormAttributesObject: [],
    error: '',
    loading: true
  });
  const [formAttributes, setFormAttributes] = useState({
    formAttributesObject: [],
    error: '',
    loading: true
  });
  const [formValidationBlock, setFormValidationBlock] = useState({
    formValidationBlockObject: [],
    error: '',
    loading: true
  });
  const [formVisibilityBlock, setFormVisibilityBlock] = useState({
    formVisibilityBlockObject: [],
    error: '',
    loading: true
  });
  const [formIntegrationBlock, setFormIntegrationBlock] = useState({
    formIntegrationBlockObject: [],
    error: '',
    loading: true
  });
  const [formIntegrationBlockById, setFormIntegrationBlockById] = useState({
    formIntegrationBlockByIdObject: {},
    error: '',
    loading: true
  });
  const [attributeIntegrationCondition, setAttributeIntegrationCondition] = useState({
    formAttributeIntegrationConditionObject: [],
    error: '',
    loading: true
  });
  const [attributeIntegrationPayload, setAttributeIntegrationPayload] = useState({
    formAttributeIntegrationPayloadObject: [],
    error: '',
    loading: true
  });
  const [attributeValidationCondition, setAttributeValidationCondition] = useState({
    formAttributeValidationConditionObject: [],
    error: '',
    loading: true
  });
  const [attributeVisibilityCondition, setAttributeVisibilityCondition] = useState({
    formAttributeVisibilityConditionObject: [],
    error: '',
    loading: true
  });

  const [allMastersList, setAllMastersList] = useState({
    allMastersListObject: [],
    error: '',
    loading: true
  });

  const [allMasters, setAllMasters] = useState({
    allMastersObject: [],
    error: '',
    loading: true
  });

  const [allLov, setAllLov] = useState({
    allLovObject: [],
    error: '',
    loading: true
  });

  const [allRights, setAllRights] = useState({
    allRightsObject: [],
    error: '',
    loading: true
  });

  const [allMastersColumnList, setAllMastersColumnList] = useState({
    allMastersColumnListObject: [],
    error: '',
    loading: true
  });

  const [formsCustom, setFormsCustom] = useState({
    formDataCustom: [],
    error: '',
    loading: true
  });

  const formsData = useSelector((state) => state.formData || {});
  const formsDataCustom = useSelector((state) => state.formDataCustom || []);
  const dropdownLovData = useSelector((state) => state.dropdownLovData || {});
  const payloadParentDropdownData = useSelector((state) => state.payloadParentDropdown || {});
  const webformsData = useSelector((state) => state.webformData || {});
  const formDetailData = useSelector((state) => state.formDetail || {});
  const defaultAttributesData = useSelector((state) => state.defaultFormAttributes || []);
  const formAttributesData = useSelector((state) => state.formAttributes || []);
  const formValidationBlockData = useSelector((state) => state.formValidationBlock || []);
  const formIntegrationBlockData = useSelector((state) => state.formIntegrationBlock || []);
  const formIntegrationBlockByIdData = useSelector((state) => state.formIntegrationBlockById || []);
  const formVisibilityBlockData = useSelector((state) => state.formVisibilityBlock || []);
  const attributeIntegrationPayloadData = useSelector((state) => state.formAttributeIntegrationPayload || []);
  const attributeValidationConditionData = useSelector((state) => state.formAttributeValidationCondition || []);
  const attributeIntegrationConditionData = useSelector((state) => state.formAttributeIntegrationCondition || []);
  const attributeVisibilityConditionData = useSelector((state) => state.formAttributeVisibilityCondition || []);
  const allMastersListData = useSelector((state) => state.allMastersList || []);
  const allMastersData = useSelector((state) => state.allMasters || []);
  const allLovData = useSelector((state) => state.getLovs || []);
  const allRightsData = useSelector((state) => state.getRights || []);
  const allMastersColumnListData = useSelector((state) => state.allMastersColumnList || []);

  useEffect(() => {
    setForms((prev) => ({
      ...prev,
      ...formsData
    }));
  }, [formsData]);

  useEffect(() => {
    setFormsCustom((prev) => ({
      ...prev,
      ...formsDataCustom
    }));
  }, [formsDataCustom]);

  useEffect(() => {
    setDropdownLov((prev) => ({
      ...prev,
      ...dropdownLovData
    }));
  }, [dropdownLovData]);

  useEffect(() => {
    setPayloadParentDropdown((prev) => ({
      ...prev,
      ...payloadParentDropdownData
    }));
  }, [payloadParentDropdownData]);

  useEffect(() => {
    setwebforms((prev) => ({
      ...prev,
      ...webformsData
    }));
  }, [webformsData]);

  useEffect(() => {
    setFormDetail((prev) => ({
      ...prev,
      ...formDetailData
    }));
  }, [formDetailData]);

  useEffect(() => {
    setDefaultAttributes((prev) => ({
      ...prev,
      ...defaultAttributesData
    }));
  }, [defaultAttributesData]);

  useEffect(() => {
    setFormAttributes((prev) => ({
      ...prev,
      ...formAttributesData
    }));
  }, [formAttributesData]);

  useEffect(() => {
    setFormValidationBlock((prev) => ({
      ...prev,
      ...formValidationBlockData
    }));
  }, [formValidationBlockData]);

  useEffect(() => {
    setFormVisibilityBlock((prev) => ({
      ...prev,
      ...formVisibilityBlockData
    }));
  }, [formVisibilityBlockData]);

  useEffect(() => {
    setFormIntegrationBlock((prev) => ({
      ...prev,
      ...formIntegrationBlockData
    }));
  }, [formIntegrationBlockData]);

  useEffect(() => {
    setFormIntegrationBlockById((prev) => ({
      ...prev,
      ...formIntegrationBlockByIdData
    }));
  }, [formIntegrationBlockByIdData]);

  useEffect(() => {
    setAttributeIntegrationPayload((prev) => ({
      ...prev,
      ...attributeIntegrationPayloadData
    }));
  }, [attributeIntegrationPayloadData]);

  useEffect(() => {
    setAttributeIntegrationCondition((prev) => ({
      ...prev,
      ...attributeIntegrationConditionData
    }));
  }, [attributeIntegrationConditionData]);

  useEffect(() => {
    setAttributeValidationCondition((prev) => ({
      ...prev,
      ...attributeValidationConditionData
    }));
  }, [attributeValidationConditionData]);

  useEffect(() => {
    setAttributeVisibilityCondition((prev) => ({
      ...prev,
      ...attributeVisibilityConditionData
    }));
  }, [attributeVisibilityConditionData]);

  useEffect(() => {
    setAllMastersList((prev) => ({
      ...prev,
      ...allMastersListData
    }));
  }, [allMastersListData]);

  useEffect(() => {
    setAllMasters((prev) => ({
      ...prev,
      ...allMastersData
    }));
  }, [allMastersData]);

  useEffect(() => {
    setAllLov((prev) => ({
      ...prev,
      ...allLovData
    }));
  }, [allLovData]);

  useEffect(() => {
    setAllRights((prev) => ({
      ...prev,
      ...allRightsData
    }));
  }, [allRightsData]);

  useEffect(() => {
    setAllMastersColumnList((prev) => ({
      ...prev,
      ...allMastersColumnListData
    }));
  }, [allMastersColumnListData]);

  return {
    forms,
    formsCustom,
    dropdownLov,
    payloadParentDropdown,
    webforms,
    formDetail,
    defaultFormAttributes,
    formAttributes,
    formValidationBlock,
    formVisibilityBlock,
    formIntegrationBlock,
    formIntegrationBlockById,
    attributeIntegrationCondition,
    attributeIntegrationPayload,
    attributeValidationCondition,
    attributeVisibilityCondition,
    allMastersList,
    allMastersColumnList,
    allMasters,
    allLov,
    allRights
  };
};
