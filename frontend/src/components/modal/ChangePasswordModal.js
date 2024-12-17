import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { Grid, IconButton, InputAdornment, Stack } from '@mui/material';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { FormProvider, RHFTextField } from 'hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { generateSHA512 } from 'utils';
import useAuth from 'hooks/useAuth';

export default function ChangePasswordModal({ open, onClose }) {
  const [pending, setPending] = useState(false);

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(`/login`, {
      state: {
        from: ''
      }
    });
  };

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        currentPassword: Yup.string().max(255).required('Password is required'),
        newPassword: Yup.string()
          .max(255)
          .notOneOf([Yup.ref('currentPassword')], 'New password cannot be the same as the current password')
          .required('Password is required'),
        confirmNewPassword: Yup.string()
          .required('Confirm Password is required')
          .when('newPassword', {
            is: (val) => !!(val && val.length > 0),
            then: Yup.string().oneOf([Yup.ref('newPassword')], 'New password and confirm new password should match')
          })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    const hashedCurrentPassword = generateSHA512(currentPassword);
    const hashedNewPassword = generateSHA512(newPassword);

    const response = await request('/update-password', {
      method: 'PUT',
      body: { currentPassword: hashedCurrentPassword, newPassword: hashedNewPassword }
    });

    if (!response?.success) {
      toast(response?.error?.message || 'Something went wrong!', { variant: 'error' });
      return;
    }

    toast('Password changed successfully.', { variant: 'success' });

    setTimeout(handleLogout, 700);
  };

  const onFormSubmit = async (formValues) => {
    setPending(true);
    await handleChangePassword(formValues);
    setPending(false);
  };

  const handleClose = () => {
    onClose();
  };

  const [showPassword, setShowPassword] = useState(null);

  const handleClickShowPassword = (name) => {
    setShowPassword((prev) => (prev === name ? null : name));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <RHFTextField
                  name="currentPassword"
                  type={'currentPassword' === showPassword ? 'text' : 'password'}
                  label="Current Password"
                  autoComplete="new-password"
                  onBlur={() => setShowPassword(null)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('currentPassword')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {'currentPassword' === showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <RHFTextField
                  name="newPassword"
                  type={'newPassword' === showPassword ? 'text' : 'password'}
                  label="New Password"
                  onBlur={() => setShowPassword(null)}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('newPassword')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {'newPassword' === showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <RHFTextField autoComplete="new-password" name="confirmNewPassword" label="Confirm New Password" type="password" />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={pending} variant="contained" onClick={handleSubmit(onFormSubmit)}>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

ChangePasswordModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
