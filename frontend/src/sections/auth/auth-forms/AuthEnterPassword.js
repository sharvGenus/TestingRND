import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Grid, InputAdornment, Stack } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { RHFTextField } from 'hook-form';
import AuthWrapper from 'sections/auth/AuthWrapper';
// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthEnterPassword = ({ goBack, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [capsWarning, setCapsWarning] = React.useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography onClick={() => goBack()} variant="body1" sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary">
              Back
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Stack spacing={3}>
                <RHFTextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  required
                  onKeyDown={onKeyDown}
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
                {capsWarning && (
                  <Typography variant="caption" sx={{ color: 'warning.main', paddingLeft: '4px' }}>
                    Caps lock on!
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                {type === 'forgetPassword' ? (
                  <Button component={Link} to="/reset-password" disableElevation fullWidth size="large" variant="contained">
                    Continue
                  </Button>
                ) : (
                  <Button disableElevation fullWidth size="large" type="submit" variant="contained">
                    Continue
                  </Button>
                )}
              </AnimateButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

AuthEnterPassword.propTypes = {
  goBack: PropTypes.func.apply,
  type: PropTypes.string
};

export default AuthEnterPassword;
