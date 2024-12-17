import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { useProjects } from '../project/useProjects';
import {
  getDetailsByRefNo,
  getDropdownOrganization,
  getDropdownOrganizationStores,
  getDropdownProjects,
  getLovsForMasterName,
  getMasterMakerLov
} from '../../../store/actions';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { groupByRequisitionNumberForDropdown, valueIsMissingOrNA } from 'utils';

const CreateNewCTS = ({ saveData, disableAll, setDisableAll }) => {
  const [customerStores, setCustomerStores] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [respData, setRespData] = useState([]);
  const [show, setShow] = useState(false);
  const [eWayBillNumber, setEwayBillNumber] = useState();

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationId: Validations.requiredWithLabel('Customer'),
        fromProjectSiteStoreId: Validations.requiredWithLabel('Customer store'),
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') }),
        transporterName: Validations.inventoryNameOptional,
        contactNumber: Validations.mobileNumberOptional,
        vehicleNumber: Validations.vehicleNumberOptional,
        requisitionNumber: Validations.requisitionNumber
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);
  const { refData } = useStockLedger();
  const { projectsDropdown } = useProjects();

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  const stockLedgerList = useMemo(() => refData?.refDataObject?.rows, [refData?.refDataObject?.rows]);

  const transactionTypeId = '86f7e47f-195a-4cbd-87a4-1f5a3e97025f';
  const reqTransactionTypeId = '6e7c5278-c63d-4ec1-90a8-110504adfbb0';

  useEffect(() => {
    dispatch(getDropdownOrganization('e9206924-c5cb-454e-af1e-124d8179299a'));
    dispatch(getDropdownOrganizationStores('e9206924-c5cb-454e-af1e-124d8179299a'));
  }, [dispatch]);

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('organizationTypeId', null);
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'organizationTypeId') {
      setValue('organizationId', null);
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'organizationId') {
      setValue('organizationbranchId', null);
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'organizationbranchId') {
      setValue('fromProjectSiteStoreId', null);
      setValue('fromStoreLocationId', null);
      setValue('requisitionNumber', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'fromProjectSiteStoreId') {
      setValue('requisitionNumber', null);
      setValue('fromStoreLocationId', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'requisitionNumber') {
      setValue('fromStoreLocationId', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    } else if (stage === 'fromStoreLocationId') {
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
    }
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          {...(typeof onChange === 'function' && { onChange: onChange })}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(disableAll && { disable: true })}
          {...(req && { required: true })}
        />
      </Stack>
    );
  };

  // const txtBox = (name, label, type, req, shrink = true) => {
  //   return (
  //     <Stack spacing={1}>
  //       <RHFTextField
  //         name={name}
  //         type={type}
  //         label={label}
  //         InputLabelProps={{ shrink: shrink }}
  //         {...(disableAll && { disabled: true })}
  //         {...(req && { required: true })}
  //       />
  //     </Stack>
  //   );
  // };

  const getReqIds = (processedArr) => {
    let newRespArr = [];
    processedArr &&
      processedArr.length > 0 &&
      processedArr.map((vl) => {
        let processedData = vl.data.filter((pv) => pv.willReturn === true && pv.isProcessed === false);
        vl.data = processedData;
        if (processedData && processedData.length > 0) newRespArr.push(vl);
      });
    return newRespArr;
  };

  const projectData = projectsDropdown?.projectsDropdownObject;
  const { organizationStoresDropdown } = useOrganizationStore();
  const projectStore = organizationStoresDropdown.organizationStoreDropdownObject?.rows || [];

  const { organizationsDropdown } = useOrganizations();
  const orgData = organizationsDropdown.organizationDropdownObject || [];

  const onOrgSelected = (e) => {
    if (e?.target?.value) {
      let orgStores = projectStore.filter((vl) => vl.organizationId === e?.target?.value);
      setCustomerStores(orgStores);
    }
  };

  const onInitialSubmit = (values) => {
    setDisableAll(true);
    values['transactionTypeId'] = transactionTypeId;
    values['materials'] = respData;
    saveData(values);
  };

  const onSelectedFromStore = (e) => {
    if (e?.target?.value) {
      resetContents('fromProjectSiteStoreId');
      setValue('fromStoreLocationId', null);
      setValue('fromStoreLocationId', null);
      dispatch(
        getDetailsByRefNo({
          projectId: projectId,
          storeId: e?.target?.value,
          isCancelled: '0',
          isProcessed: '0',
          transactionTypeId: reqTransactionTypeId,
          sortBy: 'updatedAt',
          sortOrder: 'DESC'
        })
      );
    }
  };

  const searchData = async () => {
    if (respData && respData.length > 0) {
      setShow(true);
    }
  };

  return (
    <>
      <MainCard title={'Material Transfer Customer To Store'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              {selectBox('projectId', 'Project', projectData, true, (e) => {
                if (e?.target?.value) setProjectId(e?.target?.value);
                resetContents('projectId');
              })}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('organizationId', 'Customer', orgData, true, onOrgSelected)}
            </Grid>
            <Grid item xs={12} sm={3}>
              {selectBox('fromProjectSiteStoreId', 'Customer Store', customerStores, true, onSelectedFromStore)}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grid container>
                <Grid item xs={11}>
                  {selectBox(
                    'requisitionNumber',
                    'Requisition Number',
                    getReqIds(groupByRequisitionNumberForDropdown(stockLedgerList)) || [],
                    true,
                    (e) => {
                      resetContents('requisitionNumber');
                      if (e?.target?.value) setRespData(e?.target?.row?.data);
                    }
                  )}
                </Grid>
                <Grid item xs={1}>
                  <Button sx={{ mt: 4 }} onClick={searchData}>
                    <SearchIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}></Grid>
            {show && (
              <>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="placeOfSupply"
                    label="Place of Supply"
                    type="text"
                    disabled={disableAll}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="eWayBillNumber"
                    label="E-Way Bill Number"
                    type="text"
                    disabled={disableAll}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="eWayBillDate"
                    label="E-Way Bill Date"
                    type="date"
                    disabled={disableAll || valueIsMissingOrNA(eWayBillNumber)}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="transporterName"
                    label="Transporter Name"
                    type="text"
                    disabled={disableAll}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="contactNumber"
                    label="Contact Number"
                    type="text"
                    disabled={disableAll}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    InputLabelProps={{ shrink: true }}
                    name="vehicleNumber"
                    label="Vehicle Number"
                    type="text"
                    disabled={disableAll}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="lrNumber" label="LR Number" type="text" disabled={disableAll} />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField InputLabelProps={{ shrink: true }} name="remarks" label="Remarks" type="text" disabled={disableAll} />
                </Grid>
                {/* <Grid item xs={12} sm={3}>
                  {txtBox('remarks', 'Remarks', 'text', false)}
                </Grid> */}
                <Grid container spacing={4} mt={2}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    {!disableAll && (
                      <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                        Next
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
            <Grid container sx={{ mt: 3, mb: 3 }}>
              <Grid item md={12} xl={12}>
                <Divider />
              </Grid>
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewCTS.propTypes = {
  saveData: PropTypes.func,
  disableAll: PropTypes.bool,
  setDisableAll: PropTypes.func
};

export default CreateNewCTS;
