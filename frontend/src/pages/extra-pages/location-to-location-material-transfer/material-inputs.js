import { Button, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';
import { getSerialNumbers, getTxnByLocationMaterial } from 'store/actions';
import { concateCodeAndName, isDecimalUom, toFixedQuantity } from 'utils';
import CircularLoader from 'components/CircularLoader';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ materialData, onMaterailsInput, storeLocationData, view, update, showData, formData, selectedItems }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [rate, setRate] = useState(null);
  const [serials, setSerials] = useState([]);
  const [allSerials, setAllSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);
  const [serialError, setSerialError] = useState('');
  const [selectedStoreLocName, setSelectedStoreLocName] = useState('');
  const [selectedStoreLocId, setSelectedStoreLocId] = useState(null);
  const [projectStoreLocationData, setProjectStoreLocationData] = useState([]);
  const [qtyStk, setQtyStk] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isInteger, setIsInteger] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        materialId: Validations.material,
        quantity: isInteger ? Validations.checkForInteger('Quantity', qtyStk) : Validations.maxQuantity(qtyStk, true),
        fromStoreLocationId: Validations.fromStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uom = watch('uom');

  const dispatch = useDispatch();

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      handleSetValues(showData);
      if (showData && showData.rate) setRate(showData.rate);
    }
  }, [view, update, showData, setValue]);

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
          store: formData?.projectSiteStoreId,
          storeLocation: showData?.fromStoreLocationId,
          material: showData?.materialId
        })
      );
      dispatch(
        getSerialNumbers({
          project: formData?.projectId,
          store: formData?.projectSiteStoreId,
          storeLocation: showData?.fromStoreLocationId,
          material: showData?.materialId
        })
      );
      handleSetValues(showData);
    }
  }, [view, update, showData, setValue, formData, dispatch]);

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

  useEffect(() => {
    if (quantity && rate) setValue('value', parseFloat(quantity * rate).toFixed(2));
  }, [quantity, rate, setValue, reset]);

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
        handleChange={handleChange}
        InputLabelProps={{ shrink: shrink }}
        {...((disable || disableAll) && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const setSerialNumbers = (val) => {
    setSerials(val);
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
  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || [],
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  useEffect(() => {
    if (projectStoreLocationData && projectStoreLocationData.length > 0) {
      setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setValue('value', parseFloat(projectStoreLocationData[0].rate * showData.approvedQuantity).toFixed(2));
      setQtyStk(toFixedQuantity(projectStoreLocationData[0].quantity));
    } else {
      setValue('qtyStk', '0');
      setValue('rate', '0');
      setRate(0);
      setValue('tax', '0');
      setValue('value', '0');
      setQtyStk(0);
    }
  }, [projectStoreLocationData, setValue, showData]);

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
        setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
        setValue('quantity', alreadyAvailableItem.quantity);
        setSerials(alreadyAvailableItem.material_serial_numbers);
      } else {
        setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
        setValue('quantity', update && showData && showData.quantity ? showData.quantity : 0);
        setSerials(update && showData && showData.material_serial_numbers ? showData.material_serial_numbers : []);
      }
      setQtyStk(toFixedQuantity(projectStoreLocationData[0].quantity));
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setValue('value', parseFloat(projectStoreLocationData[0].rate * showData.approvedQuantity).toFixed(2));
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

  const onMaterialSelected = (e) => {
    if (e?.target?.value) {
      let data = e?.target?.row;
      setValue('name', data?.name);
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

  const onStoreLocationSelected = (e) => {
    if (e?.target?.value) {
      setLoading(true);
      setSerials([]);
      setAllSerials([]);
      showData.material_serial_numbers = [];
      setValue('qtyStk', '0');
      setQtyStk('0');
      setSelectedStoreLocId(e?.target?.value);
      setSelectedStoreLocName(e?.target?.name);
      dispatch(
        getTxnByLocationMaterial({
          project: formData?.projectId,
          store: formData?.projectSiteStoreId,
          storeLocation: e?.target?.value,
          material: selectedMaterial?.id
        })
      );
      dispatch(
        getSerialNumbers({
          project: formData?.projectId,
          store: formData?.projectSiteStoreId,
          storeLocation: e?.target?.value,
          material: selectedMaterial?.id
        })
      );
    }
  };

  const keywordsToExclude = ['consumed', 'billing', 'installed', 'installer', 'service-center', 'service center'];

  return (
    <>
      <FormProvider methods={methods}>
        {loading && <CircularLoader />}
        <Grid container spacing={2} sx={{ mt: 2, mb: 2.5 }}>
          <Grid item xs={12} sm={4}>
            {selectBox('materialId', 'Material', concateCodeAndName(materialData), true, onMaterialSelected, update ? true : false)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {txtBox('code', 'Code', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={1} style={{ display: 'none' }}>
            {txtBox('name', 'name', 'text', true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {selectBox(
              'fromStoreLocationId',
              'From Store Location',
              storeLocationData &&
                storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
              true,
              onStoreLocationSelected,
              false
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('quantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
              if (isDecimalUom(uom)) setIsInteger(false);
              else setIsInteger(true);
              setQuantity(e.target.value);
            })}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('qtyStk', 'Qty In Stock', 'number', false, undefined, true)}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('uom', 'UOM', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'none' }}>
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
          <Grid item xs={12} sm={2} sx={{ display: 'none' }}>
            {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'none' }}>
            {txtBox('value', 'Value', 'number', true, undefined, true)}
          </Grid>

          <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
            {(selectedMaterial?.isSerialNumber || (update && showData?.isSerialNumber)) && (
              <>
                <Typography mb={-1}>SerialNumber</Typography> <br />
                <Button
                  size="small"
                  onClick={() => {
                    setAllSerials(serialNumbersData[selectedMaterial?.id]);
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
          <Grid item xs={12} sm={2} style={{ display: 'none' }}>
            {txtBox('uomId', 'UOMId', 'text', true)}
          </Grid>
          <Grid item xs={12} sm={2} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {!view && (
              <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                {updating ? 'Update' : 'Add'}
              </Button>
            )}

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
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
};

MaterialInputs.propTypes = {
  onMaterailsInput: PropTypes.func,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  storeLocationData: PropTypes.array,
  materialData: PropTypes.array,
  formData: PropTypes.any,
  selectedItems: PropTypes.object
};
export default MaterialInputs;
