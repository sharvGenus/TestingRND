import { Button, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { getFirmStoreLocations, getMasterMakerLov, getSerialNumbers, getTxnByLocationMaterial } from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import { concateCodeAndName, fetchTransactionType, isDecimalUom } from 'utils';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizationStoreLocation } from 'pages/extra-pages/organization-store-location/useOrganizationStoreLocation';
import CircularLoader from 'components/CircularLoader';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ materials, onMaterailsInput, filteringStoreId, formData, view, update, showData, selectedItems }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [qtyStk, setQtyStk] = useState(null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [serialError, setSerialError] = useState('');
  const [selectedStoreLocName, setSelectedStoreLocName] = useState('');
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
  const { firmStoreLocations } = useOrganizationStoreLocation();
  const contractorId = fetchTransactionType(transactionTypeData, 'CONTRACTOR');
  useEffect(() => {
    if (contractorId) dispatch(getFirmStoreLocations({ organizationType: contractorId }));
  }, [dispatch, contractorId]);

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
  const selectedStoreLocId = watch('fromStoreLocationId');

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
          material: showData?.materialId
        })
      );
      dispatch(
        getSerialNumbers({
          project: formData?.projectId,
          store: formData?.contractorStoreId,
          storeLocation: showData?.fromStoreLocationId,
          material: showData?.materialId
        })
      );
      handleSetValues(showData);
    }
  }, [view, update, showData, setValue, dispatch, formData]);

  const installersStoreData = useMemo(() => firmStoreLocations?.firmStoreLocationsObject?.rows || [], [firmStoreLocations]);
  useEffect(() => {
    if (installersStoreData) {
      const newData = installersStoreData.filter(
        (val) =>
          val.id !== showData.StoreLocationId &&
          !val?.name?.toLowerCase()?.includes('installer') &&
          val.organizationStoreId === filteringStoreId
      );
      setFilteredLocations(newData);
    }
  }, [installersStoreData, showData, filteringStoreId]);

  const onFormSubmit = (values) => {
    if (selectedMaterial && selectedMaterial?.isSerialNumber && serials.length === 0) setSerialError('Serial Number is required');
    else if (selectedMaterial && selectedMaterial?.isSerialNumber && serials.length !== values.quantity)
      setSerialError(`Please select a total of ${values.quantity} serial numbers`);
    else {
      setSerialError(false);
      if (serials) values.material_serial_numbers = serials;
      values.tax = values.tax === 0 ? '0' : values.tax;
      values.fromStoreLocationName = selectedStoreLocName;
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

  // const setSerialNumbers = async (val) => {
  //   const uniqueSerialNumber = [...new Set(val)];
  //   if (uniqueSerialNumber.length < val.length) {
  //     toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
  //   } else {
  //     let allSRNumbers = [...serialNumbersArr, ...val];
  //     let allUniqueSerialNumbers = [...new Set(allSRNumbers)];
  //     if (allUniqueSerialNumbers.length < allSRNumbers.length) {
  //       toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
  //     } else {
  //       setSerials(val);
  //       setSerialNumbersArr(allSRNumbers);
  //     }
  //   }
  // };

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
      setValue('quantity', null);
      setQtyStk(null);
      setValue('qtyStk', null);
      setSelectedMaterial(data);
    }
  };

  // const { storeLocationsTransaction, serialNumbers, serialNumbersSecond } = useStockLedger();
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

  useEffect(() => {
    if (projectStoreLocationData && projectStoreLocationData.length > 0) {
      setValue('qtyStk', projectStoreLocationData[0].quantity);
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setValue('value', parseFloat(projectStoreLocationData[0].rate * showData.quantity).toFixed(2));
      setQtyStk(projectStoreLocationData[0].quantity);
    } else {
      setValue('qtyStk', '0');
      setValue('rate', '0');
      setRate(0);
      setValue('tax', '0');
      setValue('value', '0');
      setQtyStk(0);
    }
  }, [projectStoreLocationData, setValue, showData]);

  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || [],
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  useEffect(() => {
    if (projectStoreLocationData && projectStoreLocationData.length > 0 && selectedStoreLocId !== null) {
      setLoading(false);
      if (
        selectedItems &&
        selectedMaterial &&
        selectedMaterial.id &&
        selectedStoreLocId &&
        selectedItems[selectedMaterial.id + selectedStoreLocId]
      ) {
        let alreadyAvailableItem = selectedItems[selectedMaterial.id + selectedStoreLocId];
        setValue('qtyStk', projectStoreLocationData[0].quantity);
        setValue('quantity', alreadyAvailableItem.quantity);
        setSerials(alreadyAvailableItem.material_serial_numbers);
      } else {
        setValue('qtyStk', projectStoreLocationData[0].quantity);
        setValue('quantity', update && showData && showData.quantity ? showData.quantity : 0);
        setSerials(update && showData && showData.material_serial_numbers ? showData.material_serial_numbers : []);
      }
      setQtyStk(projectStoreLocationData[0].quantity);
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setValue('value', parseFloat(projectStoreLocationData[0].rate * showData.quantity).toFixed(2));
    } else {
      setLoading(false);
      setValue('qtyStk', selectedStoreLocId !== null ? 0 : null);
      setValue('rate', '0');
      setRate(0);
      setValue('tax', '0');
      setValue('value', '0');
      setQtyStk(null);
    }
  }, [projectStoreLocationData, setValue, selectedItems, update, selectedMaterial, selectedStoreLocId, showData]);

  const onStoreLocationSelected = (e) => {
    if (e?.target?.value) {
      setLoading(true);
      setSerials([]);
      setAllSerials([]);
      showData.material_serial_numbers = [];
      setValue('qtyStk', '0');
      setQtyStk('0');
      setSelectedStoreLocName(e?.target?.name);
    }
  };

  useEffect(() => {
    if (!selectedStoreLocId) return;
    dispatch(
      getTxnByLocationMaterial({
        project: formData?.projectId,
        store: formData?.contractorStoreId,
        storeLocation: selectedStoreLocId,
        material: selectedMaterial?.id
      })
    );
  }, [dispatch, formData?.contractorStoreId, formData?.projectId, selectedMaterial?.id, selectedStoreLocId]);

  useEffect(() => {
    if (!selectedStoreLocId) return;
    dispatch(
      getSerialNumbers({
        project: formData?.projectId,
        store: formData?.contractorStoreId,
        storeLocation: selectedStoreLocId,
        material: selectedMaterial?.id
      })
    );
  }, [dispatch, formData?.contractorStoreId, formData?.projectId, selectedMaterial?.id, selectedStoreLocId]);

  const keywordsToExclude = ['missing', 'consumed', 'billing', 'installed', 'installer', 'service-center', 'service center'];

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
            {/* <Grid item xs={12} sm={4} >
              {txtBox('name', 'Materials', 'text', true, undefined, true)}
            </Grid> */}
            <Grid item xs={12} sm={4}>
              {selectBox(
                'fromStoreLocationId',
                'From Store Location',
                filteredLocations &&
                  filteredLocations.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
                true,
                onStoreLocationSelected,
                false
              )}
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
            <Grid item xs={12} sm={2} style={{ display: 'none' }}>
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
            <Grid item xs={12} sm={2} style={{ display: 'none' }}>
              {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2} style={{ display: 'none' }}>
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
  serialNumbersArr: PropTypes.array,
  setSerialNumbersArr: PropTypes.func,
  selectedItems: PropTypes.any,
  filteringStoreId: PropTypes.string
};
export default MaterialInputs;
