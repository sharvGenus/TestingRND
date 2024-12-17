import PropTypes from 'prop-types';
import { Suspense, lazy, useCallback, useEffect } from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box } from '@mui/material';
import useTransactionReceipt from './useTransactionReceipt';
import TranslucentButton from './buttons/TranslucentButton';
import SmallIconButton from './buttons/SmallIconButton';
import Loader from 'components/Loader';

const Modal = lazy(() => import('@mui/material/Modal'));

const blockPrintCSS = `
<style type="text/css" media="print">
  body {
    display:none;
    visibility:hidden;
  }
</style>
`;

const IframeComponent = ({ htmlContent }) => {
  const htmlSrc = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

  return (
    <iframe title="Receipt Preview" src={htmlSrc} style={{ padding: '48px 21px 21px 10px', border: 'none' }} width="100%" height="100%" />
  );
};

IframeComponent.propTypes = {
  htmlContent: PropTypes.string
};

const ReceiptPreview = ({ onClose: handleClose, fetchFromRoute, previewAction, apiParams, apiQuery, fileNameForDownload }) => {
  const { renderedHTML, isDownloading, isPrinting, isLoadingTemplate } = useTransactionReceipt({
    handleClose,
    previewAction,
    fetchFromRoute,
    apiParams,
    apiQuery,
    fileNameForDownload
  });

  const isLoading = isDownloading || isPrinting || isLoadingTemplate;

  const htmlToDisplay = `${blockPrintCSS}${renderedHTML}`;

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        handleClose();
      } else if (event.ctrlKey && event.key?.toLowerCase() === 'p') {
        event.preventDefault();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => document.removeEventListener('keydown', handleKeyPress, false);
  }, [handleKeyPress]);

  return (
    <>
      {isLoading && <Loader />}
      <Suspense fallback={<Loader />}>
        {previewAction === 'view' && (
          <Modal onClose={handleClose} open style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <>
              <Box style={{ width: '85%', height: '80%', backgroundColor: 'white' }}>
                <Box style={{ position: 'relative' }}>
                  <TranslucentButton
                    style={{ position: 'absolute', top: '4px', right: '14px', backgroundColor: 'white' }}
                    onClick={handleClose}
                  >
                    <SmallIconButton>
                      <CancelOutlinedIcon />
                    </SmallIconButton>
                  </TranslucentButton>
                </Box>
                <IframeComponent htmlContent={htmlToDisplay} />
              </Box>
            </>
          </Modal>
        )}
      </Suspense>
    </>
  );
};

ReceiptPreview.propTypes = {
  onClose: PropTypes.func,
  previewAction: PropTypes.string,
  fetchFromRoute: PropTypes.string,
  apiParams: PropTypes.object,
  apiQuery: PropTypes.object,
  fileNameForDownload: PropTypes.string
};

export default ReceiptPreview;
