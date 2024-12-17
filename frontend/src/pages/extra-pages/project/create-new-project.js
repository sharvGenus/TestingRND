import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../organization/useOrganizations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getMasterMakerLov } from 'store/actions';
import { getDropdownOrganization, getDropdownOrganizationSecond } from 'store/actions/organizationMasterAction';
import { concateNameAndCode, transformDataWithFilePaths } from 'utils';
import toast from 'utils/ToastNotistack';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import Loader from 'components/Loader';

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const logoOneField = [
  {
    name: 'logoOne',
    label: 'Logo One',
    accept: 'image/*',
    required: false,
    multiple: false
  }
];

const logoSecondField = [
  {
    name: 'logoTwo',
    label: 'Logo Two',
    accept: 'image/*',
    required: false,
    multiple: false
  }
];

const timeoutOverride = 10 * 60000;

const CreateNewProject = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;

  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        code: Validations.code,
        companyId: Validations.other,
        customerId: Validations.other,
        poWorkOrderNumber: Validations.other,
        poStartDate: Validations.other,
        poEndDate: Validations.other,
        fmsYears: Validations.other,
        eWayBillLimit: Validations.other,
        remarks: Validations.remarks,
        ...(!update &&
          fileFields.find((item) => item.name === 'attachments')?.required && {
            attachments: Validations.requiredWithLabel('Attachments')
          },
        logoOneField.find((item) => item.name === 'logoOne')?.required && {
          logoOne: Validations.requiredWithLabel('Logo-1')
        },
        logoSecondField.find((item) => item.name === 'logoTwo')?.required && {
          logoTwo: Validations.requiredWithLabel('Logo-2')
        })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    const combinedFields = [...fileFields, ...logoOneField, ...logoSecondField];
    if (view || update) {
      handleSetValues(transformDataWithFilePaths(data, combinedFields));
      if (data?.customer) setValue('customerId', data.customer.id);
      setValue('companyId', data.company.id);
      setValue('poStartDate', data.poStartDate ? data.poStartDate.split('T')[0] : '');
      setValue('poEndDate', data.poEndDate ? data.poEndDate.split('T')[0] : '');
      setValue('poExtensionDate', data.poExtensionDate ? data.poExtensionDate.split('T')[0] : '');
      setValue('closureDate', data.closureDate ? data.closureDate.split('T')[0] : '');
      setValue('fmsStartDate', data.fmsStartDate ? data.fmsStartDate.split('T')[0] : '');
      setValue('fmsEndDate', data.fmsEndDate ? data.fmsEndDate.split('T')[0] : '');
    }
  }, [data, update, view, setValue]);

  const onFormSubmit = async (values) => {
    setPending(true);
    if (values?.poExtensionDate === '') {
      values.poExtensionDate = null;
    }
    if (values?.closureDate === '') {
      values.closureDate = null;
    }
    if (values?.fmsStartDate === '') {
      values.fmsStartDate = null;
    }
    if (values?.fmsEndDate === '') {
      values.fmsEndDate = null;
    }
    let response;
    values = preparePayloadForFileUpload(values, tasks);

    if (update) {
      response = await request('/project-update', { method: 'PUT', timeoutOverride, body: values, params: data.id });
    } else {
      response = await request('/project-form', { method: 'POST', timeoutOverride, body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Project updated successfully!' : 'Project created successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      onClick();
    } else {
      toast(response.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };

  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs?.masterMakerLovsObject?.rows;
  const customerId = fetchTransactionType(transactionTypeData, 'CUSTOMER');
  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (customerId) {
      dispatch(getDropdownOrganization(customerId));
    }
  }, [dispatch, customerId]);

  useEffect(() => {
    if (companyId) {
      dispatch(getDropdownOrganizationSecond({ organizationTypeId: companyId }));
    }
  }, [dispatch, companyId]);

  const { organizationsDropdown, organizationsDropdownSecond } = useOrganizations();
  const companyData = organizationsDropdownSecond?.organizationDropdownSecondObject;
  const customerData = organizationsDropdown?.organizationDropdownObject;

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Project'}>
          <Grid container spacing={3}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="companyId"
                label="Company"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(companyData)}
                required={true}
                disable={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="customerId"
                label="Customer Name"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(customerData)}
                required={true}
                disable={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="name"
                label="Project Name"
                type="text"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="schemeName"
                label="Scheme Name"
                type="text"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="code"
                label="Code"
                type="text"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="integrationId"
                label="Integration Id"
                type="text"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="poWorkOrderNumber"
                label="PO/Work Order Number"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="poStartDate"
                label="PO Start Date"
                type="date"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="closureDate"
                label="Contract Signed Date"
                type="date"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="poEndDate"
                label="PO End Date"
                type="date"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="poExtensionDate"
                label="PO Extension Date"
                type="date"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="fmsStartDate"
                label="FMS Start Date"
                type="date"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="fmsYears"
                label="FMS (Months)"
                type="text"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="eWayBillLimit"
                label="E-way Bill Limit"
                type="number"
                required={true}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="fmsEndDate"
                label="FMS End Date"
                type="date"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="remarks"
                label="Remarks"
                type="text"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField
                name="remarks"
                label="Remarks"
                type="text"
                required={false}
                InputLabelProps={{ shrink: true }}
                disabled={view ? true : update ? false : false}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
              <FileSections
                fileFields={fileFields}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <FileSections
                fileFields={logoOneField}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
              <FileSections
                fileFields={logoSecondField}
                data={data}
                view={view}
                update={update}
                tasks={tasks}
                setTasks={setTasks}
                setValue={setValue}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && (
                <Button disabled={pending} size="small" type="submit" variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewProject.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewProject;
