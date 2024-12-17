import { Button, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import ModalContent from 'components/modal/MaterialSerialNumberModal/serial-modal-content';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import { getCompanyStoreLocations, getMasterMakerLov } from 'store/actions';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import toast from 'utils/ToastNotistack';
import { fetchTransactionType, isDecimalUom, toFixedQuantity } from 'utils';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const MaterialInputs = ({ onMaterailsInput, view, update, showData, maxQuantity, lovData }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [serialError, setSerialError] = useState('');
  const [quantity, setQuantity] = useState(showData && showData.approvedQuantity ? showData?.approvedQuantity : null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [qtyStk, setQtyStk] = useState('');
  const [allSerials, setAllSerials] = useState([]);
  const [serials, setSerials] = useState([]);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [openSerials, setOpenSerials] = useState(false);
  const [storeLocationData, setStoreLocationdata] = useState([]);
  const [consumeType, setConsumeType] = useState('Consumption');
  const [isInteger, setIsInteger] = useState(false);

  const dispatch = useDispatch();

  const consumptionData = [
    {
      id: 'Consumption',
      name: 'Consumption'
    },
    {
      id: 'Installed',
      name: 'Installed'
    }
  ];

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
          : Validations.maxQuantity(maxQuantity < qtyStk || !qtyStk ? maxQuantity : qtyStk),
        storeLocationId: Validations.storeLocationId,
        consumption: Validations.requiredWithLabel('Consumption')
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
        if (fieldName === 'uom') setValue(fieldName, value.name);
        // if (fieldName === 'storeLocationId') setValue(fieldName, '');
      });
    };

    if ((view || update) && showData) {
      handleSetValues(showData);
      if (showData?.from_store_location) {
        setStoreLocationdata([showData?.from_store_location]);
        setValue('storeLocationId', showData?.fromStoreLocationId);
        setRate(showData?.rate);
        setQuantity(showData?.approvedQuantity);
        setQtyStk(toFixedQuantity(showData?.qtyInStk));
        setValue('value', (showData?.rate * showData?.approvedQuantity).toFixed(2));
      }
      setSerials(showData.material_serial_numbers ? showData.material_serial_numbers : []);
    }
  }, [view, update, showData, reset, setValue]);

  const onFormSubmit = (values) => {
    if (values && values?.material && values?.material?.isSerialNumber && serials.length === 0) setSerialError('Serial Number is required');
    else if (values && values?.material && values?.material?.isSerialNumber && serials.length !== values.approvedQuantity)
      setSerialError(`Please select a total of ${values.approvedQuantity} serial numbers`);
    else {
      values.approvedQuantity = values.approvedQuantity > 0 ? values.approvedQuantity : '0';
      values.material_serial_numbers = serials;
      onMaterailsInput(values, showData.id);
      setSerialError('');
      reset();
    }
  };

  const selectBox = (name, label, menus, req, handleChange, disable = false) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...((disableAll || disable) && { disable: true })}
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

  const {
    companyStoreLocations: {
      companyStoreLocationsObject: { rows: companyStoreData }
    }
  } = useOrganizationStoreLocation();

  const onConsumptionSelection = (e) => {
    setConsumeType(e?.target?.value);
    if (e?.target?.value === 'Installed') {
      const { to_store: storeData } = showData;
      if (!storeData) toast('Store not found.', { variant: 'error' });
      const companyId = fetchTransactionType(lovData, 'COMPANY');
      dispatch(getCompanyStoreLocations({ organizationType: companyId }));
      const installedStoreLocationExist = companyStoreData.filter(
        (val) => val.organizationStoreId === storeData?.id && val?.name?.toLowerCase()?.includes('installed')
      );
      if (installedStoreLocationExist.length === 0)
        toast(`Installed Store Location not found in ${storeData.name} - ${storeData.code}`, { variant: 'error' });
      else {
        setValue(
          'companyOrg',
          storeData?.organization?.parentId === null ? storeData?.organization?.name : storeData?.organization?.parent?.name
        );
        setValue('companyStore', storeData?.name);
        setValue('toStoreLocationId', installedStoreLocationExist?.[0]?.id);
      }
    }
  };

  return (
    <>
      <MainCard sx={{ mb: 2, pb: 4 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item md={3}>
              {txtBox('material.code', 'Code', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={3}>
              {txtBox('material.name', 'Materials', 'text', true, undefined, true)}
            </Grid>
            <Grid item md={3}>
              {selectBox('storeLocationId', 'Store Location', storeLocationData, true, undefined, true)}
            </Grid>
            <Grid item md={3}>
              {selectBox('consumption', 'Consumption', consumptionData, true, onConsumptionSelection)}
            </Grid>
            <Grid item md={2}>
              {txtBox('approvedQuantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
                if (isDecimalUom(uom)) setIsInteger(false);
                else setIsInteger(true);
                setQuantity(e?.target?.value);
                setValue('value', e?.target?.value * rate);
              })}
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
            {/* <Grid item md={2}>
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
            </Grid> */}
            {/* <Grid item md={2}>
              {txtBox('tax', 'Tax%', 'text', true, undefined, true)}
            </Grid> */}
            {/* <Grid item md={2}>
              {txtBox('value', 'Value', 'text', true, undefined, true)}
            </Grid> */}
            <Grid item md={1} sx={{ textAlign: 'center' }}>
              {showData?.material?.isSerialNumber && (
                <>
                  <Typography mb={-1}>Serial No</Typography> <br />
                  <Button
                    size="small"
                    onClick={() => {
                      setAllSerials(JSON.parse(showData?.serialNumbers));
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
            {consumeType === 'Installed' && (
              <>
                <Grid item md={2}>
                  {txtBox('companyOrg', 'Company', 'text', true, undefined, true)}
                </Grid>
                <Grid item md={2}>
                  {txtBox('companyStore', 'Company Store', 'text', true, undefined, true)}
                </Grid>
              </>
            )}
            <Grid item xs={1} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
  materialData: PropTypes.array,
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  maxQuantity: PropTypes.number,
  toStoreLocationData: PropTypes.array,
  lovData: PropTypes.array
};
export default MaterialInputs;
