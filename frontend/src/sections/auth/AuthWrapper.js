import PropTypes from 'prop-types';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import { useCallback, useEffect, useState } from 'react';
import AuthCard from './AuthCard';
// import AuthFooter from 'components/cards/AuthFooter';
// import Logo from 'components/logo';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';
import request from 'utils/request';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => {
  const [imageLogo, setImageLogo] = useState(false);

  const logoOne = useCallback(async () => {
    const response = await request('/project-logo?logoType=logo-one', {}, true, true);
    if (response.status === 200) {
      setImageLogo(true);
    } else {
      setImageLogo(false);
    }
  }, []);

  useEffect(() => {
    logoOne();
  }, [logoOne]);
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AuthBackground />
      <Grid
        container
        direction="column"
        sx={{
          minHeight: '100vh'
        }}
      >
        <Grid item xs={12} sx={{ p: 3 }}>
          {imageLogo && (
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <img src={`${window.location.origin}/project-logo?logoType=logo-one`} alt="Genus" width="100vh" height="auto" />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid> */}
      </Grid>
    </Box>
  );
};
AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
