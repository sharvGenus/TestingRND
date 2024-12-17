import { Button, Grid, Modal, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { getMasterMakerLov } from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import request from 'utils/request';
import { isDecimalUom, sortAlphanumeric, toFixedQuantity } from 'utils';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({
  materials,
  onMaterailsInput,
  formData,
  view,
  update,
  showData
  // selectedItems
}) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [qtyStk, setQtyStk] = useState(null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [serialError, setSerialError] = useState('');
  const [selectedStoreLocName, setSelectedStoreLocName] = useState('');
  const [selectedStoreLocId, setSelectedStoreLocId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [storeLocationData, setStoreLocationData] = useState([]);
  const [serials, setSerials] = useState([]);
  const [allSerials, setAllSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);
  const [serialNumbersData, setSerialNumbersData] = useState([]);
  const [selectedStoreLocation, setSelectedStoreLocation] = useState(null);
  const [isInteger, setIsInteger] = useState(false);
  const dispatch = useDispatch();

  const getAllLocations = useCallback(async () => {
    const response = await request('/organization-store-location-list-data', {
      method: 'GET',
      query: {
        organizationType: formData.organizationTypeId,
        organizationStoreId: formData.toProjectSiteStoreId
      }
    });
    if (response.success) {
      const data = response?.data?.data;
      setStoreLocationData(data?.rows);
    }
  }, [formData]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
    getAllLocations();
  }, [dispatch, getAllLocations]);

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        materialId: Validations.requiredWithLabel('Material'),
        quantity: isInteger ? Validations.checkForInteger('Quantity', qtyStk) : Validations.maxQuantity(qtyStk, true),
        toStoreLocationId: Validations.toStoreLocationId
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
      });
    };

    if ((view || update) && showData) {
      setUpdating(true);
      setSelectedMaterial(showData);
      setQtyStk(toFixedQuantity(showData?.qtyStk));
      handleSetValues(showData);
      // setStoreLocationData([showData?.receiveStoreLocation]);
      setValue('toStoreLocationId', showData?.toStoreLocationId);
      setValue('uomId', showData?.uomId);
      setValue('uom', showData?.uom);
      setSelectedStoreLocId(showData?.toStoreLocationId);
      setSelectedStoreLocName(showData?.receiveStoreLocation?.name);
      setSerials(showData?.material_serial_numbers);
      setRate(showData?.rate);
      setQuantity(showData?.quantity);
    }
  }, [view, update, showData, setValue, formData]);

  const onFormSubmit = (values) => {
    if (selectedMaterial && selectedMaterial?.material?.isSerialNumber && serials.length === 0) setSerialError('Serial Number is required');
    else if (selectedMaterial && selectedMaterial?.material?.isSerialNumber && serials.length !== values.quantity)
      setSerialError(`Please select a total of ${values.quantity} serial numbers.`);
    else {
      setSerialError(false);
      if (serials) values.material_serial_numbers = serials;
      values.tax = values.tax === 0 ? '0' : values.tax;
      values.fromStoreLocationName = selectedStoreLocName;
      values.requestNumber = selectedMaterial.referenceDocumentNumber;
      values['receiveStoreLocation'] = selectedStoreLocation;
      onMaterailsInput(values, selectedMaterial?.materialId, selectedMaterial?.materialId + selectedStoreLocId);
      setSerials([]);
      setAllSerials([]);
      setSelectedMaterial(null);
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

  const setSerialNumbers = (val) => {
    setSerials(val);
  };

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const onMaterialSelected = (e) => {
    if (e?.target?.value) {
      let data = e?.target?.row;
      if (data?.material?.isSerialNumber) setSerialNumbersData(data?.serialNumbers);
      setValue('qtyStk', toFixedQuantity(data?.quantity));
      setQtyStk(toFixedQuantity(data?.quantity));

      setValue('code', data?.code);
      setValue('rate', data?.rate?.toFixed(2));
      setValue('tax', data?.tax);
      setValue('value', data?.value?.toFixed(2));
      setValue('uom', data?.uom?.name);
      setValue('uomId', data?.uom?.id);
      setValue('toStoreLocationId', data?.receiveStoreLocation?.id);
      setSelectedStoreLocId(data?.receiveStoreLocation?.id);
      setSelectedStoreLocName(data?.receiveStoreLocation?.name);
      setSelectedStoreLocation(data?.receiveStoreLocation);
      setValue('quantity', null);
      setSelectedMaterial(data);
      setRate(data?.rate?.toFixed(2));
    }
  };

  const concateCodeAndName = (arr) => {
    const newValue =
      arr &&
      arr.length > 0 &&
      arr.map((val) => ({
        ...val,
        mainId: val?.id,
        id: val?.material?.id,
        name: val?.material?.code + ' - ' + val?.material?.name,
        code: val?.material?.code
      }));
    return newValue || [];
  };

  const getSN = (arr) => {
    setValue('allSerials', arr);
    return sortAlphanumeric(arr);
  };

  const keywordsToExclude = ['missing', 'consumed', 'billing', 'installed', 'installer', 'old', 'service-center', 'service center'];

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              {selectBox('materialId', 'Material', concateCodeAndName(materials), true, onMaterialSelected, update ? true : false)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {txtBox('code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectBox(
                'toStoreLocationId',
                'To Store Location',
                storeLocationData &&
                  storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
                true,
                (e) => {
                  setSelectedStoreLocation(e?.target?.row);
                  setSelectedStoreLocId(e?.target?.value);
                  setSelectedStoreLocName(e?.target?.row?.name);
                }
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
            <Grid item xs={12} sm={2}>
              {txtBox(
                'rate',
                'Rate',
                'text',
                true,
                (e) => {
                  let scRate = e?.target?.value;
                  setRate(scRate.toFixed(2));
                },
                true
              )}
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'none' }}>
              {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('value', 'Value', 'number', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
              {(selectedMaterial?.material?.isSerialNumber || (update && showData?.isSerialNumber)) && (
                <>
                  <Typography mb={-1}>SerialNumber</Typography> <br />{' '}
                  <Button
                    size="small"
                    onClick={() => {
                      setAllSerials(
                        serialNumbersData && !update ? getSN(serialNumbersData) : showData && showData.allSerials ? showData.allSerials : []
                      );
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
            <Grid item xs={12} sm={12} mt={4} textAlign={'right'}>
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
  selectedItems: PropTypes.any
};

export default MaterialInputs;
