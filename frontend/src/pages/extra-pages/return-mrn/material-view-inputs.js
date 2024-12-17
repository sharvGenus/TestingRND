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
import { isDecimalUom } from 'utils';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ onMaterailsInput, view, update, showData, toStoreLocationData }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [serialError, setSerialError] = useState('');
  const [quantity, setQuantity] = useState(showData && showData.quantity ? showData?.quantity : null);
  const [serials, setSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);
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
        // quantity: Validations.maxQuantity(maxQuantity),
        toStoreLocationId: Validations.toStoreLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uom = watch('uom');

  const getSerials = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push(typeof val === 'object' ? val.serialNumber : val);
      });
    setSerials(newArr);
    return newArr;
  };

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName !== 'actions') setValue(fieldName, value);
        if (fieldName === 'uom') setValue(fieldName, value.name);
      });
    };

    if ((view || update) && showData) {
      handleSetValues(showData);
      setQuantity(showData.quantity);
    }
  }, [view, update, showData, reset, setValue]);

  const getStoreLocationData = (id) => {
    const data = toStoreLocationData.filter((val) => val.id === id);
    return data[0];
  };

  const onFormSubmit = (values) => {
    values.toLocation = getStoreLocationData(values.toStoreLocationId);
    values.quantity = values.quantity > 0 ? values.quantity : '0';
    values.serialNumbers = JSON.stringify(values.material_serial_numbers);
    onMaterailsInput(values, showData.id);
    setSerialError('');
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

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const keywordsToExclude = ['missing', 'consumed', 'billing', 'installed', 'installer', 'old', 'service-center', 'service center'];

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item md={4}>
              {txtBox('material.code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={4}>
              {txtBox('material.name', 'Material', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={4}>
              {selectBox(
                'toStoreLocationId',
                'To Store Location',
                toStoreLocationData &&
                  toStoreLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
                true
              )}
            </Grid>
            <Grid item md={2}>
              {txtBox('quantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, undefined, true)}
            </Grid>
            {/* <Grid item md={2}>
              {txtBox('qtyInStock', 'Qty In Stock', 'number', true, undefined, true)}
            </Grid> */}
            <Grid item md={2}>
              {txtBox('uom', 'UOM', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={2} style={{ display: 'none' }}>
              {txtBox('uomId', 'UOMId', 'text', true)}
            </Grid>
            <Grid item md={2} style={{ display: 'none' }}>
              {txtBox('rate', 'Rate', 'text', true, undefined, true)}
            </Grid>
            {/* <Grid item md={2}>
              {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
            </Grid> */}
            <Grid item md={2} style={{ display: 'none' }}>
              {txtBox('value', 'Value', 'text', true, undefined, true)}
            </Grid>

            <Grid item md={1} sx={{ textAlign: 'center' }}>
              {showData?.material?.isSerialNumber && (
                <>
                  <Typography mb={-1}>Serial No</Typography> <br />
                  <Button
                    size="small"
                    onClick={() => {
                      getSerials(showData.material_serial_numbers);
                      setOpenSerials(true);
                    }}
                    variant="contained"
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
            <Grid item xs={1} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {!view && (
                <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
                  {update ? 'Update' : 'Add'}
                </Button>
              )}
            </Grid>
          </Grid>

          <Modal open={uploadSerials} onClose={handleCloseSerial} aria-labelledby="modal-modal-title">
            <ModalContent handleCloseSerial={handleCloseSerial} closeCss={closeCss} quantity={quantity} setSerialNumbers={() => {}} />
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
  update: PropTypes.bool,
  showData: PropTypes.any,
  maxQuantity: PropTypes.number,
  toStoreLocationData: PropTypes.array
};
export default MaterialInputs;
