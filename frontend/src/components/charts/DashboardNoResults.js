import { Box, Stack, Typography } from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import PropTypes from 'prop-types';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import MainCard from 'components/MainCard';

const DashboardNoResults = ({ title }) => {
  return (
    <MainCard sx={{ height: 400 }}>
      {title && title !== 'none' && (
        <Stack sx={{ border: '1px solid #97E7E1' }}>
          <Box
            sx={{
              backgroundColor: chartHeadingBgColor,
              py: 0.7,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              px: 2,
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" color="common.white" textAlign="center">
              {title}
            </Typography>
          </Box>
        </Stack>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 345,
          backgroundColor: '#f2f2f2',
          borderRadius: '10px',
          flexDirection: 'column',
          padding: 2
        }}
      >
        <DirectionsBoatIcon sx={{ fontSize: 56, color: 'lightgray' }} />
        <Typography variant="h4" component="h2" sx={{ color: '#b7b7b7', mt: 2, fontSize: 16 }}>
          No results!
        </Typography>
      </Box>
    </MainCard>
  );
};

DashboardNoResults.propTypes = {
  title: PropTypes.string.isRequired // Make sure the title is a string and required
};

export default DashboardNoResults;
