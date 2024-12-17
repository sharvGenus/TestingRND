/* eslint-disable */
import PropTypes from 'prop-types';
import { Button, Grid, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { FormProvider, RHFTextField } from 'hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';
import { useState } from 'react';
import request from 'utils/request';
import { generateSHA512 } from 'utils';

export const ChangePassword = ({ onClose, userId }) => {
  const [showPassword, setShowPassword] = useState([false, false]);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        password: Validations.required,
        confirmPassword: Validations.required
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const handleClickShowPassword = (index) => {
    const updatedShowPassword = [...showPassword];
    updatedShowPassword[index] = !updatedShowPassword[index];
    setShowPassword(updatedShowPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formSubmitHandler = async (formValue) => {
    const { password, confirmPassword } = formValue;
    if (password !== confirmPassword) {
      toast('Password mismatch', { variant: 'error' });
      return;
    }

    setLoading(true);
    const response = await request('/update-password-admin', {
      method: 'PUT',
      body: { newPassword: generateSHA512(confirmPassword), userId }
    });
    if (response.success) {
      toast(response?.data?.data?.message || 'Successfully updated password', { variant: 'success', autoHideDuration: 10000 });
      onClose();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
    setLoading(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(formSubmitHandler)}>
      <MainCard title="Change Password">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <RHFTextField
                name="password"
                type={showPassword[0] ? 'text' : 'password'}
                label="Password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword(0)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword[0] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <RHFTextField
                name="confirmPassword"
                type={showPassword[1] ? 'text' : 'password'}
                label="Confirm Password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword(1)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword[1] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ mt: 2 }} direction="row" alignItems="center" justifyContent="flex-end">
              <Button disabled={loading} size="small" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={loading} size="small" variant="contained" type="submit">
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

ChangePassword.propTypes = {
  onClose: PropTypes.func,
  userId: PropTypes.string
};
