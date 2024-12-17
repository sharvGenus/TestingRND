import { Box, Tooltip } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import PropTypes from 'prop-types';
import { styled } from '@mui/material';
import SmallIconButton from './SmallIconButton';

const TranslucentButton = styled('div')(({ margin }) => ({
  background: 'none',
  border: 'none',
  padding: '3px',
  margin: margin || '-3px',
  minWidth: '1px'
}));

export default TranslucentButton;

export const ActionButtons = ({
  updateReceipt,
  uploadAttachments,
  viewSerialNumbers,
  openPreview,
  initiatePrint,
  initiateDownload,
  noMargins,
  disablePrint,
  disableDownload,
  editButton,
  uploadButton = false,
  disableUpload
}) => {
  return (
    <Box display="flex">
      {viewSerialNumbers && (
        <Tooltip title={uploadButton ? 'View Old Serial Numbers' : 'Print Serial Numbers'} placement="bottom">
          <TranslucentButton margin="-7px">
            <SmallIconButton onClick={() => viewSerialNumbers()}>
              <PreviewOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </Tooltip>
      )}

      {!noMargins && <Box sx={{ display: 'inline-block', width: '7px' }} />}

      {editButton && (
        <Tooltip title="Edit E-Way Bill Details" placement="bottom">
          <TranslucentButton {...(viewSerialNumbers && { margin: '-7px' })}>
            <SmallIconButton onClick={() => updateReceipt()}>
              <EditOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </Tooltip>
      )}

      {uploadButton && (
        <Tooltip title="Upload Attachments" placement="bottom">
          <TranslucentButton {...(viewSerialNumbers && { margin: '-7px' })}>
            <SmallIconButton onClick={() => uploadAttachments()} disabled={disableUpload}>
              <FileUploadOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </Tooltip>
      )}

      {!noMargins && <Box sx={{ display: 'inline-block', width: '7px' }} />}

      <Tooltip title="Preview" placement="bottom">
        <TranslucentButton {...(viewSerialNumbers && { margin: '-7px' })}>
          <SmallIconButton onClick={() => openPreview()}>
            <VisibilityOutlinedIcon />
          </SmallIconButton>
        </TranslucentButton>
      </Tooltip>

      {!noMargins && <Box sx={{ display: 'inline-block', width: '7px' }} />}

      <Tooltip title="Print" placement="bottom">
        <span>
          <TranslucentButton {...(viewSerialNumbers && { margin: '-7px' })}>
            <SmallIconButton onClick={() => initiatePrint()} disabled={disablePrint}>
              <PrintOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </span>
      </Tooltip>

      {!noMargins && <Box sx={{ display: 'inline-block', width: '7px' }} />}

      <Tooltip title="Download" placement="bottom">
        <span>
          <TranslucentButton {...(viewSerialNumbers && { margin: '-7px' })}>
            <SmallIconButton onClick={() => initiateDownload()} disabled={disableDownload}>
              <FileDownloadOutlinedIcon />
            </SmallIconButton>
          </TranslucentButton>
        </span>
      </Tooltip>
    </Box>
  );
};

ActionButtons.propTypes = {
  openPreview: PropTypes.func,
  initiateDownload: PropTypes.func,
  initiatePrint: PropTypes.func,
  noMargins: PropTypes.bool,
  disablePrint: PropTypes.bool,
  disableDownload: PropTypes.bool,
  updateReceipt: PropTypes.func,
  uploadAttachments: PropTypes.func,
  viewSerialNumbers: PropTypes.func,
  editButton: PropTypes.bool,
  uploadButton: PropTypes.bool,
  disableUpload: PropTypes.bool
};

ActionButtons.defaultProps = {
  noMargins: false
};
