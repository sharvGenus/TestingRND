/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Grid, Link, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import ReCaptcha from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import { FormProvider, RHFTextField } from 'hook-form';
import AuthEnterOtp from 'sections/auth/auth-forms/AuthEnterOtp';
import AuthEnterPassword from 'sections/auth/auth-forms/AuthEnterPassword';
import request from 'utils/request';
import { generateSHA512 } from 'utils';
import useAuth from 'hooks/useAuth';
import toast from 'utils/ToastNotistack';
import { RECAPTCHA_SITE_KEY } from 'constants/constants';

const sitekey = RECAPTCHA_SITE_KEY;

// ============================|| LOGIN ||============================ //

const AuthLogin = () => {
  const { emailPasswordSignIn } = useAuth();
  const recaptchaRef = useRef();
  const [inputType, setInputType] = useState();
  const [loggedIn, setLoggedIn] = useState();
  const [, setUserDetails] = useState();
  const [imageLogo, setImageLogo] = useState(false);
  const navigate = useNavigate();

  const logoTwo = useCallback(async () => {
    const response = await request('/project-logo?logoType=logo-two', {}, true, true);
    if (response.status === 200) {
      setImageLogo(true);
    } else {
      setImageLogo(false);
    }
  }, []);

  useEffect(() => {
    logoTwo();
  }, [logoTwo]);

  const goBack = () => {
    // setIsVerified(false);
    methods.clearErrors();
    setLoggedIn();
    setValue('secret', null);
    recaptchaRef.current?.reset();
  };

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        secret: Yup.string().required(),
        username: Yup.mixed()
          .test('emailOrMobile', 'Enter valid Email or Mobile no.', (value) => {
            if (isNaN(value)) {
              return /^[\w.-]+@[\w.-]+\.\w+$/.test(value);
            } else {
              return /^\d{10}$/.test(value);
            }
          })
          .required('Email/Mobile No. is required'),
        password: Yup.string().max(255).required('Password is required')
      })
    ),
    defaultValues: {
      // username: 'admin@admin.com',
      // password: '',
      secret: localStorage.secret || null
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, watch, getValues } = methods;

  const handleRecaptchaVerify = async (value) => {
    if (typeof value === 'string') {
      setValue('secret', value);
    }
  };

  const captchaDone = watch('secret');

  const onFormSubmit = async (values) => {
    const clonedValues = structuredClone(values);
    clonedValues.password = generateSHA512(values.password);
    const response = await request('/login', { method: 'POST', body: clonedValues });
    if (response.success) {
      emailPasswordSignIn(response.data.user);
    } else {
      toast(response.error.message);
    }
  };

  const handleNextButtonClick = async () => {
    const response = await request('/verify-user', {
      method: 'POST',
      body: {
        secret: getValues('secret'),
        username: getValues('username')
      }
    });
    let _inputType = 'mobile';
    if (isNaN(getValues('username'))) {
      _inputType = 'email';
    }
    if (response.success && response?.data?.data?.success && response.data?.data?.email) {
      setLoggedIn(_inputType);
      setInputType(_inputType);
      if (response.data.data.isFirstLogin) {
        navigate(`/reset-password?token=${response.data.data.token}`);
      }
      setUserDetails(response.data.data);
    } else {
      setValue('secret', null);
      recaptchaRef.current?.reset();
      toast(response.error.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      {!loggedIn ? (
        <AuthWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                sx={{ mb: { xs: -0.5, sm: 0.5 }, alignItems: 'center' }}
              >
                <Typography variant="h3">Login</Typography>
                {imageLogo && (
                  <Grid item sx={{ justifyContent: 'flex-end' }}>
                    <img src={`${window.location.origin}/project-logo?logoType=logo-two`} alt="Genus" width="100px" height="37px" />
                  </Grid>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <RHFTextField name="username" type="text" label="Email/Mobile No." required allSmall />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <ReCaptcha
                    ref={recaptchaRef}
                    style={{ display: 'flex', placeContent: 'center' }}
                    sitekey={sitekey}
                    onChange={handleRecaptchaVerify}
                  ></ReCaptcha>
                </Grid>
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      onClick={handleNextButtonClick}
                      disableElevation
                      type="button"
                      disabled={!captchaDone}
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                    >
                      Next
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Link variant="h6" component={RouterLink} to="/forgot-password" color="text.primary">
                      Forgot Password?
                    </Link>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AuthWrapper>
      ) : (
        <>{inputType === 'email' ? <AuthEnterPassword goBack={goBack} /> : <AuthEnterOtp goBack={goBack} />}</>
      )}
    </FormProvider>
  );
};

export default AuthLogin;
