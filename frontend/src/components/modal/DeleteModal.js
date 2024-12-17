import * as React from 'react';
import { Box, Modal, Backdrop, Fade, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import request from '../../utils/request';

DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  deleteInfo: PropTypes.object,
  dispatchData: PropTypes.func,
  stopDelete: PropTypes.bool,
  deleteMaterial: PropTypes.func
};

DeleteModal.defaultProps = {
  stopDelete: false
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

export default function DeleteModal({ open, handleClose, deleteInfo, dispatchData, stopDelete, deleteMaterial }) {
  const dispatch = useDispatch();
  const [errMessage, setErrMessage] = React.useState(null);
  React.useEffect(() => {
    setErrMessage(null);
  }, [open]);
  const handleDelete = async () => {
    const response = await request(`${deleteInfo?.deleteURL}`, { method: 'DELETE', params: deleteInfo?.deleteID });
    if (response.success) {
      await dispatch(dispatchData);
      handleClose();
    } else {
      setErrMessage(response?.error?.message);
    }
  };
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
              {deleteInfo?.title}
            </Typography>
            <Typography id="transition-modal-title" variant="h6" sx={typoStyle}>
              Are you sure you want to delete ?
            </Typography>
            <Box sx={buttonStyle}>
              <Button onClick={handleClose} size="small" variant="outlined" color="primary">
                Cancel
              </Button>
              <Button
                onClick={
                  stopDelete
                    ? () => {
                        deleteMaterial(deleteInfo);
                      }
                    : handleDelete
                }
                size="small"
                variant="contained"
                color="error"
              >
                Delete
              </Button>
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
