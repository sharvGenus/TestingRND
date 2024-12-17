import React, { useEffect, useState } from 'react';
import { Box, Modal, Backdrop, Fade, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  closeBtnTitle: PropTypes.string,
  confirmBtnTitle: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  confirmColor: PropTypes.string
};

ConfirmModal.defaultProps = {
  title: 'Confirm Action',
  message: 'Are you sure to perform this action',
  closeBtnTitle: 'Cancel',
  confirmBtnTitle: 'Ok'
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  p: 3
};

const typoStyle = {
  display: 'flex',
  flexDirection: 'row',
  padding: '15px 0'
};

const buttonStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2
};

const errorStyle = {
  marginTop: 2,
  display: 'flex',
  fontSize: '14px'
};

export default function ConfirmModal({ open, handleClose, title, message, closeBtnTitle, confirmBtnTitle, handleConfirm, confirmColor }) {
  const [errMessage, setErrMessage] = useState(null);
  useEffect(() => {
    setErrMessage(null);
  }, [open]);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h4">
              {title}
            </Typography>
            <Typography id="transition-modal-title" variant="h6" sx={typoStyle}>
              {message}
            </Typography>
            <Box sx={buttonStyle}>
              {!!handleClose && (
                <Button onClick={handleClose} size="small" variant="outlined" color="primary">
                  {closeBtnTitle}
                </Button>
              )}
              {!!handleConfirm && (
                <Button onClick={handleConfirm} size="small" variant="contained" color={confirmColor || 'error'}>
                  {confirmBtnTitle}
                </Button>
              )}
            </Box>
            {errMessage && (
              <Typography variant="p" color="red" sx={errorStyle}>
                {errMessage}
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
