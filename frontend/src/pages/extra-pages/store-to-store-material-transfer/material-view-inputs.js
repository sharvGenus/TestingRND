import { Button, Grid, Typography } from '@mui/material';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { getMasterMakerLov, getSerialNumbers, getTxnByLocationMaterial } from 'store/actions';
import toast from 'utils/ToastNotistack';
import Loadable from 'components/Loadable';
import { isDecimalUom, toFixedQuantity } from 'utils';
import CircularLoader from 'components/CircularLoader';

const MaterialSerialNumberModal = Loadable(lazy(() => import('components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal')));

const MaterialInputs = ({
  onMaterailsInput: setMaterials,
  view,
  update,
  showData: selectedData,
  storeLocationData,
  maxQuantity,
  showCheckboxes
}) => {
  const [disableAll, setDisableAll] = useState(false);
  const [rate, setRate] = useState(selectedData && selectedData.rate ? selectedData?.rate : null);
  const [originalSerialNumberData, setOriginalSerialNumberData] = useState([]);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
  const [serialModalOpen, setSerialModalOpen] = useState(false);
  const [serialError, setSerialError] = useState(false);
  const [qtyStk, setQtyStk] = useState('');
  const [isInteger, setIsInteger] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSerialNumber = !!selectedData?.material?.isSerialNumber;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        approvedQuantity: isInteger
          ? Validations.checkForInteger('Quantity', maxQuantity < qtyStk || !qtyStk ? maxQuantity : qtyStk)
          : Validations.maxQuantity(maxQuantity < qtyStk || !qtyStk ? maxQuantity : qtyStk, true),
        fromStoreLocationId: Validations.requiredWithLabel('Company Store Location')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;

  const quantity = watch('approvedQuantity');
  const fromStoreLocationId = watch('fromStoreLocationId');
  const uom = watch('uom');

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName !== 'actions') setValue(fieldName, value);
        if (fieldName === 'uom') setValue(fieldName, value.name);
        if (fieldName === 'rate') setValue(fieldName, parseFloat(value)?.toFixed(2));
      });
    };

    if ((view || update) && selectedData) {
      handleSetValues(selectedData);
      // if (selectedData.) setValue(fieldName, parseFloat(value)?.toFixed(2));
      if (!selectedData.fromStoreLocationId || selectedData.fromStoreLocationId === null) setValue('fromStoreLocationId', '');
    }
  }, [view, update, selectedData, reset, setValue]);

  const getLocationData = (value) => {
    return storeLocationData.filter((val) => val.id === value.fromStoreLocationId)[0];
  };

  const onFormSubmit = (values) => {
    if (isSerialNumber && values.approvedQuantity !== selectedSerialNumbers.length) {
      setSerialError(true);
      return;
    }

    setSerialError(false);

    if (parseInt(values.approvedQuantity) > parseInt(values.qtyInStock)) {
      toast('Quantity should be less than or equal to quantity in stock', { variant: 'error' });
      return;
    }

    values['from_store_location'] = getLocationData(values);
    values.fromStoreLocation = getLocationData(values);
    values.approvedQuantity = values.approvedQuantity > 0 ? values.approvedQuantity : '0';
    setMaterials({ ...values, material_serial_numbers: selectedSerialNumbers }, selectedData.id);
    reset();
  };

  const { serialNumbers, txnByLocationMaterial } = useStockLedger();

  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || {},
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  let { projectStoreLocationData } = useMemo(
    () => ({
      projectStoreLocationData:
        (fromStoreLocationId && txnByLocationMaterial?.stocksObject?.filter((item) => item.storeLocationId === fromStoreLocationId)) || [],
      isLoading: txnByLocationMaterial.loading || false
    }),
    [fromStoreLocationId, txnByLocationMaterial.loading, txnByLocationMaterial?.stocksObject]
  );

  useEffect(() => {
    if (projectStoreLocationData && projectStoreLocationData.length > 0) {
      setLoading(false);
      setValue('qtyInStock', toFixedQuantity(projectStoreLocationData[0].quantity));
      setValue('rate', parseFloat(projectStoreLocationData[0].rate).toFixed(2));
      setValue('tax', projectStoreLocationData[0].tax);
      setValue('value', parseFloat(projectStoreLocationData[0].rate * selectedData.approvedQuantity).toFixed(2));
      setRate(projectStoreLocationData[0].rate);
      setQtyStk(projectStoreLocationData[0].quantity);
    } else {
      setLoading(false);
      setValue('qtyInStock', '0');
      setValue('rate', '0');
      setValue('tax', '0');
      setValue('value', '0');
      setRate(0);
      setQtyStk(0);
    }
  }, [projectStoreLocationData, setValue, selectedData]);

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

  const selectBox = (name, label, menus, req, handleChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(disableAll && { disable: true })}
        {...(req && { required: true })}
      />
    );
  };

  useEffect(() => {
    if (serialNumbersData) {
      setOriginalSerialNumberData(serialNumbersData[selectedData?.material?.id]);
    } else {
      setOriginalSerialNumberData(selectedData?.material_serial_numbers || []);
    }
  }, [serialNumbersData, selectedData?.material?.id, selectedData?.material_serial_numbers]);

  useEffect(() => {
    setSelectedSerialNumbers(selectedData?.material_serial_numbers || []);
  }, [selectedData?.material_serial_numbers]);

  const onStoreLocationSelected = (e) => {
    if (e?.target?.value) {
      setLoading(true);
      dispatch(
        getSerialNumbers({
          project: selectedData?.projectId,
          store: selectedData?.fromStoreId,
          storeLocation: e?.target?.value,
          material: selectedData?.material?.id
        })
      );
      dispatch(
        getTxnByLocationMaterial({
          project: selectedData?.projectId,
          store: selectedData?.fromStoreId,
          storeLocation: e?.target?.value,
          material: selectedData?.material?.id
        })
      );
    }
  };

  useEffect(() => {
    setSerialError(false);
  }, [selectedSerialNumbers]);

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
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item md={4}>
              {txtBox('material.code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={4}>
              {txtBox('material.name', 'Materials', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={4}>
              {selectBox(
                'fromStoreLocationId',
                'Company Store Location ',
                storeLocationData &&
                  storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
                true,
                onStoreLocationSelected
              )}
            </Grid>
            <Grid item md={2}>
              {txtBox('approvedQuantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
                if (isDecimalUom(uom)) setIsInteger(false);
                else setIsInteger(true);
                setValue('value', parseFloat(e?.target?.value * rate).toFixed(2));
                setSelectedSerialNumbers([]);
              })}
            </Grid>
            {/* {selectedData.qtyInStock && ( */}
            <Grid item md={2}>
              {txtBox('qtyInStock', 'Qty In Stock', 'number', true, undefined, true)}
            </Grid>
            {/* )} */}
            <Grid item md={2}>
              {txtBox('uom', 'UOM', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={2} style={{ display: 'none' }}>
              {txtBox('uomId', 'UOMId', 'text', true)}
            </Grid>
            <Grid item md={2} style={{ display: 'none' }}>
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
            <Grid item md={2} style={{ display: 'none' }}>
              {txtBox('value', 'Value', 'number', true, undefined, true)}
            </Grid>
            <Grid item md={1} sx={{ textAlign: 'center' }}>
              {isSerialNumber && (
                <>
                  <Typography mb={-1}>Serial No</Typography> <br />
                  <Button
                    size="small"
                    onClick={() => {
                      setSerialModalOpen(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    View
                  </Button>
                </>
              )}
              {serialError && isSerialNumber && (
                <>
                  <br />
                  <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                    Count of serial numbers must be equal to quantity
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {!view && (
                <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                  {update ? 'Update' : 'Add'}
                </Button>
              )}
            </Grid>
          </Grid>

          {serialModalOpen && (
            <MaterialSerialNumberModal
              open={serialModalOpen}
              onClose={() => {
                setSerialModalOpen(false);
              }}
              maxQuantity={quantity}
              onSave={(data) => {
                setSelectedSerialNumbers(data);
              }}
              selectedSerials={selectedSerialNumbers}
              showCheckboxes={showCheckboxes}
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
  materialData: PropTypes.array,
  view: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  maxQuantity: PropTypes.number,
  storeLocationData: PropTypes.func
};
export default MaterialInputs;
