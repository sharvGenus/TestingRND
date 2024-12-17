import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
// material-ui
import { Button, Grid } from '@mui/material';

// third party
import * as Yup from 'yup';

// project import
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CustomizedAccordion from './accordion';
import { FormProvider, RHFCheckbox, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getCurrency, getGstStatus, getIncoterms, getLovsForMasterName, getMasterMakerLov, getPaymentTerm, getTitle } from 'store/actions';
import { getOrganizations } from 'store/actions/organizationMasterAction';
import toast from 'utils/ToastNotistack';
import FileSections, { preparePayloadForFileUpload } from 'components/attachments/FileSections';
import CircularLoader from 'components/CircularLoader';

const timeoutOverride = 10 * 60000;

const CreateNewOrganizations = (props) => {
  const { orgType } = useParams();
  const { onClick, data, view, update, refreshPagination } = props;

  const [sameAddress, setSameAddress] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState(false);

  const fileFields = useMemo(
    () => [
      ...(orgType !== 'Supplier'
        ? [
            {
              name: 'logo',
              label: 'Logo',
              accept: 'image/png, image/gif, image/jpeg',
              required: false,
              multiple: false
            }
          ]
        : []),
      {
        name: 'attachments',
        label: 'Attachments',
        accept: '*',
        required: false,
        multiple: true
      }
    ],
    [orgType]
  );

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.orgName,
        code: Validations.code,
        title: Validations.title,
        gstNumber: Validations.gstNumber,
        email: Validations.email,
        mobileNumber: Validations.mobileNumber,
        telephone: Validations.telephone,
        registeredOfficeAddress: Validations.registeredAddress,
        registeredOfficeCountryId: Validations.registeredCountry,
        registeredOfficeStateId: Validations.registeredState,
        registeredOfficeCityId: Validations.registeredCity,
        registeredOfficePinCode: Validations.registeredPincode,
        address: Validations.address,
        countryId: Validations.country,
        stateId: Validations.state,
        cityId: Validations.city,
        pinCode: Validations.pincode,
        ...(!update &&
          fileFields.find((item) => item.name === 'attachments')?.required && {
            attachments: Validations.requiredWithLabel('Attachments')
          }),
        ...(!update && fileFields.find((item) => item.name === 'logo')?.required && { logo: Validations.requiredWithLabel('Logo') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
    dispatch(getCurrency('CURRENCY'));
    dispatch(getPaymentTerm('PAYMENT TERM'));
    dispatch(getIncoterms('INCOTERMS'));
    dispatch(getGstStatus('GST STATUS'));
    dispatch(getTitle('TITLE'));
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  const { masterMakerLovs } = useMasterMakerLov();

  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, orgType.toUpperCase());
  const handleCheck = () => {
    setSameAddress(!sameAddress);
  };

  const onFormSubmit = async (formValues) => {
    setPending(true);

    let payload = Object.fromEntries(Object.entries(formValues).filter((x) => x[1]));
    payload = preparePayloadForFileUpload(payload, tasks);
    let response;

    if (update) {
      response = await request('/organization-update', {
        method: 'PUT',
        timeoutOverride,
        body: payload,
        params: data.id
      });
    } else {
      response = await request('/organization-form', { method: 'POST', timeoutOverride, body: payload });
    }

    if (response.success) {
      const successMessage = update ? 'Organization updated successfully!' : 'Organization added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      dispatch(getOrganizations({ transactionTypeId }));
      onClick();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }

    setPending(false);
  };

  const selectBox = (name, label, menus, sameAddressDisable, onChange, req) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(sameAddressDisable ? { disable: true } : { disable: false })}
        {...(onChange && { onChange })}
        {...(req && { required: true })}
        {...(view ? { disable: true } : update ? { disable: false } : {})}
      />
    );
  };

  const checkBox = (name, label, onChange, req) => {
    return (
      <RHFCheckbox
        name={name}
        label={label}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        {...(req && { required: true })}
        {...(view ? { disable: true, value: data.check } : update ? { disable: false, value: sameAddress } : {})}
      />
    );
  };

  const txtBox = (name, label, type, sameAddressDisable, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(sameAddressDisable ? { disabled: true } : { disabled: false })}
        {...(req && { required: true })}
        {...(view ? { disabled: true } : update ? { disabled: false } : {})}
      />
    );
  };

  return (
    <>
      {pending && <CircularLoader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + orgType}>
          <CustomizedAccordion
            txtBox={txtBox}
            checkBox={checkBox}
            fileFields={fileFields}
            selectBox={selectBox}
            handleCheck={handleCheck}
            sameAddress={sameAddress}
            setSameAddress={setSameAddress}
            orgType={orgType}
            view={view}
            data={data}
            update={update}
            methods={methods}
          />
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

CreateNewOrganizations.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewOrganizations;
