import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useProjects } from '../project/useProjects';
import { getDropdownOrganization, getDropdownProjects, getOrganizationStores, getOrganizationStoresSecond } from '../../../store/actions';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { concateNameAndCode, valueIsMissingOrNA } from 'utils';

const CreateNewTransfer = ({ saveData, setDisableAll, disableAll }) => {
  const [address, setAddress] = useState('');
  const [fromStoreDetails, setFromStoreDetails] = useState('');
  const [eWayBillNumber, setEwayBillNumber] = useState();
  const [customerStoreData, setCustomerStoreData] = useState();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        projectSiteStoreId: Validations.projectSiteStore,
        toCustomerId: Validations.toCustomerId,
        customerSiteStoreId: Validations.customerSiteStoreId,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') }),
        // eWayBillNumber: Validations.eWayBillNumber,
        // eWayBillDate: Validations.eWayBillDate,
        transporterName: Validations.inventoryNameOptional,
        contactNumber: Validations.mobileNumberOptional,
        vehicleNumber: Validations.vehicleNumberOptional
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, watch, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const transactionTypeId = '6e7c5278-c63d-4ec1-90a8-110504adfbb0';
  const companyId = '420e7b13-25fd-4d23-9959-af1c07c7e94b';
  const customerId = 'e9206924-c5cb-454e-af1e-124d8179299a';

  useEffect(() => {
    if (companyId) dispatch(getOrganizationStores({ organizationType: companyId }));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (customerId) {
      dispatch(getDropdownOrganization(customerId));
      dispatch(getOrganizationStoresSecond({ organizationType: customerId }));
    }
  }, [dispatch, customerId]);

  const { projectsDropdown } = useProjects();
  const { organizationsDropdown } = useOrganizations();
  const { organizationStores, organizationStoresSecond } = useOrganizationStore();
  const projectData = projectsDropdown?.projectsDropdownObject;
  const companyStoreData = organizationStores.organizationStoreObject?.rows || [];
  const customerData = organizationsDropdown?.organizationDropdownObject || [];
  const customerStores = organizationStoresSecond?.organizationStoreObject?.rows || [];

  const onInitialSubmit = (values) => {
    values['transactionTypeId'] = transactionTypeId;
    values['fromStoreDetails'] = fromStoreDetails;
    saveData(values);
    setDisableAll(true);
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  const onSelectedStore = (e) => {
    if (e.target.value) {
      const respData = fetchData(companyStoreData, e.target.value);
      setFromStoreDetails(respData);
      const cityDetails = respData.city;
      const addressdata = respData.address ? respData.address : respData.address;
      const pincode = respData.pincode ? respData.pincode : respData.pinCode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      resetContents('projectSiteStoreId');
    }
  };

  const resetContents = (stage) => {
    if (stage === 'projectId') {
      setValue('projectSiteStoreId', null);
      setValue('toCustomerId', null);
      setValue('customerSiteStoreId', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
      setValue('remarks', null);
      setCustomerStoreData([]);
    }
    if (stage === 'projectSiteStoreId') {
      setValue('toCustomerId', null);
      setValue('customerSiteStoreId', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
      setValue('remarks', null);
      setCustomerStoreData([]);
    }
    if (stage === 'toCustomerId') {
      setValue('customerSiteStoreId', null);
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
      setValue('remarks', null);
    }
    if (stage === 'customerSiteStoreId') {
      setValue('placeOfSupply', null);
      setValue('eWayBillNumber', null);
      setValue('eWayBillDate', null);
      setValue('transporterName', null);
      setValue('contactNumber', null);
      setValue('vehicleNumber', null);
      setValue('lrNumber', null);
      setValue('remarks', null);
    }
  };

  return (
    <>
      <MainCard title={'Material Transfer Company Store To Customer'} sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectId"
                label="Project"
                menus={projectData || []}
                disable={disableAll}
                onChange={() => {
                  resetContents('projectId');
                }}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="projectSiteStoreId"
                label="Company Store"
                menus={companyStoreData || []}
                onChange={onSelectedStore}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={6} xl={8}>
              <Typography>Address: </Typography>
              <Typography mt={2}>{address}</Typography>
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="toCustomerId"
                label="Customer"
                menus={concateNameAndCode(customerData) || []}
                onChange={(e) => {
                  let selectedStores = customerStores.filter((v) => v.organizationId === e?.target?.value);
                  setCustomerStoreData(selectedStores);
                  resetContents('toCustomerId');
                }}
                required
                disable={disableAll}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                InputLabelProps={{ shrink: true }}
                name="customerSiteStoreId"
                label="Customer Site Store"
                menus={customerStoreData || []}
                onChange={() => {
                  resetContents('customerSiteStoreId');
                }}
                disable={disableAll}
                required
              />
            </Grid>
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
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                {!disableAll && (
                  <Button size="small" variant="contained" onClick={handleSubmit(onInitialSubmit)} color="primary">
                    Next
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, mb: 3 }}>
            <Grid item md={12} xl={12}>
              <Divider />
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
    </>
  );
};

CreateNewTransfer.propTypes = {
  saveData: PropTypes.func,
  setDisableAll: PropTypes.func,
  disableAll: PropTypes.bool
};

export default CreateNewTransfer;
