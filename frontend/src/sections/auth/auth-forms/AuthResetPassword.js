import { useState } from 'react';
import { Button, Typography, Grid, InputAdornment, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { FormProvider, RHFTextField } from 'hook-form';
import AuthWrapper from 'sections/auth/AuthWrapper';
import request from 'utils/request';
import { generateSHA512 } from 'utils';
import toast from 'utils/ToastNotistack';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { forgotPassword } = Object.fromEntries(new URLSearchParams(window.location.search));

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .when('password', {
            is: (val) => !!(val && val.length > 0),
            then: Yup.string().oneOf([Yup.ref('password')], 'Both Password must be match!')
          })
      })
    ),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'all'
  });

  const submitForm = async (values) => {
    const urlSerachParams = new URLSearchParams(window.location.search);
    const token = urlSerachParams.get('token') || '';
    const { data: response } = await request('/set-password', {
      method: 'POST',
      body: {
        password: generateSHA512(values.password),
        token
      }
    });

    if (response?.status?.toUpperCase() !== 'SUCCESS') {
      toast('Something went wrong!', { variant: 'error' });
      return;
    }

    toast(forgotPassword ? 'Password reset successfully!' : 'Password updated successfully!', { variant: 'success' });
    navigate('/login');
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Reset Password</Typography>
            <Typography component={RouterLink} to={'/login'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Back to Login
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(submitForm)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <RHFTextField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <RHFTextField name="confirmPassword" label="Confirm Password" type="password" />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button type="submit" disableElevation fullWidth size="large" variant="contained" color="primary">
                    Reset Password
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Typography variant="body1" sx={{ textDecoration: 'underline', cursor: 'pointer' }} color="primary">
                    Password Policy
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default AuthResetPassword;
