import { Avatar, Button, Divider, Grid, IconButton, Modal, Typography } from '@mui/material';
import { lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CheckOutlined } from '@ant-design/icons';
import { useMaterial } from '../material/useMaterial';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import { getMaterial } from 'store/actions';
import Validations from 'constants/yupValidations';
import Loadable from 'components/Loadable';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import { concateCodeAndName, isDecimalUom } from 'utils';

const ModalContent = Loadable(lazy(() => import('components/modal/MaterialSerialNumberModal/serial-modal-content')));
const MaterialSerialNumberModal = Loadable(lazy(() => import('components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal')));

const closeCss = { cursor: 'pointer', fontSize: 24 };

const ListForm = ({
  val,
  index,
  deleteRow,
  updateRow,
  serialNumbersArr,
  setSerialNumbersArr,
  listData,
  isEditingMaterial,
  setIsEditingMaterial
}) => {
  const [openUploadSerials, setOpenUplaodSerials] = useState(false);
  const [openViewSerials, setOpenViewSerials] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [serialError, setSerialError] = useState(false);

  const [quantity, setQuantity] = useState(val.quantity);
  const [rate, setRate] = useState(val.rate);
  const [serials, setSerials] = useState(val.serialNumber);
  const [isInteger, setIsInteger] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        material: Validations.material,
        quantity: isInteger ? Validations.checkForInteger('Quantity') : Validations.trxnQuantity,
        rate: Validations.rate,
        tax: Validations.tax
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;
  const uom = watch('uom');

  const onFormSubmit = (values) => {
    if (val.isSerialNumber && serials.length === 0) setSerialError(true);
    else {
      setSerialError(false);
      values['serialNumber'] = serials;
      updateRow(values, index);
      setEditMode(false);
    }
  };

  useEffect(() => {
    setValue('isSerialize', false);
  }, [setValue]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    handleSetValues(val);
  }, [setValue, val]);

  useEffect(() => {
    if (quantity && rate) setValue('value', (quantity * rate).toFixed(2));
  }, [quantity, rate, setValue]);

  const txtBox = (name, label, type, req, handleChange, disable = false, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        handleChange={handleChange}
        InputLabelProps={{ shrink: shrink }}
        {...(disable && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };

  const handleCloseSerial = () => {
    setOpenUplaodSerials(false);
  };

  const openUpload = () => {
    setOpenUplaodSerials(true);
  };

  const setSerialNumbers = async (valu) => {
    const uniqueSerialNumber = [...new Set(valu)];
    if (uniqueSerialNumber.length < valu.length) {
      toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
    } else {
      let otherSerials = [];
      listData.map((vl, ind) => {
        if (index !== ind && vl.serialNumber && vl.serialNumber.length > 0) otherSerials = [...otherSerials, ...vl.serialNumber];
      });
      let allSRNumbers = [...otherSerials, ...valu];
      let allUniqueSerialNumbers = [...new Set(allSRNumbers)];
      if (allUniqueSerialNumbers.length < allSRNumbers.length) {
        toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
      } else {
        let serialsPayload = {
          materialId: val.material,
          serialNumber: valu
        };
        const srResp = await request('/serial-number-exists', { method: 'POST', body: serialsPayload, timeoutOverride: 60000 });
        if (srResp) {
          if (srResp.data && srResp.data.count === 0) {
            setSerials(valu);
            if (valu.length > 0) {
              let allSerialsList = serialNumbersArr;
              allSerialsList[val.material] = allSRNumbers;
              setSerialNumbersArr(allSerialsList);
              setSerialError(false);
            } else setSerialError(true);
          } else toast(srResp?.error?.message, { variant: 'error' });
        }
      }
    }
  };

  useEffect(() => {
    setIsEditingMaterial(editMode);
  }, [editMode, setIsEditingMaterial]);

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item md={4}>
            {txtBox('code', 'Code', 'text', true, () => {}, true)}
          </Grid>
          <Grid item md={4}>
            {txtBox('name', 'Name', 'text', true, () => {}, true)}
          </Grid>
          <Grid item md={4}>
            {txtBox('storeLocation.name', 'Store Location', 'text', true, () => {}, true)}
          </Grid>
          <Grid item md={2}>
            {txtBox(
              'quantity',
              'Quantity',
              isDecimalUom(uom) ? 'text' : 'number',
              true,
              (e) => {
                if (isDecimalUom(uom)) setIsInteger(false);
                else setIsInteger(true);
                setQuantity(e.target.value);
                setSerials([]);
              },
              editMode ? false : true
            )}
          </Grid>
          <Grid item md={1.5}>
            {txtBox('uom', 'UOM', 'text', true, () => {}, true)}
          </Grid>
          <Grid item md={1} style={{ display: 'none' }}>
            {txtBox('uomId', 'UOMId', 'text', true)}
          </Grid>
          <Grid item md={1.5}>
            {txtBox(
              'rate',
              'Rate',
              'number',
              true,
              (e) => {
                setRate(e.target.value);
              },
              editMode ? false : true
            )}
          </Grid>
          <Grid item md={2}>
            {txtBox('tax', 'Tax%', 'text', true, () => {}, editMode ? false : true)}
          </Grid>
          <Grid item md={2}>
            {txtBox('value', 'Value', 'number', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
            {quantity && rate && val && val.isSerialNumber && (
              <>
                <Typography
                  onClick={() => {
                    setOpenViewSerials(true);
                  }}
                  mb={-1}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  IsSerialNumber
                </Typography>{' '}
                <br />{' '}
                {!editMode ? (
                  <Avatar alt="Basic" type="filled" sx={{ background: 'green', padding: 0, width: 30, height: 30, margin: 'auto' }}>
                    <CheckOutlined />
                  </Avatar>
                ) : (
                  <Button size="small" onClick={openUpload} variant="contained" color="primary">
                    Yes
                  </Button>
                )}
                {serialError && (
                  <>
                    <br />
                    <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                      Serial Number is required
                    </Typography>
                  </>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={1} mt={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {editMode ? (
              <Button onClick={handleSubmit(onFormSubmit)} size="small" variant="contained" color="primary">
                Update
              </Button>
            ) : (
              <>
                <IconButton
                  disabled={isEditingMaterial}
                  color="secondary"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => deleteRow(index)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 3, mb: 3 }}>
          <Grid item md={12} xl={12}>
            <Divider />
          </Grid>
        </Grid>
      </FormProvider>
      {openUploadSerials && (
        <Modal open onClose={handleCloseSerial} aria-labelledby="modal-modal-title">
          <ModalContent
            handleCloseSerial={handleCloseSerial}
            closeCss={closeCss}
            quantity={quantity}
            serialNumbers={serials}
            setSerialNumbers={setSerialNumbers}
          />
        </Modal>
      )}
      {openViewSerials && (
        <MaterialSerialNumberModal
          open
          onClose={() => {
            setOpenViewSerials(false);
          }}
          onSave={setSerialNumbers}
          serialNumberData={serials}
        />
      )}
    </>
  );
};

ListForm.propTypes = {
  val: PropTypes.any,
  index: PropTypes.number,
  deleteRow: PropTypes.func,
  updateRow: PropTypes.func,
  isEditingMaterial: PropTypes.bool,
  setIsEditingMaterial: PropTypes.func,
  serialNumbersArr: PropTypes.any,
  setSerialNumbersArr: PropTypes.func,
  listData: PropTypes.array
};

const MaterialInputs = ({
  onMaterailsInput,
  storeLocationData,
  serialNumbersArr,
  setSerialNumbersArr,
  isEditingMaterial,
  setIsEditingMaterial
}) => {
  const [quantity, setQuantity] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [rate, setRate] = useState(null);
  const [listData, setListData] = useState([]);
  const [isSerialize, setIsSerialize] = useState(false);
  const [uploadSerials, setUploadSerials] = useState(false);
  const [serials, setSerials] = useState([]);
  const [openSerials, setOpenSerials] = useState(false);
  const [serialError, setSerialError] = useState(false);
  const [isInteger, setIsInteger] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        material: Validations.material,
        quantity: isInteger ? Validations.checkForInteger('Quantity') : Validations.trxnQuantity,
        rate: Validations.rate,
        tax: Validations.tax,
        storeLocationId: Validations.storeLocationId
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset, watch } = methods;
  const uom = watch('uom');

  const dispatch = useDispatch();

  const getStoreLocationData = (id) => {
    const data = storeLocationData && storeLocationData.filter((val) => val.id === id);
    return data[0];
  };

  const onFormSubmit = (values) => {
    if (isSerialize && serials.length === 0) setSerialError(true);
    else {
      setSelectedMaterial(selectedMaterial.concat(values.material));
      setSerialError(false);
      values['serialNumber'] = serials;
      values['isSerialNumber'] = isSerialize;
      values['storeLocation'] = getStoreLocationData(values.storeLocationId);
      setListData(listData.concat(values));
      onMaterailsInput(listData.concat(values));
      reset();
      setSerials([]);
      setQuantity(null);
      setRate(null);
    }
  };

  useEffect(() => {
    dispatch(getMaterial());
  }, [dispatch]);

  useEffect(() => {
    setValue('isSerialize', false);
  }, [setValue]);

  useEffect(() => {
    if (quantity && rate) setValue('value', (quantity * rate).toFixed(2));
  }, [quantity, rate, setValue, reset]);

  const { material } = useMaterial();
  const materialData = material?.materialObject.rows;

  const selectBox = (name, label, menus, req, handleChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
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
        {...(disable && { disabled: true })}
        {...(req && { required: true })}
      />
    );
  };

  const fetchMaterial = (id) => {
    const res = materialData && materialData.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : { name: '', code: '' };
  };

  const onMaterialSelected = (e) => {
    if (e) {
      const matData = fetchMaterial(e.target.value);
      setValue('name', matData?.name);
      setValue('code', matData?.code);
      setValue('uom', matData?.material_uom?.name);
      setValue('uomId', matData?.material_uom?.id);
      setIsSerialize(matData.isSerialNumber);
      setCurrentMaterial(e.target.value);
    } else {
      setValue('name', '');
      setValue('code', '');
      setValue('uom', '');
      setValue('uomId', '');
      setIsSerialize(false);
      setCurrentMaterial(null);
    }

    setValue('quantity', '');
    setQuantity(null);
  };

  const deleteRow = (index) => {
    if (listData) {
      const liData = listData.filter((val, ind) => ind !== index);
      setListData(liData);
      setTimeout(() => {
        let newSet = [];
        let newSRS = [];
        liData.map((val) => {
          newSet.push(val.material);
          if (val.serialNumber && val.serialNumber.length > 0) newSRS.push(val.serialNumber);
        });
        setSerialNumbersArr(newSRS);
        setSelectedMaterial(newSet);
        onMaterailsInput(liData);
      }, 100);
    }
  };

  const updateRow = (val, index) => {
    const list = listData;
    list[index] = val;
    setListData(list);
    onMaterailsInput(list);
  };

  const openUpload = () => {
    setUploadSerials(true);
  };

  const handleCloseSerial = () => {
    setUploadSerials(false);
  };

  const setSerialNumbers = async (val) => {
    const uniqueSerialNumber = [...new Set(val)];
    if (uniqueSerialNumber.length < val.length) {
      toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
    } else {
      let currentSerials = serialNumbersArr[currentMaterial] ? serialNumbersArr[currentMaterial] : [];
      let allSRNumbers = [...currentSerials, ...val];
      let allUniqueSerialNumbers = [...new Set(allSRNumbers)];
      if (allUniqueSerialNumbers.length < allSRNumbers.length) {
        toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
      } else {
        let serialsPayload = {
          materialId: currentMaterial,
          serialNumber: val
        };
        const srResp = await request('/serial-number-exists', { method: 'POST', body: serialsPayload, timeoutOverride: 60000 });
        if (srResp) {
          if (srResp.data && srResp.data.count === 0) {
            setSerials(val);
            if (val.length > 0) {
              let allSerialsList = serialNumbersArr;
              allSerialsList[currentMaterial] = [...currentSerials, ...val];
              setSerialNumbersArr(allSerialsList);
              setSerialError(false);
            } else setSerialError(true);
          } else toast(srResp?.error?.message, { variant: 'error' });
        }
      }
    }
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
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mt: 2, display: 'flex', alignItems: 'center', pb: 3 }}>
          <Grid item xs={12} sm={2} xl={2} mt={3}>
            <h2>Materials</h2>
          </Grid>
          <Grid item xs={12} sm={3} xl={2}>
            {selectBox(
              'material',
              'Select Material',
              concateCodeAndName(materialData).filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55'),
              true,
              onMaterialSelected
            )}
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            {txtBox('code', 'Code', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {txtBox('name', 'Name', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {selectBox(
              'storeLocationId',
              'To Store Location',
              storeLocationData &&
                storeLocationData.filter((val) => keywordsToExclude.every((keyword) => !val.name.toLowerCase().includes(keyword))),
              true
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('quantity', 'Quantity', isDecimalUom(uom) ? 'text' : 'number', true, (e) => {
              if (isDecimalUom(uom)) setIsInteger(false);
              else setIsInteger(true);
              setQuantity(e.target.value);
              setSerials([]);
            })}
          </Grid>
          <Grid item xs={12} sm={1.5}>
            {txtBox('uom', 'UOM', 'text', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={1} style={{ display: 'none' }}>
            {txtBox('uomId', 'UOMId', 'text', true)}
          </Grid>
          <Grid item xs={12} sm={1.5}>
            {txtBox('rate', 'Rate', 'text', true, (e) => {
              setRate(e.target.value);
            })}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('tax', 'Tax%', 'text', true)}
          </Grid>
          <Grid item xs={12} sm={2}>
            {txtBox('value', 'Value', 'number', true, () => {}, true)}
          </Grid>
          <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
            {quantity && rate && isSerialize && (
              <>
                <Typography
                  onClick={() => {
                    serials && serials.length > 0 ? setOpenSerials(true) : {};
                  }}
                  mb={-1}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  IsSerialNumber
                </Typography>{' '}
                <br />{' '}
                {serials && serials.length > 0 ? (
                  <Avatar alt="Basic" type="filled" sx={{ background: 'green', padding: 0, width: 30, height: 30, margin: 'auto' }}>
                    <CheckOutlined />
                  </Avatar>
                ) : (
                  <Button size="small" onClick={openUpload} variant="contained" color="primary">
                    Yes
                  </Button>
                )}
                {serialError && (
                  <>
                    <br />
                    <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                      Serial Number is required
                    </Typography>
                  </>
                )}
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={1} mt={3.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
              Add
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
      {listData && listData.length > 0 && <h2 style={{ marginTop: 70 }}>Material List</h2>}
      {listData &&
        listData.length > 0 &&
        listData.map((val, index) => (
          <ListForm
            val={val}
            index={index}
            key={val}
            updateRow={updateRow}
            isEditingMaterial={isEditingMaterial}
            setIsEditingMaterial={setIsEditingMaterial}
            deleteRow={deleteRow}
            listData={listData}
            serialNumbersArr={serialNumbersArr}
            setSerialNumbersArr={setSerialNumbersArr}
          />
        ))}
      <Modal open={uploadSerials} onClose={handleCloseSerial} aria-labelledby="modal-modal-title">
        <ModalContent
          handleCloseSerial={handleCloseSerial}
          closeCss={closeCss}
          quantity={quantity}
          serialNumbers={serials}
          setSerialNumbers={setSerialNumbers}
        />
      </Modal>
      {openSerials && (
        <MaterialSerialNumberModal
          open={openSerials}
          onClose={() => {
            setOpenSerials(false);
          }}
          serialNumberData={serials.slice(0, quantity)}
        />
      )}
    </>
  );
};

MaterialInputs.propTypes = {
  onMaterailsInput: PropTypes.func,
  storeLocationData: PropTypes.array,
  serialNumbersArr: PropTypes.any,
  isEditingMaterial: PropTypes.bool,
  setIsEditingMaterial: PropTypes.func,
  setSerialNumbersArr: PropTypes.func
};
export default MaterialInputs;
