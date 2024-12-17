import { Button, Grid } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import { concateCodeAndName, isDecimalUom } from 'utils';
import { getTxnByMaterial } from 'store/actions';
import CircularLoader from 'components/CircularLoader';

const MaterialInputs = forwardRef(({ materialData, onMaterailsInput, storeLocationData, view, update, showData, formValues }, ref) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [rate, setRate] = useState(null);
  const [isInteger, setIsInteger] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        materialId: Validations.material,
        requestedQuantity: isInteger ? Validations.checkForInteger('Quantity') : Validations.trxnQuantity,
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
        setValue(fieldName, value);
      });
    };

    if (view || update) {
      handleSetValues(showData);
      if (showData && showData.rate) setRate(showData.rate);
    }
  }, [view, update, showData, setValue]);

  const getStoreLocationData = (id) => {
    const data = storeLocationData.filter((val) => val.id === id);
    return data[0];
  };

  const onFormSubmit = (values) => {
    if (update) {
      values['storeLocation'] = getStoreLocationData(values.toStoreLocationId);
      onMaterailsInput(values, showData.id);
    } else {
      values['storeLocation'] = getStoreLocationData(values.toStoreLocationId);
      onMaterailsInput(values);
    }
    reset();
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

  const fetchMaterial = (id) => {
    const res = materialData.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : { name: '', code: '' };
  };

  const { txnByMaterial } = useStockLedger();

  let { txnData } = useMemo(
    () => ({
      txnData: txnByMaterial?.stocksObject || [],
      isLoading: txnByMaterial.loading || false
    }),
    [txnByMaterial]
  );

  useEffect(() => {
    if (txnData && txnData.length > 0) {
      setLoading(false);
      setValue('rate', txnData?.[0]?.rate);
      setValue('tax', txnData?.[0]?.tax);
      setRate(txnData?.[0]?.rate);
    }
  }, [txnData, setValue]);

  const onMaterialSelected = (e) => {
    if (e) {
      const matData = fetchMaterial(e.target.value);
      setLoading(true);
      setValue('name', matData?.name);
      setValue('code', matData?.code);
      setValue('uom', matData?.uom_name);
      setValue('uomId', matData?.uom_id);
      dispatch(getTxnByMaterial({ project: formValues.projectId, store: formValues.fromStoreId, material: matData.id }));
    } else {
      setValue('name', '');
      setValue('code', '');
      setValue('uom', '');
      setValue('uomId', '');
      setValue('rate', '');
      setValue('tax', '');
      setRate(null);
    }
    setQuantity(null);
    setValue('requestedQuantity', '');
  };

  useImperativeHandle(ref, () => ({
    reset() {
      reset();
    }
  }));

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
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mt: 2, mb: 2.5 }}>
          {loading && <CircularLoader />}
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
              'toStoreLocationId',
              'To Store Location',
              storeLocationData &&
                storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
              true,
              undefined,
              false
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('requestedQuantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
              if (isDecimalUom(uom)) setIsInteger(false);
              else setIsInteger(true);
              setQuantity(e.target.value);
            })}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('uom', 'UOM', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={2} style={{ display: 'none' }}>
            {txtBox('uomId', 'UOMId', 'text', true)}
          </Grid>
          <Grid item xs={12} sm={2} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {!view && (
              <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                {update ? 'Update' : 'Add'}
              </Button>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
});

MaterialInputs.propTypes = {
  onMaterailsInput: PropTypes.func,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  storeLocationData: PropTypes.array,
  materialData: PropTypes.array,
  formValues: PropTypes.any
};
export default MaterialInputs;
