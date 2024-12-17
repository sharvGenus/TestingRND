import { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import PropTypes from 'prop-types';
import request from 'utils/request';
import CircularLoader from 'components/CircularLoader';
import toast from 'utils/ToastNotistack';

const Iframe = styled('iframe')({
  width: '100%',
  border: '0'
});

const dashboardIdsMapping = {
  'Supervisor Dashboard': 77,
  'Inventory Dashboard': 1,
  'Substation Survey Report': 72,
  'Feeder Survey Report': 71,
  'DT Survey Report': 70,
  'WC Consumer Survey Report': 73,
  'Aging Of Material': 75,
  'Contractor Report': 76,
  'Document Wise Report': 78,
  'Stock Report': 79,
  'Project Summary Dashboard': 81,
  'Project Management Dashboard': 35,
  'Date Wise Productivity Report': 86,
  'Validation Status Report': 85,
  'Contractor Dashboard': 84,
  'Installer Wise Material Status Report': 136,
  'Supervisor Wise Material Status Report': 137
};

const MetabaseEmbed = ({ dashboardName }) => {
  const [iframeUrl, setIframeUrl] = useState('');

  const isReport = dashboardName.toLowerCase().includes('report');

  useEffect(() => {
    setIframeUrl('');

    (async () => {
      const metabaseData = await request('/reports-dashboard', {
        method: 'POST',
        body: { dashboardId: dashboardIdsMapping[dashboardName] }
      });

      if (!metabaseData.success) {
        toast(`There was an error while loading the ${isReport ? 'report' : 'dashboard'}`, { variant: 'error' });
        return;
      }

      setIframeUrl(metabaseData.data.iframeUrl);
    })();
  }, [dashboardName, isReport]);

  return !iframeUrl ? (
    <Box height="100%">
      <CircularLoader />
    </Box>
  ) : (
    <AutoSizer>
      {({ height, width }) => <Iframe title="Report Dashboard" src={iframeUrl} style={{ height: height, width: width }} />}
    </AutoSizer>
  );
};

MetabaseEmbed.propTypes = {
  dashboardName: PropTypes.string
};

export default MetabaseEmbed;
