import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { EditOutlined } from '@ant-design/icons';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import toast from 'utils/ToastNotistack';

const iconStyles = {
  padding: '10px',
  fontSize: '22px',
  marginRight: '7px'
};

const EditIcon = styled(EditOutlined)(iconStyles);
const EditContainer = styled(Box)({ display: 'flex', justifyContent: 'center', cursor: 'pointer' });

function SerialNumberModal({ isOpen, onClose, setSegments }) {
  const [serialNumbers, setSerialNumbers] = useState('');

  const handleSave = () => {
    const rawSegmentsArray = serialNumbers.split('\n').filter((serial) => serial.trim() !== '');
    const uniqueSegmentsArray = [...new Set(rawSegmentsArray)];

    if (rawSegmentsArray.length !== uniqueSegmentsArray.length) {
      toast('Duplicate serial numbers found. Kindly remove them.', { variant: 'error' });
      return;
    }

    setSegments(uniqueSegmentsArray);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <div style={{ height: '250px', overflowX: 'hidden' }}>
          <TextareaAutosize
            rowsMin={10}
            placeholder="Enter serial numbers here..."
            value={serialNumbers}
            onChange={(e) => setSerialNumbers(e.target.value)}
            style={{ width: '500px', height: '230px', overflowY: 'auto' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

SerialNumberModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setSegments: PropTypes.func
};

const InputSerialNumbersModal = ({ segments, setSegments, forDevolution = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const showToast = (message) => {
    toast(message || 'Something went wrong', { variant: 'error' });
  };

  const setSegmentsFromInput = async (serialNumbersList) => {
    try {
      if (!forDevolution && serialNumbersList.length !== segments.length) {
        throw new Error(
          `Input contains ${serialNumbersList.length > segments.length ? 'more' : 'less'} serial numbers than the quantity used`
        );
      }

      setSegments(serialNumbersList);
    } catch (error) {
      showToast(error?.message);
    }
  };

  return (
    <>
      <EditContainer>
        <SerialNumberModal isOpen={modalOpen} onClose={() => setModalOpen(false)} setSegments={setSegmentsFromInput} />
        <Tooltip title="Import from input" placement="bottom">
          <EditIcon onClick={() => setModalOpen(true)} />
        </Tooltip>
      </EditContainer>
    </>
  );
};

InputSerialNumbersModal.propTypes = {
  segments: PropTypes.array,
  setSegments: PropTypes.func,
  forDevolution: PropTypes.bool
};

export default InputSerialNumbersModal;
