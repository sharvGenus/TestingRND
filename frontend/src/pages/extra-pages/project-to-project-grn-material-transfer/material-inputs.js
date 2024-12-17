import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import { isDecimalUom } from 'utils';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import MainCard from 'components/MainCard';

const MaterialInputs = ({ onMaterailsInput, storeLocationData, view, update, showData }) => {
  const [disableAll, setDisableAll] = useState(false);
  const [quantity, setQuantity] = useState(showData && showData.quantity ? showData?.quantity : null);
  const [rate, setRate] = useState(showData && showData.rate ? showData?.rate : null);
  const [openSerials, setOpenSerials] = useState(false);
  const [serials, setSerials] = useState([]);
  const [isSerialNumber, setIsSerialNumber] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        storeLocationId: Validations.requiredWithLabel('Store Location')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uomName = watch('uomName');

  useEffect(() => {
    if (view) setDisableAll(true);
    else setDisableAll(false);
  }, [view, update]);

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
      if (showData && showData.rate) setRate(showData.rate);
    }
  }, [view, update, showData, setValue]);

  const getLocfromId = (id) => {
    const record = storeLocationData.filter((val) => val.id === id);
    return record[0];
  };
  const onFormSubmit = (values) => {
    values['storeLocation'] = getLocfromId(values.storeLocationId);
    onMaterailsInput(values, selectedMaterial.id);
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
          <Grid container spacing={2} sx={{ mt: 2, mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              {txtBox('name', 'Material', 'text', true, () => {}, true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {txtBox('code', 'Code', 'text', true, () => {}, true)}
            </Grid>
            <Grid item xs={12} sm={1} style={{ display: 'none' }}>
              {txtBox('name', 'name', 'text', true)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectBox(
                'storeLocationId',
                'Store Location',
                storeLocationData &&
                  storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
                true,
                () => {},
                false
              )}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('quantity', 'Quantity', isDecimalUom(uomName) ? 'text' : 'number', true, () => {}, true)}
            </Grid>
            <Grid item xs={12} sm={2}>
              {txtBox('uomName', 'UOM', 'text', true, () => {}, true)}
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
                      getSerials(serials ?? showData.material_serial_numbers ?? []);
                      setOpenSerials(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    View
                  </Button>
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
  view: PropTypes.bool,
  update: PropTypes.bool,
  showData: PropTypes.any,
  storeLocationData: PropTypes.array,
  materialData: PropTypes.array
};
export default MaterialInputs;
