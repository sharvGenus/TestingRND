import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFSelectTags, RHFTextField } from 'hook-form';

const AddGroupedItems = ({ onClose, masterData, selectedTraxns, setTransactions }) => {
  const requestList = ['MRF', 'MRR', 'STR', 'LTLR', 'PTPR', 'CANCELMRF', 'CANCELMRR', 'CANCELSTR', 'CANCELLTLR', 'CANCELPTPR'];
  const [currentDate] = new Date().toISOString().split('T');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.name,
        transactionTypeIds: Yup.array().min(2, 'Select at least two transactions').required('Please select at least two transactions'),
        startRange: Validations.requiredWithNonZero('Start Range'),
        endRange: Yup.number()
          .typeError('End range must be a number')
          .required('End range is required')
          .test('greaterThanStart', 'End range must be greater than start range', function (value) {
            const { startRange } = this.parent;
            return value > startRange;
          }),
        effectiveDate: Validations.requiredWithLabel('Effective Date')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const selectBox = (name, label, menus = [], req, onChange) => {
    return (
      <RHFSelectTags
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(typeof onChange === 'function' && { onChange: onChange })}
        // {...((disable || alldisable) && { disable: true })}
        {...(req && { required: true })}
      />
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return <RHFTextField name={name} type={type} label={label} InputLabelProps={{ shrink: shrink }} {...(req && { required: true })} />;
  };

  const { handleSubmit, setValue } = methods;

  const onFormSubmit = (values) => {
    values['id'] = values.transactionTypeIds.toString();
    values['touched'] = true;
    setTransactions([...selectedTraxns, values]);
    onClose(false);
  };

  useEffect(() => {
    setValue('effectiveDate', currentDate);
  }, [setValue, currentDate]);

  const filterTraxns = (arr, selectedItems) => {
    let groupedIds = [];
    selectedItems &&
      selectedItems.length > 0 &&
      selectedItems.map((val) => {
        if (val.transactionTypeIds && val.transactionTypeIds.length > 1) {
          groupedIds = [...groupedIds, ...val.transactionTypeIds];
        }
      });
    let newList = selectedItems && selectedItems.filter((val) => !groupedIds.includes(val.id));
    const preData =
      newList && newList.filter((fl) => !fl.startRange && !fl.endRange && (!fl.transactionTypeIds || fl.transactionTypeIds.length <= 1));
    const preItems = [];
    preData.map((val) => {
      preItems.push(val.name);
    });
    let modifieddata = [];
    modifieddata = arr.filter((val) => preItems.includes(val.name));
    return modifieddata;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          {txtBox('name', 'Group Name', 'text', true)}
        </Grid>
        <Grid item xs={12} sm={3}>
          {selectBox(
            'transactionTypeIds',
            'Transactions',
            filterTraxns(
              masterData.filter((val) => !requestList.includes(val.name)),
              structuredClone(selectedTraxns)
            ),
            true
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          {txtBox('startRange', 'Start Range', 'number', true)}
        </Grid>
        <Grid item xs={12} sm={3}>
          {txtBox('endRange', 'End Range', 'number', true)}
        </Grid>
        <Grid item xs={12} sm={3}>
          {txtBox('effectiveDate', 'Effective Date', 'date', true)}
        </Grid>
        <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" type="submit" variant="contained" color="primary">
            Add
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

AddGroupedItems.propTypes = {
  onClose: PropTypes.func,
  masterData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedTraxns: PropTypes.array,
  setTransactions: PropTypes.func
};

export default AddGroupedItems;
