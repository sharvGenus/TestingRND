import { useCallback, useEffect, useState } from 'react';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const useTransactionReceipt = ({ handleClose, fetchFromRoute, previewAction, apiParams, apiQuery, fileNameForDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  const [renderedHTML, setRenderedHTML] = useState('<div></div>');

  const fetchRenderedHtml = useCallback(async () => {
    if (!apiParams && !apiQuery) return;
    setIsLoadingTemplate(true);

    const data = await request(fetchFromRoute, {
      method: 'GET',
      params: apiParams,
      query: apiQuery
    });

    if (!data.success) {
      toast('There was an error fetching the receipt', { variant: 'error' });
      setIsLoadingTemplate(false);
      handleClose();
      return;
    }

    setRenderedHTML(data.data.renderedTemplate);
    setIsLoadingTemplate(false);
  }, [fetchFromRoute, handleClose, apiQuery, apiParams]);

  useEffect(() => {
    if (previewAction === 'view') {
      fetchRenderedHtml();
    }
  }, [fetchRenderedHtml, previewAction, apiParams]);

  const handlePrint = useCallback(async () => {
    if ((!apiParams && !apiQuery) || isPrinting) return;
    setIsPrinting(true);

    const data = await request(fetchFromRoute, {
      method: 'GET',
      query: { ...apiQuery, pdf: 1 },
      params: apiParams,
      responseType: 'blob'
    });

    if (!data.success) {
      toast('There was an error printing the receipt', { variant: 'error' });
      setIsPrinting(false);
      handleClose();
      return;
    }

    const blob = data.data;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.src = URL.createObjectURL(blob);

    iframe.onload = () => {
      iframe.contentWindow.print();
      setIsPrinting(false);
      handleClose();

      window.onfocus = () => {
        iframe.remove();
        URL.revokeObjectURL(iframe.src);
      };
    };
  }, [fetchFromRoute, handleClose, isPrinting, apiQuery, apiParams]);

  const handleDownload = useCallback(async () => {
    if ((!apiParams && !apiQuery) || isDownloading) return;
    setIsDownloading(true);

    const data = await request(fetchFromRoute, {
      method: 'GET',
      query: { ...apiQuery, pdf: 1 },
      params: apiParams,
      responseType: 'blob'
    });

    if (!data.success) {
      toast('There was an error while downloading the receipt', { variant: 'error' });
      setIsDownloading(false);
      handleClose();
      return;
    }

    const blob = data.data;
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileNameForDownload || 'receipt.pdf');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setIsDownloading(false);
    handleClose();
  }, [apiParams, apiQuery, fetchFromRoute, fileNameForDownload, handleClose, isDownloading]);

  useEffect(() => {
    if (previewAction === 'print') {
      handlePrint();
    } else if (previewAction === 'download') {
      handleDownload();
    }
  }, [previewAction, handleClose, handlePrint, handleDownload]);

  return {
    renderedHTML,
    isLoadingTemplate,
    isPrinting,
    isDownloading
  };
};

export default useTransactionReceipt;
