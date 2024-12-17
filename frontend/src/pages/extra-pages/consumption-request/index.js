import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Button, Stack, Divider } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useProjects } from '../project/useProjects';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import MaterialInputs from './material-input';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getDropdownOrganization,
  getDropdownOrganizationStores,
  getDropdownOrganizationStoresSecond,
  getDropdownProjects,
  getLovsForMasterName,
  getLovsForMasterNameSecond,
  getMasterMakerLov,
  getOrganizationListData,
  getOrganizationListDataSecond,
  getOrganizationStoresAllAccess,
  getOrganizationsLocationByParent,
  getTransactionMaterialList
} from 'store/actions';
import { concateNameAndCode, isMissingStoreLocation } from 'utils';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import Loader from 'components/Loader';
import request from 'utils/request';
import useValueAfterLoad from 'hooks/useValueAfterLoad';

const ConsumptionRequest = () => {
  const navigate = useNavigate();
  const [disableAll, setDisableAll] = useState(false);
  const [materialData, setMaterialData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [materialDataList, setMaterialDataList] = useState([]);
  const [showData, setShowData] = useState({});
  const [formData, setFormData] = useState(null);
  const [organizationTypeId, setOrganizationTypeId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedStoreLocId, setSelectedStoreLocId] = useState(null);
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [pending, setPending] = useState(false);
  const [fromOrganization, setFromOrganization] = useState(false);
  const [requestOrganizationId, setRequestOrganizationId] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        fromOrganizationTypeId: Validations.organizationType,
        fromOrganizationId: Validations.organizationId,
        fromStoreId: Validations.store,
        toOrganizationId: Validations.organizationId,
        toStoreId: Validations.store
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const subColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'UOM',
        accessor: 'uom'
      },
      {
        Header: 'From Store Location',
        accessor: 'fromStoreLocationName'
      }
    ],
    []
  );

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
    dispatch(getLovsForMasterNameSecond('ORGANIZATION TYPE'));
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    if (organizationTypeId) {
      dispatch(getDropdownOrganization(organizationTypeId));
      dispatch(getDropdownOrganizationStores(organizationTypeId));
    }
  }, [dispatch, organizationTypeId]);

  const {
    masterMakerOrgTypeSecond: { masterObject: organizationTypeData }
    // masterMakerOrgType: { masterObject: organizationTypeDataSecond }
  } = useMasterMakerLov();
  const {
    projectsDropdown: { projectsDropdownObject: projectData }
  } = useProjects();

  useEffect(() => {
    if (organizationTypeData) {
      const newData = organizationTypeData.filter((x) => ['COMPANY', 'CONTRACTOR'].includes(x?.name));
      setFromOrganization(newData);
    }
  }, [organizationTypeData]);

  const {
    organizationsDropdown: { organizationDropdownObject: organizationNameData },
    organizationsLocByParent: {
      organizationObject: { rows: organizationBranchData }
    }
  } = useOrganizations();

  const { organizationsAllData, organizationsAllDataSecond } = useOrganizations();

  const toOrganizationData = organizationsAllData?.organizationObject?.rows || [];
  const toOrganizationBranchData = organizationsAllDataSecond?.organizationObject?.rows || [];

  const {
    organizationStoresDropdown: {
      organizationStoreDropdownObject: { rows: organizationData = [] }
    },
    organizationStoresAllAccess: {
      organizationStoreObject: { rows: storeDataSecond }
    }
  } = useOrganizationStore();

  const transactionTypeId = '671306a0-48c5-4e0c-a604-d86624f35d6d';

  useEffect(() => {
    if (organizationId) {
      setStoreData(organizationData?.filter((x) => x?.organizationId === organizationId));
    }
  }, [organizationId, organizationData]);

  const onInitialFormSubmit = (iniValues) => {
    if (iniValues && iniValues.projectId && iniValues.fromStoreId) {
      setFormData(iniValues);
      setDisableAll(true);
      setViewMaterial(true);
      dispatch(getTransactionMaterialList({ project: iniValues.projectId, store: iniValues.fromStoreId }));
    }
  };

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setShowData({ ...row });
  };

  const handleRowDelete = (k, id) => {
    if (materialDataList) {
      const findIndex = materialDataList.findIndex((x) => x?.materialId === id && x?.fromStoreLocationId === k);
      const liData = materialDataList.filter((_, index) => index !== findIndex);
      const locData = liData.map((x) => x.fromStoreLocationId);
      setMaterialDataList(liData);
      setAlreadySelectedLocations(locData);
      delete selectedItems[id + k];
    }
  };

  const { transactionMaterialList } = useStockLedger();

  const { materials } = useMemo(
    () => ({
      materials: transactionMaterialList?.stocksObject || [],
      count: transactionMaterialList?.stocksObject?.count || 0
    }),
    [transactionMaterialList]
  );

  useEffect(() => {
    const filterMaterials = (materialsData) => {
      const respMaterials =
        materialsData &&
        materialsData.map((mat) => {
          // if (mat.quantity > 0) {
          return {
            id: mat?.id,
            name: mat?.name,
            isSerialNumber: mat?.is_serial_number,
            quantity: ' ',
            tax: mat.tax,
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat?.code,
            hsnCode: mat?.hsn_code,
            uom: mat.uom,
            projectId: projectId,
            fromStoreId: storeId,
            material_serial_numbers: []
          };
          // }
        });
      return respMaterials;
    };
    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials));
    }
  }, [materials, projectId, storeId]);

  const getMaterials = (values, id) => {
    if (id) {
      materialData.map((val) => {
        let newVal = {};
        if (val.id === values.materialId) {
          newVal = { ...val, ...values };
          newVal.uomId = val?.uomId;
          setAlreadySelectedLocations((prev) => [...prev, newVal.fromStoreLocationId]);
          const index = materialDataList.findIndex((item) => item.id === id && values?.fromStoreLocationId === item?.fromStoreLocationId);
          if (index >= 0) {
            const updatedList = structuredClone(materialDataList);
            updatedList[index] = newVal;
            setMaterialDataList(updatedList);
          } else setMaterialDataList(materialDataList.concat(newVal));
        }
      });
      setUpdate(false);
    }
  };

  const materialInput = (values, id, key) => {
    getMaterials(values, id);
    const alreadySelectedItems = { ...selectedItems };
    if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
    alreadySelectedItems[key] = values;
    setSelectedItems(alreadySelectedItems);
  };

  const onFormSubmit = async () => {
    setPending(true);

    const payload = materialDataList
      .filter((item) => parseFloat(item.quantity) > 0)
      .map((val) => ({
        requestName: 'CONSUMPTIONREQUEST',
        transactionTypeId: transactionTypeId,
        requestOrganizationId: requestOrganizationId,
        requestStoreId: formData.fromStoreId,
        approverStoreId: formData.toStoreId,
        projectId: formData.projectId,
        fromStoreId: formData.fromStoreId,
        toStoreId: formData.toStoreId,
        fromStoreLocationId: val.fromStoreLocationId,
        materialId: val.materialId,
        uomId: val.uomId,
        requestedQuantity: val.quantity,
        rate: val.rate,
        value: val.value,
        tax: val.tax,
        serialNumbers: JSON.stringify(val?.material_serial_numbers),
        remarks: formData.remarks
      }));

    if (!payload.length) {
      toast('Please have at least one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }

    if (isMissingStoreLocation(payload, 'fromStoreLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/request-create', { method: 'POST', body: { payload: payload }, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(referenceDocumentNumber ? `Request created with reference number: ${referenceDocumentNumber}` : 'Request created successfully!', {
      variant: 'success',
      autoHideDuration: 10000
    });

    setPending(false);
    navigate('/consumption-request-receipt');
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(disableAll && { disable: true })}
          {...(typeof onChange === 'function' && { onChange })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(disableAll && { disabled: true })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  const resetField = (val) => {
    if ('projectId' === val) {
      setValue('fromOrganizationTypeId', '');
      setValue('fromOrganizationId', '');
      setValue('fromOraganizationBranchId', '');
      setValue('fromStoreId', '');
      setValue('toOrganizationId', '');
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('fromOrganizationTypeId' === val) {
      setValue('fromOrganizationId', '');
      setValue('fromOraganizationBranchId', '');
      setValue('fromStoreId', '');
      setValue('toOrganizationId', '');
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('fromOrganizationId' === val) {
      setValue('fromOraganizationBranchId', '');
      setValue('fromStoreId', '');
      setValue('toOrganizationId', '');
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('fromOraganizationBranchId' === val) {
      setValue('fromStoreId', '');
      setValue('toOrganizationId', '');
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('fromStoreId' === val) {
      setValue('toOrganizationId', '');
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('toOrganizationId' === val) {
      setValue('toOraganizationBranchId', '');
      setValue('toStoreId', '');
      setValue('remarks', '');
    } else if ('toOraganizationBranchId' === val) {
      setValue('toStoreId', '');
      setValue('remarks', '');
    }
  };

  const onBack = () => {
    setDisableAll(false);
    setFormData(null);
    setMaterialData([]);
    setViewMaterial(false);
  };

  const handleFromOrganizationTypeId = (e) => {
    setOrganizationTypeId(e?.target?.value);
    resetField('fromOrganizationTypeId');
    setOrganizationId(null);
  };

  const onFromOrganizationSelected = (e) => {
    if (e?.target?.value) {
      setOrganizationId(e?.target?.value);
      resetField('fromOrganizationId');
      const targetRow = e?.target?.row;
      dispatch(getOrganizationsLocationByParent({ params: targetRow?.organization_type?.id + '/' + targetRow?.id }));
      dispatch(getDropdownOrganizationStores(targetRow?.organization_type?.id));
    }
  };

  const onFromBranchSelected = (e) => {
    if (e?.target?.value) {
      const targetRow = e?.target?.row;
      setOrganizationId(e?.target?.value);
      resetField('fromOraganizationBranchId');
      dispatch(getDropdownOrganizationStores(targetRow?.organization_type?.id));
    }
  };

  // const handleToOrganizationTypeId = (e) => {
  //   resetField('toOrganizationTypeId');
  //   setOrganizationTypeIdSecond(e?.target?.value);
  //   setOrganizationIdSecond(null);
  // };

  const onToOrganizationSelected = (e) => {
    if (e?.target?.value) {
      resetField('toOrganizationId');
      const targetRow = e?.target?.row;
      dispatch(getOrganizationListDataSecond({ organizationTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b', parentId: e?.target?.value }));
      dispatch(getOrganizationStoresAllAccess({ organizationType: targetRow?.organization_type?.id, organizationId: e?.target?.value }));
    }
  };

  const onToBranchSelected = (e) => {
    if (e?.target?.value) {
      const targetRow = e?.target?.row;
      resetField('toOraganizationBranchId');
      dispatch(getDropdownOrganizationStoresSecond(targetRow?.organization_type?.id));
      dispatch(getOrganizationStoresAllAccess({ organizationType: targetRow?.organization_type?.id, organizationId: e?.target?.value }));
    }
  };

  const onProjectSelected = (e) => {
    if (e?.target?.value) {
      setProjectId(e?.target?.value);
      resetField('projectId');
    }
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const onFromSelectedStore = (e) => {
    if (e?.target?.value) {
      setStoreId(e?.target?.value);
      resetField('fromStoreId');
      const respData = fetchData(storeData, e.target.value);
      setRequestOrganizationId(respData?.organization?.parentId ? respData?.organization?.parentId : respData?.organization?.id);
      dispatch(getOrganizationListData({ organizationTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
      dispatch(getDropdownOrganizationStoresSecond('420e7b13-25fd-4d23-9959-af1c07c7e94b'));
    }
  };

  const onToSelectedStore = (e) => {
    if (e?.target?.value) {
      resetField('toStoreId');
    }
  };

  const transactionLoaded = useValueAfterLoad({
    dataObject: transactionMaterialList,
    key: 'stocksObject',
    resetTrigger: formData === null
  });

  useEffect(() => {
    if (Array.isArray(transactionLoaded) && transactionLoaded.length === 0) {
      onBack();
      toast('There are no available materials for your selected combination', { variant: 'error' });
    }
  }, [transactionLoaded]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods}>
        <MainCard title="Consumption Request">
          <Grid container spacing={4}>
            <Grid item md={3} xl={3}>
              {selectBox('projectId', 'Project', projectData, true, onProjectSelected)}
            </Grid>
            <Grid item md={3} xl={3}>
              {selectBox('fromOrganizationTypeId', 'From Organization Type', fromOrganization, true, handleFromOrganizationTypeId)}
            </Grid>
            <Grid item md={3} xl={3}>
              {selectBox(
                'fromOrganizationId',
                'From Organization',
                concateNameAndCode(organizationNameData),
                true,
                onFromOrganizationSelected
              )}
            </Grid>
            <Grid item md={3} xl={3}>
              {selectBox(
                'fromOraganizationBranchId',
                'From Organization Branch',
                concateNameAndCode(organizationBranchData),
                false,
                onFromBranchSelected
              )}
            </Grid>
            <Grid item md={3} xl={3}>
              {selectBox('fromStoreId', 'From Store', storeData, true, onFromSelectedStore)}
            </Grid>
            {/* <Grid item md={3} xl={3}>
              {selectBox('toOrganizationTypeId', 'To Organization Type', toOrganization, true, handleToOrganizationTypeId)}
            </Grid> */}
            <Grid item md={3} xl={3}>
              {selectBox('toOrganizationId', 'To Organization', concateNameAndCode(toOrganizationData), true, onToOrganizationSelected)}
            </Grid>

            <Grid item md={3} xl={3}>
              {selectBox(
                'toOraganizationBranchId',
                'To Organization Branch',
                concateNameAndCode(toOrganizationBranchData),
                false,
                onToBranchSelected
              )}
            </Grid>
            <Grid item md={3} xl={3}>
              {selectBox('toStoreId', 'To Store', storeDataSecond, true, onToSelectedStore)}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('remarks', 'Remarks', 'text', false)}
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
              {!disableAll && (
                <Button onClick={handleSubmit(onInitialFormSubmit)} size="small" variant="contained" color="primary">
                  Proceed
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      {materialData && viewMaterial && materialData.length > 0 && (
        <MaterialInputs
          formData={formData}
          onMaterailsInput={materialInput}
          update={update}
          selectedItems={selectedItems}
          showData={showData}
          material={materialData}
          selectedLocations={alreadySelectedLocations}
          setSelectedStoreLocId={setSelectedStoreLocId}
          selectedStoreLocId={selectedStoreLocId}
        />
      )}
      {disableAll && materialData && materialData.length > 0 && (
        <>
          <TableForm
            title="Consumption-Request"
            hideHeader
            columns={subColumns}
            hidePagination
            data={materialDataList}
            count={materialDataList.length}
            hideViewIcon
            hideRestoreIcon
            hideHistoryIcon
            handleRowUpdate={handleRowUpdate}
            handleRowDelete={handleRowDelete.bind(null, selectedStoreLocId)}
          />
          <FormProvider>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button size="small" disabled={update || pending} onClick={onFormSubmit} variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </>
      )}
    </>
  );
};

ConsumptionRequest.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  updateData: PropTypes.object,
  setBasic: PropTypes.func,
  setAddApprover: PropTypes.func,
  addApprover: PropTypes.bool
};

export default ConsumptionRequest;
