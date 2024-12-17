import { useState } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import ReCaptcha from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import { FormProvider, RHFTextField } from 'hook-form';
import AuthEnterOtp from 'sections/auth/auth-forms/AuthEnterOtp';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { RECAPTCHA_SITE_KEY } from 'constants/constants';

const sitekey = RECAPTCHA_SITE_KEY;

// ============================|| FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const [loggedIn, setLoggedIn] = useState();
  const [inputType, setInputType] = useState();
  const [token, setToken] = useState();
  const [secret, setSecret] = useState(null);

  const isVerified = !!secret;

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        input: Yup.mixed()
          .test('emailOrMobile', 'Enter valid Email or Mobile no.', (value) => {
            const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            const mobilePattern = /^\d{10}$/;
            if (emailPattern.test(value)) {
              setInputType('email');
              return 'email';
            } else if (mobilePattern.test(value)) {
              setInputType('mobile');
              return 'mobile';
            } else {
              return false;
            }
          })
          .required('Email/Mobile No. is required')
      })
    ),
    mode: 'all'
  });
  const { watch } = methods;

  const handleRecaptchaVerify = async (value) => {
    if (typeof value === 'string') {
      setSecret(value);
    } else {
      setSecret(null);
    }
  };

  const goBack = () => {
    // setIsVerified(false);
    setLoggedIn();
  };

  const input = watch('input');

  const handleForgotPassword = async () => {
    const response = await request('/forgot-password', { method: 'POST', body: { secret, username: input } });

    if (!response?.success) {
      toast(response?.error?.message || 'Something went wrong!', { variant: 'error' });
      return;
    }

    const otpToken = response?.data?.data.token;

    setToken(otpToken);
    setLoggedIn(inputType);
  };

  return (
    <>
      {!loggedIn ? (
        <AuthWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                <Typography variant="h3">Forgot Password</Typography>
                <Typography component={RouterLink} to={'/login'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                  Back to Login
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormProvider methods={methods}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <RHFTextField name="input" type="text" label="Email/Mobile No." required />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <ReCaptcha
                      style={{ display: 'flex', placeContent: 'center' }}
                      sitekey={sitekey}
                      onChange={handleRecaptchaVerify}
                    ></ReCaptcha>
                  </Grid>
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        onClick={handleForgotPassword}
                        disableElevation
                        disabled={!isVerified}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                      >
                        Next
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </Grid>
          </Grid>
        </AuthWrapper>
      ) : (
        <>
          {inputType === 'email' ? (
            <FormProvider methods={methods}>
              <AuthEnterOtp goBack={goBack} type="forgetPassword" token={token} />
            </FormProvider>
          ) : (
            <FormProvider methods={methods}>
              <AuthEnterOtp goBack={goBack} type="forgetPassword" token={token} />
            </FormProvider>
          )}
        </>
      )}
    </>
  );
};

export default AuthForgotPassword;
