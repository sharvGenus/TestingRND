import { sum } from 'lodash';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Fab, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
// assets
import { ShoppingCartOutlined } from '@ant-design/icons';

// project import

// ==============================|| CART ITEMS - FLOATING BUTTON ||============================== //

const FloatingCart = () => {
  const theme = useTheme();

  const cart = useSelector((state) => state.cart);
  const totalQuantity = sum(cart.checkout.products.map((item) => item.quantity));

  return (
    <Fab
      component={Link}
      to="/apps/e-commerce/checkout"
      size="large"
      sx={{
        top: '75%',
        position: 'fixed',
        right: 0,
        zIndex: theme.zIndex.speedDial,
        boxShadow: theme.customShadows.primary,
        bgcolor: 'primary.lighter',
        color: 'primary.main',
        borderRadius: '25%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '&:hover': {
          bgcolor: 'primary.100',
          boxShadow: theme.customShadows.primary
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.dark}`,
          outlineOffset: 2
        }
      }}
    >
      <Badge showZero badgeContent={totalQuantity} color="error">
        <ShoppingCartOutlined style={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
      </Badge>
    </Fab>
  );
};

export default FloatingCart;
