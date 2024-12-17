import { Button, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import {
  getCompanyStoreLocations,
  getFirmStoreLocations,
  getMasterMakerLov,
  getSerialNumbers,
  getTxnByLocationMaterial
} from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import { concateCodeAndName, fetchTransactionType, isDecimalUom, toFixedQuantity } from 'utils';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizationStoreLocation } from 'pages/extra-pages/organization-store-location/useOrganizationStoreLocation';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import { useStockLedger } from 'pages/extra-pages/stock-ledger/useStockLedger';
import CircularLoader from 'components/CircularLoader';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ materials, onMaterailsInput, formData, selectedItems, view, update, showData, hideTaxDetails = false }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [qtyStk, setQtyStk] = useState(null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [serialError, setSerialError] = useState('');
  const [selectedStoreLocName, setSelectedStoreLocName] = useState('');
  const [selectedStoreLocId, setSelectedStoreLocId] = useState(null);
  const [projectStoreLocationData, setProjectStoreLocationData] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [isInteger, setIsInteger] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const { firmStoreLocations, companyStoreLocations } = useOrganizationStoreLocation();
  const contractorId = fetchTransactionType(transactionTypeData, 'CONTRACTOR');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');
  useEffect(() => {
    if (contractorId) dispatch(getFirmStoreLocations({ organizationType: contractorId }));
    if (companyId) dispatch(getCompanyStoreLocations({ organizationType: companyId }));
  }, [dispatch, contractorId, companyId]);

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        materialId: Validations.requiredWithLabel('Material'),
        quantity: isInteger ? Validations.checkForInteger('Quantity', qtyStk) : Validations.maxQuantity(qtyStk, true),
        fromStoreLocationId: Validations.fromStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uom = watch('uom');

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName !== 'actions') setValue(fieldName, value);
        if (fieldName === 'uom') setValue(fieldName, typeof value === 'string' ? value : value.name);
      });
    };

    if ((view || update) && showData) {
      setUpdating(true);
      setSelectedMaterial(showData);
      dispatch(
        getTxnByLocationMaterial({
          project: formData?.projectId,
          store: formData?.contractorStoreId,
          storeLocation: showData?.fromStoreLocationId,
          material: showData?.materialId,
          installerId: formData?.installerId
        })
      );
      dispatch(
        getSerialNumbers({
          project: formData?.projectId,
          store: formData?.contractorStoreId,
          storeLocation: showData?.fromStoreLocationId,
          material: showData?.materialId,
          installer: formData?.installerId
        })
      );
      handleSetValues(showData);
    }
  }, [view, update, showData, reset, setValue, dispatch, formData]);

  const installersStoreContractorData = useMemo(() => firmStoreLocations?.firmStoreLocationsObject?.rows || [], [firmStoreLocations]);
  const installersStoreCompanyData = useMemo(() => companyStoreLocations?.companyStoreLocationsObject?.rows || [], [companyStoreLocations]);
  const installersStoreData = useMemo(
    () => [...installersStoreContractorData, ...installersStoreCompanyData] || [],
    [installersStoreContractorData, installersStoreCompanyData]
  );
  useEffect(() => {
    if (installersStoreData) {
      const newData = installersStoreData.filter(
        (val) =>
          val.id !== showData.StoreLocationId &&
          val?.name?.toLowerCase()?.includes('installer') &&
          val.organizationStoreId === formData.contractorStoreId
      );
      setFilteredLocations(newData);
    }
  }, [installersStoreData, formData, showData]);

  const onFormSubmit = async (values) => {
    if (selectedMaterial && selectedMaterial?.isSerialNumber && serials.length === 0) setSerialError('Serial Number is required');
    else if (selectedMaterial && selectedMaterial?.isSerialNumber && serials.length !== values.quantity)
      setSerialError(`Please select a total of ${values.quantity} serial numbers`);
    else {
      setSerialError(false);
      if (serials) values.material_serial_numbers = serials;
      values.tax = values.tax === 0 ? '0' : values.tax;
      values.fromStoreLocationName = selectedStoreLocName;
      const response = await request('/installation-check', {
        method: 'POST',
        body: {
          projectId: formData.projectId,
          installerOrgId: formData.orgId,
          installerStoreId: formData.contractorStoreId,
          isCompany: formData.isCompany,
          materialId: values.materialId,
          ...(selectedMaterial.isSerialNumber && { serialNumber: values.material_serial_numbers })
        }
      });
      if (response.success) {
        onMaterailsInput(values, selectedMaterial?.id, selectedMaterial?.id + selectedStoreLocId);
        setSerials([]);
        setAllSerials([]);
        setSelectedMaterial(null);
        setProjectStoreLocationData([]);
        setValue('qtyStk', null);
        setQtyStk(null);
        setUpdating(false);
        reset();
      }

      if (response.error && response.error.message) {
        toast(response?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      }
    }
  };

  const selectBox = (name, label, menus, req, handleChange, disable) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(disable && { disable: true })}
        {...(req && { required: true })}
      />
    );
  };

  const txtBox = (name, label, type, req, handleChange, disable = false, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        {...(typeof handleChange === 'function' && { handleChange: handleChange })}
        InputLabelProps={{ shrink: shrink }}
        {...((disable || disableAll) && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };
  const [serials, setSerials] = useState([]);
  const [allSerials, setAllSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);

  const setSerialNumbers = (val) => {
    setSerials(val);
  };

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const onMaterialSelected = (e) => {
    if (e?.target?.value) {
      let data = e?.target?.row;
      setValue('code', data?.code);
      setValue('uom', data?.uomName);
      setValue('fromStoreLocationId', null);
      setSelectedStoreLocId(null);
      setValue('quantity', null);
      setQtyStk(null);
      setValue('qtyStk', null);
      setSelectedMaterial(data);
    }
  };

  const { txnByLocationMaterial, serialNumbers } = useStockLedger();
  let { projectSLData } = useMemo(
    () => ({
      projectSLData: txnByLocationMaterial?.stocksObject || [],
      isLoading: txnByLocationMaterial.loading || false
    }),
    [txnByLocationMaterial]
  );

  useEffect(() => {
    if (projectSLData) setProjectStoreLocationData(projectSLData);
  }, [projectSLData]);

  // useEffect(() => {
  //   if (projectStoreLocationData && projectStoreLocationData.length > 0 && selectedStoreLocId !== null) {
  //     setLoading(false);
  //     if (
  //       selectedItems &&
  //       selectedMaterial &&
  //       selectedMaterial.id &&
  //       selectedStoreLocId &&
  //       selectedItems[selectedMaterial.id + selectedStoreLocId]
  //     ) {
  //       let alreadyAvailableItem = selectedItems[selectedMaterial.id + selectedStoreLocId];
  //       setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
  //       setValue('quantity', alreadyAvailableItem.quantity);
  //       setSerials(alreadyAvailableItem.material_serial_numbers);
  //     } else {
  //       setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
  //       setValue('quantity', update && showData && showData.quantity ? showData.quantity : 0);
  //       setSerials(update && showData && showData.material_serial_numbers ? showData.material_serial_numbers : []);
  //     }
  //     setQtyStk(toFixedQuantity(projectStoreLocationData[0].quantity));
  //     setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
  //     setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
  //     setValue('tax', projectStoreLocationData[0].tax);
  //     showData && showData.quantity && setValue('value', parseFloat(projectStoreLocationData[0].rate * showData.quantity).toFixed(2));
  //   } else {
  //     setLoading(false);
  //     setValue('qtyStk', selectedStoreLocId !== null ? 0 : null);
  //     setValue('rate', '0');
  //     setRate(0);
  //     setValue('tax', '0');
  //     setValue('value', '0');
  //     setQtyStk(null);
  //   }
  // }, [projectStoreLocationData, setValue, selectedItems, update, selectedMaterial, selectedStoreLocId, showData]);

  useEffect(() => {
    // Set loading state to false at the beginning
    setLoading(false);

    // Check if projectStoreLocationData is valid
    if (projectStoreLocationData?.length > 0 && selectedStoreLocId !== null) {
      const quantityData = projectStoreLocationData?.[0];
      const availableItemKey = selectedMaterial?.id + selectedStoreLocId;
      const alreadyAvailableItem = selectedItems?.[availableItemKey];

      // Calculate values
      const quantityInStock = toFixedQuantity(quantityData.quantity);
      const materialQuantity = alreadyAvailableItem?.quantity || (update && showData?.quantity) || 0;
      const materialSerialNumbers = alreadyAvailableItem?.material_serial_numbers || (update && showData?.material_serial_numbers) || [];

      // Batch state updates
      setValue('qtyStk', quantityInStock);
      setValue('quantity', materialQuantity);
      setValue('rate', parseFloat(quantityData.rate).toFixed(2));
      setValue('tax', quantityData.tax);
      setSerials(materialSerialNumbers);
      setQtyStk(quantityInStock);
      setRate(parseFloat(quantityData.rate).toFixed(2));

      // Calculate and set value based on showData
      if (showData?.quantity) {
        setValue('value', parseFloat(quantityData.rate * showData.quantity).toFixed(2));
      }
    } else {
      // Handle the else case
      setValue('qtyStk', selectedStoreLocId !== null ? 0 : null);
      setValue('rate', '0');
      setRate(0);
      setValue('tax', '0');
      setValue('value', '0');
      setQtyStk(null);
    }
  }, [projectStoreLocationData, setValue, selectedItems, update, selectedMaterial, selectedStoreLocId, showData]);

  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || [],
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  const onStoreLocationSelected = (e) => {
    if (e?.target?.value) {
      setLoading(true);
      setSerials([]);
      setAllSerials([]);
      showData.material_serial_numbers = [];
      setValue('qtyStk', '0');
      setQtyStk('0');
      setSelectedStoreLocName(e?.target?.name);
      setSelectedStoreLocId(e?.target?.value);
      dispatch(
        getTxnByLocationMaterial({
          project: formData?.projectId,
          store: formData?.contractorStoreId,
          storeLocation: e?.target?.value,
          material: selectedMaterial?.id,
          installerId: formData?.installerId
        })
      );
      dispatch(
        getSerialNumbers({
          project: formData?.projectId,
          store: formData?.contractorStoreId,
          storeLocation: e?.target?.value,
          material: selectedMaterial?.id,
          installer: formData?.installerId
        })
      );
    }
  };

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
        <FormProvider methods={methods}>
          {loading && <CircularLoader />}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              {selectBox('materialId', 'Material', concateCodeAndName(materials), true, onMaterialSelected, update ? true : false)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {txtBox('code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectBox('fromStoreLocationId', 'From Store Location', filteredLocations, true, onStoreLocationSelected, false)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('quantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
                if (isDecimalUom(uom)) setIsInteger(false);
                else setIsInteger(true);
                setQuantity(e?.target?.value);
                setValue('value', (e?.target?.value * rate).toFixed(2));
              })}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('qtyStk', 'Qty In Stock', 'number', false, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('uom', 'UOM', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2} style={{ display: 'none' }}>
              {txtBox('uomId', 'UOMId', 'text', true)}
            </Grid>
            <Grid item xs={12} sm={2} {...(hideTaxDetails && { display: 'none' })}>
              {txtBox(
                'rate',
                'Rate',
                'text',
                true,
                (e) => {
                  setRate(e?.target?.value);
                },
                true
              )}
            </Grid>
            <Grid item xs={12} sm={2} {...(hideTaxDetails && { display: 'none' })}>
              {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2} {...(hideTaxDetails && { display: 'none' })}>
              {txtBox('value', 'Value', 'number', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
              {(selectedMaterial?.isSerialNumber || (update && showData?.isSerialNumber)) && (
                <>
                  <Typography mb={-1}>SerialNumber</Typography> <br />{' '}
                  <Button
                    size="small"
                    onClick={() => {
                      setAllSerials(serialNumbersData[selectedMaterial?.id || showData?.materialId]);
                      setOpenSerials(true);
                    }}
                    variant={'contained'}
                    color="primary"
                  >
                    View
                  </Button>
                </>
              )}
              {serialError && serialError !== '' && (
                <>
                  <br />
                  <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                    {serialError}
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={2} mt={4} textAlign={'right'}>
              {!view && (
                <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                  {updating ? 'Update' : 'Add'}
                </Button>
              )}
            </Grid>
          </Grid>

          <Modal open={uploadSerials} onClose={handleCloseSerial} aria-labelledby="modal-modal-title">
            <ModalContent
              handleCloseSerial={handleCloseSerial}
              closeCss={closeCss}
              quantity={quantity}
              setSerialNumbers={setSerialNumbers}
            />
          </Modal>

          {openSerials && (
            <MaterialSerialNumberModal
              open={openSerials}
              onClose={() => {
                setOpenSerials(false);
              }}
              maxQuantity={quantity}
              serialNumberData={allSerials}
              showCheckboxes
              onSave={(selectedData) => {
                setSerialNumbers(selectedData);
              }}
              selectedSerials={serials}
            />
          )}
        </FormProvider>
      </MainCard>
    </>
  );
};

MaterialInputs.propTypes = {
  onMaterailsInput: PropTypes.func,
  materials: PropTypes.array,
  materialData: PropTypes.array,
  view: PropTypes.bool,
  hideTaxDetails: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  formData: PropTypes.any,
  selectedLocations: PropTypes.array,
  selectedItems: PropTypes.any
};
export default MaterialInputs;
