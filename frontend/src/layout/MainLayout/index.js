import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Container, Toolbar } from '@mui/material';

// project import
import { FetchMenus } from 'components/getSideBar';
import Drawer from './Drawer';
import Header from './Header';
// import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';

// import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import { openDrawer } from 'store/reducers/menu';
import { LAYOUT_CONST } from 'config';
import useAuth from 'hooks/useAuth';
import { getAllMasters } from 'store/actions';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import CircularLoader from 'components/CircularLoader';
import { selectIsLoading } from 'store/reducers/loadingSlice';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const { container, miniDrawer, menuOrientation } = useConfig();
  const dispatch = useDispatch();

  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

  // drawer toggler
  const [open, setOpen] = useState(!miniDrawer || drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
  const { user } = useAuth();

  const { allMasters } = useDefaultFormAttributes();

  const { allMastersData } = useMemo(
    () => ({
      allMastersData: allMasters?.allMastersObject || [],
      isLoading: allMasters.loading || false
    }),
    [allMasters]
  );

  const [newMenus, setNewMenus] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (allMastersData && allMastersData.length > 0) {
      let newMenuData = FetchMenus(allMastersData);
      setNewMenus(newMenuData);
    }
  }, [allMastersData, location, navigate, user]);

  useEffect(() => {
    if (user) dispatch(getAllMasters({ sortBy: 'rank', sortOrder: 'ASC', userId: user.id }));
  }, [dispatch, user]);

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {!isHorizontal ? <Drawer open={open} handleDrawerToggle={handleDrawerToggle} menus={newMenus} /> : <HorizontalBar />}
      <Box component="main" sx={{ width: 'calc(100% - 306px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 0, sm: 0 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100%'
          }}
        >
          {isLoading && <CircularLoader />}
          {/* <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} /> */}
          <Outlet />
          {/* <Footer /> */}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
