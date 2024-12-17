import { Button, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import { concateCodeAndName, isDecimalUom, toFixedQuantity } from 'utils';
import { getSerialNumbers, getTxnByLocationMaterial } from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';

const MaterialInputs = ({ materialData, onMaterailsInput, storeLocationData, view, update, showData }) => {
  const dispatch = useDispatch();
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(showData && showData.quantity ? showData?.quantity : null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [originalSerialNumberData, setOriginalSerialNumberData] = useState([]);
  const [openSerials, setOpenSerials] = useState(false);
  const [serials, setSerials] = useState([]);
  const [serialError, setSerialError] = useState('');
  const [qtyStk, setQtyStk] = useState(null);
  const [isSerialNumber, setIsSerialNumber] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isInteger, setIsInteger] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        materialId: Validations.material,
        quantity: isInteger ? Validations.checkForInteger('Quantity', qtyStk) : Validations.maxQuantity(qtyStk, true),
        fromStoreLocationId: Validations.requiredWithLabel('Store Location')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uom = watch('uom');

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const getStoreLocationAndSerials = useCallback(
    (material, store) => {
      dispatch(
        getSerialNumbers({
          project: material?.project,
          store: material?.store?.id,
          storeLocation: store,
          material: material?.id
        })
      );
      dispatch(
        getTxnByLocationMaterial({
          project: material?.project,
          store: material?.store?.id,
          storeLocation: store,
          material: material?.id
        })
      );
    },
    [dispatch]
  );

  const {
    serialNumbers: { data: serialNumbersData },
    txnByLocationMaterial: { stocksObject: projectStoreLocationData }
  } = useStockLedger();

  useEffect(() => {
    if (projectStoreLocationData && projectStoreLocationData.length > 0) {
      setLoading(false);
      setValue('qtyStk', toFixedQuantity(projectStoreLocationData[0].quantity));
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setRate(parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setQtyStk(toFixedQuantity(projectStoreLocationData[0].quantity));
    } else {
      setLoading(false);
      setValue('qtyStk', 0);
      setValue('rate', 0);
      setRate(0);
      setValue('tax', 0);
      setValue('value', 0);
      setQtyStk(0);
    }
  }, [projectStoreLocationData, setValue]);

  useEffect(() => {
    if (serialNumbersData) {
      setOriginalSerialNumberData(serialNumbersData[selectedMaterial?.id]);
    } else {
      setOriginalSerialNumberData(showData?.material_serial_numbers || []);
    }
  }, [serialNumbersData, selectedMaterial, showData]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if ((view || update) && showData) {
      handleSetValues(showData);
      setSelectedMaterial(showData);
      setRate(showData.rate);
      setQuantity(showData.quantity);
      setSerials(showData?.material_serial_numbers ?? []);
      setIsSerialNumber(showData?.isSerialNumber);
      getStoreLocationAndSerials(showData, showData?.storeLocation?.id);
      if (showData && showData.rate) setRate(showData.rate);
    }
  }, [view, update, showData, getStoreLocationAndSerials, setValue]);

  const getStoreLocationData = (id) => {
    const data = storeLocationData.filter((val) => val.id === id);
    return data[0];
  };

  const onFormSubmit = (values) => {
    if (isSerialNumber && serials.length === 0) setSerialError('Serial Number is required');
    else if (isSerialNumber && serials.length !== Number(values.quantity)) {
      setSerialError(`Please select a total of ${values.quantity} serial numbers`);
    } else {
      values['material_serial_numbers'] = serials;
      if (update) onMaterailsInput(values, showData.id);
      else {
        values['storeLocation'] = getStoreLocationData(values.fromStoreLocationId);
        onMaterailsInput(values, selectedMaterial.id);
      }
      setSerials([]);
      setOriginalSerialNumberData([]);
      setSerialError('');
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

  // const fetchMaterial = (id) => {
  //   const res = materialData.filter((obj) => obj.id === id);
  //   return res && res.length ? res[0] : { name: '', code: '' };
  // };

  const onMaterialSelected = (e) => {
    if (e) {
      const matData = e?.target?.row;
      setSelectedMaterial(matData);
      setIsSerialNumber(matData.isSerialNumber);
      setValue('name', matData?.name);
      setValue('code', matData?.code);
      setValue('uom', matData?.uomName);
      setValue('uomId', matData?.uomId);
      setValue('rate', matData?.rate);
      setValue('tax', matData?.tax);
      setQtyStk(null);
      setValue('fromStoreLocationId', null);
      setValue('quantity', null);
      setValue('qtyStk', null);
      setRate(matData?.rate);
    } else {
      setValue('name', '');
      setValue('code', '');
      setValue('uom', '');
      setValue('uomId', '');
      setValue('rate', '');
      setValue('tax', '');
      setRate(null);
      setSelectedMaterial(null);
      setQuantity(null);
    }
  };

  const onStoreLocationSelected = (e) => {
    setLoading(true);
    getStoreLocationAndSerials(selectedMaterial, e?.target?.value);
    setSerials([]);
  };

  const setSerialNumbers = (val) => {
    setSerials(val);
  };

  const keywordsToExclude = [
    'faulty',
    'scrap',
    'missing',
    'consumed',
    'billing',
    'installed',
    'installer',
    'old',
    'service-center',
    'service center',
    'defective',
    'damage',
    'non-repairable',
    'non repairable'
  ];

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
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
            <Grid item md={2}>
              {txtBox('qtyStk', 'Qty In Stock', 'number', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('uom', 'UOM', 'text', true, () => {}, true)}
            </Grid>
            <Grid item xs={12} sm={2} style={{ display: 'none' }}>
              {txtBox('uomId', 'UOMId', 'text', true)}
            </Grid>
            <Grid item md={2}>
              {txtBox('value', 'Value', 'number', true, undefined, true)}
            </Grid>

            <Grid item md={1} sx={{ textAlign: 'center' }}>
              {isSerialNumber && (
                <>
                  <Typography mb={-1}>Serial No</Typography> <br />
                  <Button
                    size="small"
                    onClick={() => {
                      setSerialNumbers(serials ?? showData.material_serial_numbers ?? []);
                      setOpenSerials(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    View
                  </Button>
                  {serialError && serialError !== '' && (
                    <>
                      <br />
                      <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                        {serialError}
                      </Typography>
                    </>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={2} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {!view && (
                <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                  {update ? 'Update' : 'Add'}
                </Button>
              )}
            </Grid>
          </Grid>
          {openSerials && (
            <MaterialSerialNumberModal
              open={openSerials}
              onClose={() => setOpenSerials(false)}
              maxQuantity={quantity}
              onSave={(data) => {
                setSerials(data);
              }}
              selectedSerials={serials}
              showCheckboxes
              serialNumberData={originalSerialNumberData}
            />
          )}
        </FormProvider>
      </MainCard>
    </>
  );
};

MaterialInputs.propTypes = {
  onMaterailsInput: PropTypes.func,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  storeLocationData: PropTypes.array,
  materialData: PropTypes.array
};
export default MaterialInputs;
