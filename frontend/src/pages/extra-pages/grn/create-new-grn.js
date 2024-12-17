import React, { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProjects } from '../project/useProjects';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import { useOrganizations } from '../organization/useOrganizations';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-inputs';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getCompanyStoreLocations,
  getDropdownProjects,
  getOrganizationStores,
  getOrganizations,
  getOrganizationsLocation
} from 'store/actions';
import { concateNameAndCode, valueIsMissingOrNA } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import Loader from 'components/Loader';
import FileSections from 'components/attachments/FileSections';

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: true,
    multiple: true
  }
];

const GRN = () => {
  const [trxnType, setTrxnType] = useState('');
  const navigate = useNavigate();
  const [addressDetails, setAddressDetails] = useState(false);
  const [toOrganizationId, setToOrganizationId] = useState('');
  const [alldisable, setAllDisable] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [address, setAddress] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [serialNumbersArr, setSerialNumbersArr] = useState({});
  const [pending, setPending] = useState(false);
  const [eWayBillNumber, setEwayBillNumber] = useState();
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);

  const typeData = [
    {
      value: 'Supplier',
      name: 'Supplier'
    },
    {
      value: 'Customer',
      name: 'Customer'
    }
  ];

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        invoiceNumber: Validations.invoiceNumber,
        invoiceDate: Validations.date,
        projectSiteStoreId: Validations.receivingStore,
        poNumber: Validations.poNumber,
        poDate: Validations.date,
        transporterName: Validations.inventoryNameOptional,
        remarks: Validations.remarks,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') }),
        actualReceiptDate: Validations.actualReceiptDate,
        vehicleNumber: Validations.vehicleNumberOptional,
        transporterContactNumber: Validations.mobileNumberOptional,
        ...(showMaterials &&
          fileFields.find((item) => item.name === 'attachments')?.required && {
            attachments: Validations.requiredWithLabel('Attachments')
          })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch, clearErrors } = methods;

  const eWayBillNumberValue = watch('eWayBillNumber');
  const attachmentsPaths = watch('attachments-paths');

  const dispatch = useDispatch();

  useEffect(() => {
    if (trxnType === 'Supplier') dispatch(getOrganizations({ transactionTypeId: 'b442aa8c-92cb-420f-9e34-04764be59fc5' }));
    else if (trxnType === 'Company') {
      dispatch(getOrganizations({ transactionTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
      dispatch(getOrganizationsLocation({ transactionTypeId: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
    } else if (trxnType === 'Customer') dispatch(getOrganizations({ transactionTypeId: 'e9206924-c5cb-454e-af1e-124d8179299a' }));
  }, [dispatch, trxnType]);

  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
    dispatch(getCompanyStoreLocations({ organizationType: '420e7b13-25fd-4d23-9959-af1c07c7e94b' }));
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const { projectsDropdown } = useProjects();
  const { organizationStores } = useOrganizationStore();
  const { organizations, organizationsLocation } = useOrganizations();

  const transactionTypeId = '3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf';
  const [materialData, setMateialData] = useState([]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const storeLocationData = companyStoreLocations.companyStoreLocationsObject?.rows || [];

  const makeRequest = (val, matData) => {
    const stockLedgerArray = [];
    matData.map((stockData) => {
      stockLedgerArray.push({
        transactionTypeId: transactionTypeId.trim(),
        organizationId:
          val.sourceType === 'Supplier'
            ? val.supplierId?.trim()
            : val.sourceType === 'Company'
            ? val.companyId?.trim()
            : val.customerId?.trim(),
        projectId: val.projectId,
        storeId: val.projectSiteStoreId?.trim(),
        storeLocationId: stockData.storeLocationId?.trim(),
        materialId: stockData.material?.trim(),
        uomId: stockData.uomId?.trim(),
        quantity: stockData.quantity,
        rate: stockData.rate,
        value: stockData.value,
        tax: stockData.tax,
        serialNumber: stockData.isSerialNumber ? stockData.serialNumber : []
      });
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId?.trim(),
      toOrganizationId: toOrganizationId,
      poNumber: val.poNumber?.trim(),
      poDate: val.poDate?.trim(),
      lrNumber: val.lrNumber?.trim(),
      transporterName: val.transporterName?.trim(),
      transporterContactNumber: val.transporterContactNumber?.trim(),
      vehicleNumber: val.vehicleNumber?.trim(),
      invoiceNumber: val.invoiceNumber?.trim(),
      invoiceDate: val.invoiceDate?.trim(),
      eWayBillNumber: val.eWayBillNumber?.trim(),
      ...(val.eWayBillDate && { eWayBillDate: val.eWayBillDate?.trim() }),
      ...(val.expiryDate && { expiryDate: val.expiryDate?.trim() }),
      actualReceiptDate: val.actualReceiptDate?.trim(),
      remarks: val.remarks?.trim(),
      attachments: val.attachments,
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const onFormSubmit = async (formValues) => {
    setPending(true);

    if (!materialData || !materialData.length) {
      toast('Please have atleast one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }

    const updatedFormValues = { ...formValues };
    updatedFormValues.transactionTypeId = transactionTypeId;
    updatedFormValues.sourceType = trxnType;
    updatedFormValues.attachments = attachmentsPaths;
    const req = makeRequest(updatedFormValues, materialData);
    const resp = await request('/stock-ledger-create', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;
    toast(
      referenceDocumentNumber
        ? `Transaction created with reference number: ${referenceDocumentNumber}`
        : 'Transaction created successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    navigate('/grn-receipt');
    setPending(false);
  };

  const supplierData = trxnType === 'Supplier' ? organizations?.organizationObject?.rows : [];
  const companyData = useMemo(() => (trxnType === 'Company' ? organizations?.organizationObject?.rows : []), [organizations, trxnType]);
  const companyLocationData = useMemo(
    () => (trxnType === 'Company' ? organizationsLocation?.organizationLocationObject?.rows : []),
    [organizationsLocation, trxnType]
  );
  const customerData = trxnType === 'Customer' ? organizations?.organizationObject?.rows : [];
  const projectData = projectsDropdown?.projectsDropdownObject;
  const receivingStoreData = organizationStores?.organizationStoreObject?.rows;

  useEffect(() => {
    if (companyData && companyLocationData) {
      setOrganizationData([...companyData, ...companyLocationData]);
    }
  }, [companyData, companyLocationData]);

  const radioBox = (name, labels, title, onChange, disabled, req) => {
    return (
      <RHFRadio
        name={name}
        labels={labels}
        title={title}
        mini
        onChange={onChange}
        {...((disabled || alldisable) && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };

  const selectBox = (name, label, menus = [], req, onChange, disable) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(typeof onChange === 'function' && { onChange: onChange })}
        {...((disable || alldisable) && { disable: true })}
        {...(req && { required: true })}
      />
    );
  };

  const txtBox = (name, label, type, req, disabled, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...((disabled || alldisable) && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };

  const onMaterailsInput = (val) => {
    setMateialData(val);
  };

  const onRadioSelected = (e) => {
    setAddress('');
    setTrxnType(e.target.value);
  };

  const fetchData = (data, id) => {
    const res = data && data.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : {};
  };

  const showAddress = (e) => {
    if (e) {
      const dataTofilter =
        trxnType === 'Supplier' ? supplierData : trxnType === 'Company' ? organizationData : trxnType === 'Customer' ? customerData : [];
      const respData = fetchData(dataTofilter, e.target.value);
      const cityDetails = respData.cities ? respData.cities : respData.city;
      const addressdata = respData.registeredOfficeAddress ? respData.registeredOfficeAddress : respData.address;
      const pincode = respData.registeredOfficePincode ? respData.registeredOfficePincode : respData.pinCode;
      setAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setAddressDetails(true);
    } else {
      setAddress('');
      setAddressDetails(false);
    }
    if (trxnType === 'Supplier') {
      setValue('companyId', null);
      setValue('customerId', null);
      setValue('organizationLocationId', null);
    } else if (trxnType === 'Company') {
      setValue('supplierId', null);
      setValue('customerId', null);
    } else if (trxnType === 'Customer') {
      setValue('supplierId', null);
      setValue('companyId', null);
      setValue('organizationLocationId', null);
    }
  };

  const typDropDown = (
    <>
      <Grid item md={3} xl={2}>
        {trxnType === 'Supplier' && selectBox('supplierId', 'Supplier', concateNameAndCode(supplierData || []), false, showAddress)}
        {trxnType === 'Customer' && selectBox('customerId', 'Customer', concateNameAndCode(customerData || []), false, showAddress)}
      </Grid>
      {addressDetails && (
        <>
          <Grid item md={9} xl={10} mt={5}>
            <Typography>Address: {address}</Typography>
          </Grid>
        </>
      )}
    </>
  );

  const onInitialSubmit = () => {
    setAllDisable(true);
    setShowMaterials(true);
  };

  const onSelectedStore = (e) => {
    if (e) {
      const respData = storeLocationData && storeLocationData?.filter((item) => item.organizationStoreId === e.target.value);
      setFilteredLocations(respData);
      const newValue = receivingStoreData?.filter((x) => x.id === e?.target?.value);
      if (newValue && newValue[0] && newValue[0].organization) {
        setToOrganizationId(
          newValue[0].organization.parentId && newValue[0].organization.parentId !== null
            ? newValue[0].organization?.parentId
            : newValue[0].organization?.id
        );
      }
    }
  };

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  useEffect(() => {
    if (valueIsMissingOrNA(eWayBillNumber)) {
      clearErrors('eWayBillDate');
      setValue('eWayBillDate', '');
    }
  }, [clearErrors, eWayBillNumber, setValue]);

  return (
    <>
      {pending && <Loader />}
      <MainCard title={'GRN (Goods Receive Note)'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={4}>
            <Grid item md={6}>
              {radioBox('trxnType', typeData, ' ', onRadioSelected, false, false)}
            </Grid>
            <Grid item md={6}></Grid>
            {trxnType != '' && typDropDown}
            {addressDetails && (
              <>
                <Grid item md={3} xl={2}>
                  {selectBox('projectId', 'Project', projectData, true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('invoiceNumber', 'Invoice Number', 'text', true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('invoiceDate', 'Invoice Date', 'date', true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {selectBox('projectSiteStoreId', 'Receiving Store', receivingStoreData, true, onSelectedStore)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('poNumber', 'PO Number', 'text', true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('poDate', 'PO Date', 'date', true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('transporterName', 'Transporter Name', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('transporterContactNumber', 'Contact Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('vehicleNumber', 'Vehicle Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('lrNumber', 'LR Number', 'text')}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('eWayBillNumber', 'E-Way Bill Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('eWayBillDate', 'E-Way Bill Date', 'date', false, valueIsMissingOrNA(eWayBillNumber))}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('actualReceiptDate', 'Actual Receipt Date', 'date', true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('expiryDate', 'Expiry Date', 'date', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('remarks', 'Remarks', 'text', false)}
                </Grid>
              </>
            )}
          </Grid>
          {addressDetails && (
            <>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                {!alldisable && (
                  <Button size="small" onClick={handleSubmit(onInitialSubmit)} variant="contained" color="primary">
                    Next
                  </Button>
                )}
              </Grid>
            </>
          )}
          {showMaterials && (
            <>
              <MaterialInputs
                isEditingMaterial={isEditingMaterial}
                setIsEditingMaterial={setIsEditingMaterial}
                onMaterailsInput={onMaterailsInput}
                storeLocationData={filteredLocations}
                serialNumbersArr={serialNumbersArr}
                setSerialNumbersArr={setSerialNumbersArr}
              />
              <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                  <FileSections fileFields={fileFields} setValue={setValue} />
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button disabled={isEditingMaterial || pending} size="small" type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </FormProvider>
      </MainCard>
    </>
  );
};

export default GRN;
