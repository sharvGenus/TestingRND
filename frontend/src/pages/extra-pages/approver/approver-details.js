import { Button, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useUsers } from '../users/useUsers';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import { getUsers } from 'store/actions';

const ApproverDetails = ({ view, updates, updateData, setShowData, showData, organizationId }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        email: Validations.email,
        mobileNumber: Validations.mobileNumber
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const {
    clearErrors,
    setError,
    formState: { errors }
  } = methods;
  const [userId, setUserId] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (view) setDisableInput(true);
    else setDisableInput(false);
  }, [view, updates]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };

    if (updates && updateData) {
      handleSetValues(updateData);
    }
  }, [updateData, setValue, updates]);

  useEffect(() => {
    if (userId) {
      clearErrors();
    }
  }, [userId, clearErrors]);

  const dispatch = useDispatch();

  const onFormSubmit = (values) => {
    const existingItem = values?.email ? showData.findIndex((element) => element.email === values?.email) : -1;
    if (existingItem !== -1) {
      setError('email', { message: 'Email already exists' }, { shouldFocus: true });
    } else {
      setShowData(values);
      reset();
    }
  };

  const {
    users: {
      usersObject: { rows: userData }
    }
  } = useUsers();

  const handleUserDetails = (e) => {
    const getUser = userData?.filter((x) => x.id === e?.target?.value);
    setUserId(e?.target?.value);
    if (getUser) {
      setValue('email', getUser[0]?.email || '');
      setValue('mobileNumber', getUser[0]?.mobileNumber || '');
      setValue('user', getUser[0]);
    }
  };

  const selectBox = (name, label, menus, req, handleChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(disableInput && { disable: true })}
        {...(req && { required: true })}
      />
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
          {...(view ? { disabled: true } : updates ? { disabled: false } : {})}
          onBlur={(e) => {
            e.target.value = e.target.value.trim();
            methods.setValue(name, e.target.value);
            if (name === 'email') {
              const emailValue = e.target.value;
              methods.setValue('email', emailValue);
              clearErrors('email');
              const existItem = showData.some((x) => {
                if (emailValue === x.email) {
                  return true;
                }
                return false;
              });
              if (existItem) {
                setError(name, { message: label + ' already exists' }, { shouldFocus: true });
              }
            }
          }}
        />
      </Stack>
    );
  };

  useEffect(() => {
    if (organizationId) {
      dispatch(getUsers({ organizationId }));
    }
  }, [dispatch, organizationId]);

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item md={3} xl={2}>
            {selectBox('userId', 'Name', userData, true, handleUserDetails)}
          </Grid>
          <Grid item md={3} xl={2}>
            {txtBox('email', 'Email', 'text', true)}
          </Grid>
          <Grid item md={3} xl={2}>
            {txtBox('mobileNumber', 'Mobile Number', 'number', true)}
          </Grid>
          <Grid item md={3} xl={2}>
            {txtBox('remarks', 'Remarks', 'text')}
          </Grid>
          <Grid item md={12} mt={3.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!view && (
              <Button
                size="small"
                onClick={handleSubmit(onFormSubmit)}
                variant="contained"
                color="primary"
                disabled={Object.keys(errors)?.length > 0}
              >
                {updates ? 'Update' : 'Add'}
              </Button>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
};

ApproverDetails.propTypes = {
  view: PropTypes.bool,
  update: PropTypes.bool,
  setShowData: PropTypes.func,
  updateData: PropTypes.object,
  updates: PropTypes.bool,
  data: PropTypes.array,
  showData: PropTypes.array,
  organizationId: PropTypes.string
};
export default ApproverDetails;
