import { Button, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ onMaterailsInput, storeLocationData, view, update, showData, hideTaxDetails = false }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(showData && showData.quantity ? showData?.quantity : null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
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
        quantity: Validations.trxnQuantity,
        fromStoreLocationId: Validations.fromStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName !== 'actions') setValue(fieldName, value);
        if (fieldName === 'uom') setValue(fieldName, typeof value === 'string' ? value : value.name);
      });
    };

    if ((view || update) && showData) {
      handleSetValues(showData);
      if (showData.fromStoreLocationId) setValue('fromStoreLocationId', showData.fromStoreLocationId);
      else setValue('fromStoreLocationId', '');
    }
  }, [view, update, showData, reset, setValue]);

  const storeLoc = (fromStoreLocationId) => {
    return storeLocationData.filter((val) => val.id === fromStoreLocationId)[0];
  };

  const onFormSubmit = (values) => {
    if (values.material_serial_numbers.length > quantity)
      values.material_serial_numbers = values.material_serial_numbers.slice(0, quantity);
    values.fromStoreLocation = storeLoc(values.fromStoreLocationId);
    values.tax = values.tax === 0 ? '0' : values.tax;
    onMaterailsInput(values, showData.id);
    reset();
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
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);

  const setSerialNumbers = (val) => {
    if (quantity && 0 < quantity && quantity <= val.length) {
      setSerials(val.slice(0, quantity));
    } else setSerials(val);
  };

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              {txtBox('code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {txtBox('name', 'Materials', 'text', true, undefined, true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectBox('fromStoreLocationId', 'From Store Location', storeLocationData, true, undefined)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('quantity', 'Quantity', 'number', true, (e) => {
                setQuantity(e?.target?.value);
                setValue('value', (e?.target?.value * rate).toFixed(2));
              })}
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
            <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
              {showData.isSerialNumber && (
                <>
                  <Typography mb={-1}>SerialNumber</Typography> <br />{' '}
                  <Button
                    size="small"
                    onClick={() => {
                      setSerialNumbers(showData.material_serial_numbers);
                      setOpenSerials(true);
                    }}
                    variant={'contained'}
                    color="primary"
                  >
                    View
                  </Button>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={1} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {!view && (
                <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                  {update ? 'Update' : 'Add'}
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
              serialNumberData={serials}
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
  hideTaxDetails: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  storeLocationData: PropTypes.any
};
export default MaterialInputs;
