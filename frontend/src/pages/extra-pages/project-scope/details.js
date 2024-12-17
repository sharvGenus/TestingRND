import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import { isDecimalUom } from 'utils';

const Details = ({
  data,
  preFilledData,
  dataType,
  update,
  formTypeData,
  onFormTypeChange,
  formData,
  materialTypeData,
  projectData,
  uomData,
  onSubmit,
  onBack
}) => {
  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState(false);
  const [installationMonth, setInstallationMonth] = useState(null);
  const [installationEndDate, setInstallationEndDate] = useState(new Date());
  const [extensionStartDate, setExtensionStartDate] = useState(new Date());
  const [isInteger, setIsInteger] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        ...(dataType === 'scope' && {
          formType: Validations.requiredWithLabel('Form Type'),
          formId: Validations.requiredWithLabel('Form Name'),
          materialTypeId: Validations.requiredWithLabel('Material Type'),
          uomId: Validations.requiredWithLabel('UOM'),
          orderQuantity: isInteger ? Validations.checkForInteger('Order Quantity') : Validations.checkQty('Order Quantity'),
          installationMonth: Validations.month('Installation Months'),
          installationEndDate: Validations.startDateRange(projectData?.closureDate, 'Installation End Date', 'Contract signed date'),
          installationMonthIncentive: Validations.endMonthRange(
            installationMonth,
            'Installation Months (Incentive)',
            'Installation Months'
          ),
          installationEndDateIncentive: Validations.endDateRange(
            installationEndDate,
            projectData?.closureDate,
            'Installation End Date (Incentive)',
            'Installation End Date',
            'Contract signed date'
          )
        }),
        ...(dataType === 'extension' && {
          extensionQuantity: isInteger ? Validations.checkForInteger('Extension Quantity') : Validations.checkQty('Extension Quantity'),
          extensionStartDate: Validations.startDateRange(projectData?.closureDate, 'Extension Start Date', 'Contract signed date'),
          extensionMonth: Validations.month('Extension Months'),
          extensionEndDate: Validations.endDateRangeMax(
            extensionStartDate,
            projectData?.closureDate,
            'Extension End Date',
            'Extension Start Date',
            'Contract signed date',
            true
          ),
          documentNumber: Validations.requiredWithLabel('Document Number'),
          documentDate: Validations.endDate('Document Date'),
          ...(!update && { attachments: Validations.requiredWithLabel('Attachments') })
        }),
        ...(dataType === 'sat' && {
          satExecutionQuantity: isInteger
            ? Validations.checkForInteger('Sat Execution Quantity')
            : Validations.checkQty('Sat Execution Quantity'),
          satExecutionDate: Validations.startDateRange(projectData?.closureDate, 'Sat Execution Date', 'Contract signed date')
        })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, setValue, watch } = methods;

  const uom = watch('uom');

  const fileFields = [
    {
      name: 'attachments',
      label: 'Attachments',
      accept: '*',
      required: true,
      multiple: true
    }
  ];

  useEffect(() => {
    if (preFilledData) {
      setValue('materialType', preFilledData?.material_type?.name);
      setValue('uom', preFilledData.uom?.name);
      if (isDecimalUom(preFilledData.uom?.name)) setIsInteger(false);
      else setIsInteger(true);
    }
  }, [preFilledData, setValue]);

  useEffect(() => {
    if (data && data.id) {
      if (dataType === 'scope') {
        setValue('formType', data?.form?.master_maker_lov?.id);
        setValue('formId', data?.form?.id);
        setValue('materialTypeId', data?.material_type?.id);
        setValue('uomId', data?.uom?.id);
        setValue('uom', data?.uom?.name);
        setValue('orderQuantity', data?.orderQuantity);
        setValue('installationMonth', data?.installationMonth);
        setInstallationMonth(data?.installationMonth);
        setValue('installationEndDate', data?.installationEndDate ? data?.installationEndDate.split('T')[0] : '');
        setInstallationEndDate(data?.installationEndDate ? data?.installationEndDate.split('T')[0] : '');
        setValue('installationMonthIncentive', data?.installationMonthIncentive);
        setValue(
          'installationEndDateIncentive',
          data?.installationEndDateIncentive ? data?.installationEndDateIncentive?.split('T')[0] : ''
        );
        if (isDecimalUom(data?.uom?.name)) setIsInteger(false);
        else setIsInteger(true);
      } else if (dataType === 'extension') {
        setValue('extensionQuantity', data?.extensionQuantity);
        setValue('extensionStartDate', data?.extensionStartDate ? data?.extensionStartDate?.split('T')[0] : '');
        setExtensionStartDate(data?.extensionStartDate ? data?.extensionStartDate?.split('T')[0] : '');
        setValue('extensionMonth', data?.extensionMonth);
        setValue('extensionEndDate', data?.extensionEndDate ? data?.extensionEndDate?.split('T')[0] : '');
        setValue('documentNumber', data?.documentNumber);
        setValue('documentDate', data?.documentDate?.split('T')[0]);
        setValue('attachments-paths', typeof data?.attachments === 'string' ? JSON.parse(data?.attachments) : data?.attachments || []);
      } else if (dataType === 'sat') {
        setValue('satExecutionQuantity', data?.satExecutionQuantity);
        setValue('satExecutionDate', data?.satExecutionDate?.split('T')[0]);
      }
    }
  }, [data, setValue, dataType]);

  const onClick = () => {
    setPending(false);
    onBack(false);
  };

  const text = (name, label, type, required, disabled, onChange) => {
    return (
      <Grid item md={3} xl={3} mb={2}>
        <RHFTextField
          name={name}
          label={label}
          type={type}
          handleChange={typeof onChange === 'function' ? onChange : () => {}}
          required={required}
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
        />
      </Grid>
    );
  };

  const select = (name, label, menus, onChange, required, disabled) => {
    return (
      <Grid item md={3} xl={3} mb={2}>
        <RHFSelectbox
          name={name}
          label={label}
          menus={menus}
          onChange={typeof onChange === 'function' ? onChange : () => {}}
          required={required}
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
        />
      </Grid>
    );
  };

  const attachments = () => {
    return (
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', marginTop: 3 }}>
        <FileSections fileFields={fileFields} data={data} update={update} tasks={tasks} setTasks={setTasks} setValue={setValue} />
      </Grid>
    );
  };

  const submitSection = () => {
    return (
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
        <Button onClick={onClick} size="small" variant="outlined" color="primary">
          Back
        </Button>
        <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
          {update ? 'Update' : 'Save'}
        </Button>
      </Grid>
    );
  };

  const onFormSubmit = async (values) => {
    values = preparePayloadForFileUpload(values, tasks);

    if (data && data.id) values.id = data.id;
    if (preFilledData && preFilledData.id && (dataType === 'extension' || dataType === 'sat')) values.projectScopeId = preFilledData.id;
    onSubmit(values);
  };

  const onEndMonth = (e) => {
    setInstallationMonth(e?.target?.value);
  };

  const onEndDateSelected = (e) => {
    setInstallationEndDate(new Date(e?.target?.value));
  };

  const onExtensionStartDateSelected = (e) => {
    setExtensionStartDate(new Date(e?.target?.value));
  };

  const scopeDetails = () => {
    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          {select('formType', 'Form Type', formTypeData, onFormTypeChange, true, false)}
          {select('formId', 'Form Name', formData, undefined, true, false)}
          {select('materialTypeId', 'Material Type', materialTypeData, undefined, true, false)}
          {select(
            'uomId',
            'UOM',
            uomData,
            (e) => {
              setValue('uom', e?.target?.name);
            },
            true,
            false
          )}
          {text('orderQuantity', 'Order Quantity', isDecimalUom(uom) ? 'text' : 'number', true, false, () => {
            if (isDecimalUom(uom)) setIsInteger(false);
            else setIsInteger(true);
          })}
          {text('installationMonth', 'Installation Months', 'text', true, false, onEndMonth)}
          {text('installationEndDate', 'Installation End Date', 'date', true, false, onEndDateSelected)}
          {text('installationMonthIncentive', 'Installation Months (Incentive)', 'text', true, false)}
          {text('installationEndDateIncentive', 'Installation End Date (Incentive)', 'date', true, false)}
          {submitSection()}
        </Grid>
      </FormProvider>
    );
  };

  const extensionDetails = () => {
    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          {text('materialType', 'Material Type', 'text', false, true)}
          {text('uom', 'UOM', 'text', false, true)}
          {text('extensionQuantity', 'Extension Quantity', 'text', true, false)}
          {text('extensionStartDate', 'Extension Start Date', 'date', true, false, onExtensionStartDateSelected)}
          {text('extensionMonth', 'Extension Months', 'text', true, false)}
          {text('extensionEndDate', 'Extension End Date', 'date', true, false)}
          {text('documentNumber', 'Document Number', 'text', true, false)}
          {text('documentDate', 'Document Date', 'date', true, false)}
          {attachments()}
          {submitSection()}
        </Grid>
      </FormProvider>
    );
  };

  const satDetails = () => {
    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          {text('materialType', 'Material Type', 'text', false, true)}
          {text('uom', 'UOM', 'text', false, true)}
          {text('satExecutionQuantity', 'SAT Execution Quantity', 'text', true, false)}
          {text('satExecutionDate', 'SAT Execution Date', 'date', true, false)}
          {submitSection()}
        </Grid>
      </FormProvider>
    );
  };

  return (
    <>
      {dataType === 'scope' && scopeDetails()}
      {dataType === 'extension' && extensionDetails()}
      {dataType === 'sat' && satDetails()}
    </>
  );
};

Details.propTypes = {
  data: PropTypes.object,
  dataType: PropTypes.string,
  update: PropTypes.bool,
  formTypeData: PropTypes.array,
  onFormTypeChange: PropTypes.func,
  formData: PropTypes.array,
  materialTypeData: PropTypes.array,
  uomData: PropTypes.array,
  onSubmit: PropTypes.func,
  onBack: PropTypes.func,
  preFilledData: PropTypes.any,
  projectData: PropTypes.any
};

export default Details;
