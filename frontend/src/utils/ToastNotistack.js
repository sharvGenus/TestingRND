import PropTypes from 'prop-types';

// third-party
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

function ToastCloseButton({ onClick }) {
  return (
    <IconButton disableRipple size="small" aria-label="close" color="inherit" onClick={onClick}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );
}

ToastCloseButton.propTypes = {
  onClick: PropTypes.func
};

const InnerSnackbarUtilsConfigurator = ({ setUseSnackbarRef }) => {
  setUseSnackbarRef(useSnackbar());
  return null;
};

InnerSnackbarUtilsConfigurator.propTypes = {
  setUseSnackbarRef: PropTypes.func
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

setUseSnackbarRef.propTypes = {
  useSnackbarRefProp: PropTypes.any
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

export default function toast(message, options, onClose) {
  const { closeSnackbar, enqueueSnackbar } = useSnackbarRef;

  enqueueSnackbar(message, {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    ...(options?.variant && {
      action: (key) => (
        <ToastCloseButton
          onClick={() => {
            closeSnackbar(key);
            if (onClose) onClose(); // Execute onClose callback
          }}
        />
      )
    }),
    preventDuplicate: true,
    ...options
  });
}
