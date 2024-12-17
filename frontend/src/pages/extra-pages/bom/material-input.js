import { Button, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useBom } from './useBom';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { getMaterialQuantityByProjectAndMaterial } from 'store/actions';

const MaterialInputs = ({ otherMaterialData, formData, setShowAdd, showAdd, setDisableAll }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editRow, setEditRow] = useState(null);
  const [update, setUpdate] = useState(false);
  const [add, setAdd] = useState([]);
  const [newData, setNewData] = useState([]);
  const [updateArray, setUpdateArray] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        groupedMaterialId: Validations.material,
        quantity: Validations.trxnQuantity
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (update && editRow) {
      handleSetValues(editRow);
    }
  }, [update, editRow, setValue]);

  useEffect(() => {
    if (formData) {
      dispatch(getMaterialQuantityByProjectAndMaterial(formData));
    }
  }, [dispatch, formData]);

  const {
    materialQuantitiesByCondition: { materialQuantitiesByConditionObject: data = [] }
  } = useBom();

  useEffect(() => {
    if (data) {
      setNewData(data);
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Material',
        accessor: 'groupMaterial.name'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      }
    ],
    []
  );

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

  const txtBox = (name, label, type, req, disable = false, handleChange, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(disable && { disabled: true })}
        {...(typeof handleChange === 'function' && { handleChange: handleChange })}
        {...(req && { required: true })}
      />
    );
  };

  const fetchMaterial = (id) => {
    const res = otherMaterialData && otherMaterialData.filter((obj) => obj.id === id);
    return res && res.length ? res[0] : { name: '', code: '' };
  };

  const onMaterialSelected = (e) => {
    if (e) {
      const matData = fetchMaterial(e.target.value);
      setValue('groupMaterial.name', matData?.name);
      setValue('uom.name', matData?.material_uom?.name);
      setValue('uomId', matData?.material_uom?.id);
    } else {
      setValue('groupMaterial.name', '');
      setValue('uom.name', '');
      setValue('uomId', '');
    }
  };

  const addOrUpdateData = (arr, values) => {
    let newUpdateArr = [...arr];
    let ind = newUpdateArr.findIndex((val) => val.groupedMaterialId === values.groupedMaterialId);
    if (ind >= 0) {
      newUpdateArr[ind] = {
        ...values,
        ...formData,
        quantity: update ? values.quantity : values.quantity + +newUpdateArr[ind].quantity
      };
    } else newUpdateArr.push({ ...values, ...formData });
    return newUpdateArr;
  };

  const onFormSubmit = (values) => {
    if (editRow?.id) {
      let updatedValues = addOrUpdateData(updateArray, values);
      setUpdateArray(updatedValues);
    } else {
      let ind = newData.findIndex((val) => val.groupedMaterialId === values.groupedMaterialId);
      if (ind >= 0 && newData[ind] && newData[ind]?.id) {
        let updatedValues = addOrUpdateData(updateArray, {
          ...values,
          ...newData[ind],
          quantity: values.quantity + +newData[ind].quantity
        });
        setUpdateArray(updatedValues);
      } else {
        let updatedValues = addOrUpdateData(add, values);
        setAdd(updatedValues);
      }
    }
    let updatedValues = addOrUpdateData(newData, values);
    setNewData(updatedValues);
    setUpdate(false);
    reset();
  };

  const onMainFormSubmit = async () => {
    const payload = {
      add,
      update: updateArray,
      deleteIds
    };
    const resp = await request('/material-quantity-create', { method: 'POST', body: payload });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      return;
    }

    navigate('/contractor-limit');
  };

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setEditRow(row);
  };

  const handleRowDelete = (value) => {
    setDeleteIds([]);
    if (typeof value === 'string') {
      let ids = deleteIds;
      ids.push(value);
      setDeleteIds(ids);
      let remArr = updateArray.filter((val) => val.id !== value);
      setUpdateArray(remArr);
      let remArr2 = newData.filter((val) => val.id !== value);
      setNewData(remArr2);
    } else {
      let remArr = add.filter((val) => val.groupedMaterialId !== value.groupedMaterialId);
      setAdd(remArr);
      let remArr2 = newData.filter((val) => val.groupedMaterialId !== value.groupedMaterialId);
      setNewData(remArr2);
    }
  };

  const handleClick = () => {
    setShowAdd(!showAdd);
    setDisableAll(false);
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mt: 2, display: 'flex', alignItems: 'center', pb: 3 }}>
          <Grid item md={4} xl={4}>
            {selectBox('groupedMaterialId', 'Select Material', otherMaterialData, true, onMaterialSelected)}
          </Grid>
          <Grid item md={4}>
            {txtBox('uom.name', 'UOM', 'text', true, true)}
          </Grid>
          <Grid item md={4}>
            {txtBox('quantity', 'Quantity', 'number', true)}
          </Grid>
          <Grid item xs={12} sm={1} style={{ display: 'none' }}>
            {txtBox('uomId', 'UOMId', 'text', true)}
          </Grid>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
          <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
            {update ? 'Update' : 'Add'}
          </Button>
        </Grid>
      </FormProvider>

      <>
        <TableForm
          data={newData}
          columns={columns}
          count={newData.length}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
          hideViewIcon
          hideHistoryIcon
          hideHeader
          hidePagination
        />
        <FormProvider>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
              <Button size="small" variant="outlined" color="primary" onClick={handleClick}>
                Back
              </Button>
              <Button onClick={onMainFormSubmit} size="small" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </>
    </>
  );
};

MaterialInputs.propTypes = {
  otherMaterialData: PropTypes.array,
  formData: PropTypes.object,
  showAdd: PropTypes.bool,
  setShowAdd: PropTypes.func,
  setDisableAll: PropTypes.func
};

export default MaterialInputs;
