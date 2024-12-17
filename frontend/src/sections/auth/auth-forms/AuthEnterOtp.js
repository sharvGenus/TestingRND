import { Grid, Stack, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import OtpInput from 'react18-input-otp';
import { useNavigate } from 'react-router-dom';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

// ================================|| CODE VERIFICATION ||================================ //

const AuthEnterOtp = ({ goBack, type, token: initialToken }) => {
  const theme = useTheme();
  const [otp, setOtp] = useState();
  const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];

  const [token, setToken] = useState();

  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    const response = await request('/verify-forgot-password-otp', { method: 'POST', body: { secretToken: token, otp } });

    if (!response?.success) {
      toast(response?.error?.message || 'Something went wrong!', { variant: 'error' });
      return;
    }

    // if verified we should get a valid token usable for reset password page.
    const tokenForResetPassword = response?.data?.data?.token;
    navigate(`/reset-password?token=${tokenForResetPassword}&forgotPassword=true`);
  };

  const handleResendCode = async () => {
    const response = await request('/resend-otp', { method: 'POST', body: { secretToken: token, isEmail: true } });

    if (!response?.success) {
      toast(response?.error?.message || 'Something went wrong!', { variant: 'error' });
      return;
    }
    toast('OTP has been resent!', { variant: 'success' });
    const resentToken = response?.data?.data?.token;
    setToken(resentToken);
  };

  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Enter OTP</Typography>
            <Typography onClick={() => goBack()} variant="body1" sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary">
              Back
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography>Please enter OTP to verify.</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OtpInput
                value={otp}
                onChange={(_otp) => setOtp(_otp)}
                numInputs={6}
                containerStyle={{ justifyContent: 'space-between' }}
                inputStyle={{
                  width: '100%',
                  margin: '8px',
                  padding: '10px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 4,
                  ':hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
                focusStyle={{
                  outline: 'none',
                  boxShadow: theme.customShadows.primary,
                  border: `1px solid ${theme.palette.primary.main}`
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                {type === 'forgetPassword' ? (
                  <Button onClick={handleVerifyOtp} disableElevation fullWidth size="large" variant="contained">
                    Continue
                  </Button>
                ) : (
                  <Button disableElevation fullWidth size="large" type="submit" variant="contained">
                    Continue
                  </Button>
                )}
              </AnimateButton>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography>Did not receive the OTP?</Typography>
                <Typography
                  onClick={handleResendCode}
                  variant="body1"
                  sx={{ minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer' }}
                  color="primary"
                >
                  Resend code
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

AuthEnterOtp.propTypes = {
  goBack: PropTypes.func,
  token: PropTypes.string,
  type: PropTypes.string
};

export default AuthEnterOtp;
