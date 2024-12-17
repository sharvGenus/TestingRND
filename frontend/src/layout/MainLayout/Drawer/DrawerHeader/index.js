import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// project import
import { useCallback, useEffect, useState } from 'react';
import DrawerHeaderStyled from './DrawerHeaderStyled';
// import Logo from 'components/logo';
import useConfig from 'hooks/useConfig';
import { LAYOUT_CONST } from 'config';
import request from 'utils/request';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;
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
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : '60px',
        width: isHorizontal ? { xs: '100%', lg: '424px' } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
      }}
    >
      {imageLogo ? (
        <img src={`${window.location.origin}/project-logo?logoType=logo-one`} alt="Genus" width={open ? '100vh' : '60vh'} height={'auto'} />
      ) : (
        <img src="/genus-logo.png" alt="Genus" width="40px" height="20px" />
      )}
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
