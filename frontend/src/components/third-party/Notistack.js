import PropTypes from 'prop-types';
//material-ui
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

// third-party
import { SnackbarProvider } from 'notistack';

// assets
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

// project import
import { SnackbarUtilsConfigurator } from 'utils/ToastNotistack';

// custom styles
const StyledSnackbarProvider = styled(SnackbarProvider)(() => ({
  '&.SnackbarItem-contentRoot': {
    fontSize: '15px'
  },
  '& .SnackbarItem-action': {
    paddingLeft: '4px !important'
  }
}));

// ===========================|| SNACKBAR - NOTISTACK ||=========================== //

const Notistack = ({ children }) => {
  const snackbar = useSelector((state) => state.snackbar);
  const iconSX = { marginRight: 8, fontSize: '1.15rem' };

  return (
    <StyledSnackbarProvider
      maxSnack={snackbar.maxStack}
      dense={snackbar.dense}
      iconVariant={
        snackbar.iconVariant === 'useemojis'
          ? {
              success: <CheckCircleOutlined style={iconSX} />,
              error: <CloseCircleOutlined style={iconSX} />,
              warning: <WarningOutlined style={iconSX} />,
              info: <InfoCircleOutlined style={iconSX} />
            }
          : undefined
      }
      hideIconVariant={snackbar.iconVariant === 'hide' ? true : false}
    >
      <SnackbarUtilsConfigurator />
      {children}
    </StyledSnackbarProvider>
  );
};

Notistack.propTypes = {
  children: PropTypes.node
};

export default Notistack;
