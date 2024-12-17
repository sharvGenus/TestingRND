import PropTypes from 'prop-types';

// material-ui
import { Box, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';

// project import
import styled from '@emotion/styled';

import Profile from './Profile';
// import Notification from './Notification';
import MobileSection from './MobileSection';
import request from 'utils/request';

export const LoadingText = styled(Typography)(() => ({
  background: 'linear-gradient(90deg, #000000, #777777)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'gradient 1s linear infinite',
  '@keyframes gradient': {
    '0%': {
      background: 'linear-gradient(90deg, #000000, #777777)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    '50%': {
      background: 'linear-gradient(270deg, #000000, #777777)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }
}));

// const gradient = keyframes`
//   0% {
//     background-position: 0% 50%;
//   }
//   100% {
//     background-position: 100% 50%;
//   }
// `;

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = ({ uploadingState, setUploading }) => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  function handleDownloadButtonClick() {
    request('/download-rejected-records', { method: 'GET', params: uploadingState?.rejectedFiles }).then((resposneRejectFile) => {
      if (resposneRejectFile.success) {
        const { data: FileData } = resposneRejectFile;
        const blob = new Blob([FileData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', uploadingState?.rejectedFiles);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setUploading({});
    });
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      {/* <Notification /> */}
      {uploadingState.message && <LoadingText variant="h4">{uploadingState.message}</LoadingText>}
      {uploadingState.rejectedFiles && (
        <Tooltip title="Download rejected file">
          <IconButton onClick={handleDownloadButtonClick}>
            <FileDownloadOutlined />
          </IconButton>
        </Tooltip>
      )}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </Box>
  );
};

HeaderContent.propTypes = {
  uploadingState: PropTypes.object,
  setUploading: PropTypes.func
};

export default HeaderContent;
