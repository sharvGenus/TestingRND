import * as Yup from 'yup';
import { Button, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMaterial } from '../material/useMaterial';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import { getDropdownUom } from 'store/actions';

const MaterialInputs = ({ setTotalAmount, setUpdate, update, setNewData, newData }) => {
  const dispatch = useDispatch();
  const [editRow, setEditRow] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [tax, setTax] = useState('');
  const [basicAmount, setBasicAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        particulars: Validations.particulars,
        uomId: Validations.uom,
        quantity: Validations.billingQuantity,
        rate: Validations.rate,
        tax: Validations.tax
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
    if (newData) {
      const totalAmount = newData.reduce((sum, x) => sum + +x?.amount, 0);
      setTotalAmount(totalAmount);
    }
  }, [newData, setTotalAmount]);

  useEffect(() => {
    dispatch(getDropdownUom());
  }, [dispatch]);

  const {
    uomDropdown: { uomDropdownObject: uomData }
  } = useMaterial();

  useEffect(() => {
    if (quantity || rate) {
      setValue('basicAmount', +quantity * +rate);
      setBasicAmount(+quantity * +rate);
    } else {
      setBasicAmount('');
      setValue('basicAmount', '');
    }
  }, [quantity, rate, setValue]);

  useEffect(() => {
    if (basicAmount && tax) {
      const taxValue = (tax / 100) * basicAmount;
      setValue('taxAmount', taxValue);
      setTaxAmount(taxValue);
    } else {
      setTaxAmount('');
      setValue('taxAmount', '');
    }
  }, [basicAmount, setValue, tax]);

  useEffect(() => {
    if (basicAmount && taxAmount) {
      setValue('amount', basicAmount + taxAmount);
    } else {
      setValue('amount', '');
    }
  }, [setValue, basicAmount, taxAmount]);

  const handleUomDetails = (e) => {
    if (e?.target?.value) {
      const getUomData = uomData?.filter((x) => x?.id === e?.target?.value);
      setValue('uom', getUomData[0]);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Sr no.',
        accessor: 'srNumber'
      },
      {
        Header: 'Particulars',
        accessor: 'particulars'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Rate',
        accessor: 'rate'
      },
      {
        Header: 'Tax',
        accessor: 'tax'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      }
    ],
    []
  );

  const onFormSubmit = (values) => {
    if (update) {
      const findIndex = newData.findIndex((x) => x?.srNumber === values.srNumber);
      if (findIndex > -1) {
        const data = structuredClone(newData);
        data[findIndex] = values;
        setNewData(data);
      }
      setUpdate(false);
      setRate('');
      setQuantity('');
      setTax('');
    } else {
      setNewData((prev) => [...prev, { ...values, srNumber: newData.length + 1 }]);
      setRate('');
      setQuantity('');
      setTax('');
    }
    reset();
  };

  useEffect(() => {
    if (editRow) {
      setRate(editRow?.rate);
      setQuantity(editRow?.quantity);
      setTax(editRow?.tax);
    }
  }, [editRow]);

  const handleRowUpdate = (row) => {
    setUpdate(true);
    setEditRow(row);
  };

  const handleRowDelete = (value) => {
    if (newData) {
      const filterData = newData.filter((x) => x?.srNumber !== value?.srNumber).map((x, i) => ({ ...x, srNumber: i + 1 }));
      setNewData(filterData);
    }
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mt: 2, display: 'flex', alignItems: 'center', pb: 3 }}>
          <Grid item md={4} xl={2}>
            <RHFTextField name="particulars" label="Particulars" type="text" InputLabelProps={{ shrink: true }} required />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFSelectbox
              name="uomId"
              label="UOM"
              menus={uomData}
              onChange={handleUomDetails}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField
              name="quantity"
              label="Quantity"
              type="text"
              handleChange={(e) => setQuantity(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField
              name="rate"
              label="Rate(INR)"
              type="text"
              handleChange={(e) => setRate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField
              name="basicAmount"
              label="Basic Amount"
              type="number"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              // required
            />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField
              name="tax"
              label="Tax(percentage)"
              type="text"
              handleChange={(e) => setTax(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField name="taxAmount" label="Tax Amount" type="number" disabled={true} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item md={4} xl={2}>
            <RHFTextField name="amount" label="Amount" type="number" disabled={true} InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
          <Button size="small" onClick={handleSubmit(onFormSubmit)} variant="contained" color="primary">
            {update ? 'Update' : 'Add'}
          </Button>
        </Grid>
      </FormProvider>
      {newData && (
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
        </>
      )}
    </>
  );
};

MaterialInputs.propTypes = {
  setTotalAmount: PropTypes.func,
  setUpdate: PropTypes.func,
  update: PropTypes.bool,
  setNewData: PropTypes.func,
  newData: PropTypes.array
};

export default MaterialInputs;
