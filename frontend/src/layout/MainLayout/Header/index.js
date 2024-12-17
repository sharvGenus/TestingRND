import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery } from '@mui/material';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import useConfig from 'hooks/useConfig';
import IconButton from 'components/@extended/IconButton';
import { LAYOUT_CONST } from 'config';
import useAuth from 'hooks/useAuth';
import toast from 'utils/ToastNotistack';

const socketConnections = { count: 0 };
// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();
  const { user } = useAuth();
  const [uploading, setUploading] = useState({ message: null, rejectedFiles: null });

  useEffect(() => {
    function initSocket() {
      if (socketConnections.count > 5) return;
      socketConnections.count += 1;
      const socket = new WebSocket(`${window.location.origin.replace('http', 'ws')}/${user.email}_$timstamp$_${Date.now()}`);
      // Event handler for when the connection is established
      socket.addEventListener('open', () => {
        socketConnections.connect = true;
        socketConnections.socket = socket;
        socket.send('data-import-status-check');
      });

      // Event handler for receiving messages
      socket.addEventListener('message', async ({ data }) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'statusCheck') {
          const object = {};
          if (parsedData.data?.rejectedFiles && parsedData.data?.user === user.email) {
            object.rejectedFiles = parsedData.data?.rejectedFiles;
          } else if (parsedData.data?.start && parsedData.data?.user === user.email) {
            if (parsedData.data?.displayMessage) object.message = parsedData.data?.displayMessage;
          }
          return setUploading(object);
        }
        if (parsedData.status === 200) {
          const uploadingStatus = {};
          if (parsedData.message && parsedData.user === user.email) toast(parsedData.message, { variant: 'success' });
          if (parsedData.displayMessage) uploadingStatus.message = parsedData.displayMessage;
          if (parsedData.rejectedFiles) {
            uploadingStatus.rejectedFiles = parsedData.rejectedFiles;
          }
          setUploading(uploadingStatus);
        } else {
          if (parsedData.message && parsedData.user === user.email) toast(parsedData.message, { variant: 'error' });
          return setUploading({});
        }
      });

      // Event handler for errors
      socket.addEventListener('error', () => {
        socket.close();
        initSocket(user);
      });

      // Event handler for when the connection is closed
      socket.addEventListener('close', () => {
        socketConnections.connect = false;
        socketConnections.socket = null;
      });
    }

    if (user) {
      initSocket(user);
    }
    return () => {
      if (socketConnections.connect && socketConnections.socket) {
        socketConnections.socket.close();
      }
    };
  }, [user]);

  const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent uploadingState={uploading} setUploading={setUploading} />, [uploading]);

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  // common header
  const mainHeader = (
    <Toolbar sx={{ display: { xs: 'none', sm: 'flex' } }}>
      {!isHorizontal ? (
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: open ? 2.5 : -2 } }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: isHorizontal ? '100%' : open ? 'calc(100% - 260px)' : { xs: '100%', lg: 'calc(100% - 60px)' }
      // boxShadow: theme.customShadows.z1
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
