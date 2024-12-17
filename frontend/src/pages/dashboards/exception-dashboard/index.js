import { Box, Grid, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import CircularLoader from 'components/CircularLoader';
import DashboardMultipleBarChart from 'components/charts/DashboardMultipleBarChart';
import DashboardPieChart from 'components/charts/DashboardPieChart';
import DashboardHorizontalBarChart from 'components/charts/DashboardHorizontalBarChart';

const ExceptionDashboard = () => {
  const [dashBoardData, setDashBoardData] = useState(null);

  const loadData = useCallback(async () => {
    const response = await request('/site-exception-report', { method: 'GET' });

    if (!response.success) {
      toast(response.error?.message || 'Something went wrong!', { variant: 'error' });
      return;
    }
    setDashBoardData(response?.data?.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const transformReasonForNonSurveyData = () => {
    const data = dashBoardData?.wcSurveyStatsData?.[0];

    if (!data || typeof data !== 'object') {
      return [];
    }

    const reasonForNonSurveyKey = 'Reason for Non Survey';
    const reasonForNonSurveyData = data[reasonForNonSurveyKey] || {};

    if (typeof reasonForNonSurveyData !== 'object') {
      return [];
    }

    return Object.entries(reasonForNonSurveyData).map(([key, value]) => ({
      key,
      value
    }));
  };

  const transformMeterLocationData = () => {
    const data = dashBoardData?.wcSurveyStatsData?.[0];

    if (!data || typeof data !== 'object') {
      return [];
    }

    const meterLocationKey = 'Meter Location';
    const meterLocationData = data[meterLocationKey] || {};

    if (typeof meterLocationData !== 'object') {
      return [];
    }

    const total = Object.values(meterLocationData).reduce((sum, value) => sum + value, 0);
    return Object.keys(meterLocationData).map((key) => ({
      name: key.replace(/_/g, ' '),
      value: meterLocationData[key],
      percentage: ((meterLocationData[key] / total) * 100).toFixed(2)
    }));
  };

  const transformTypeOfPremisesData = () => {
    const data = dashBoardData?.wcSurveyStatsData?.[0];
    if (!data || typeof data !== 'object') {
      return [];
    }

    const typeOfPremises = 'Type of Premises';
    const premisesData = data[typeOfPremises] || {};

    return Object.keys(premisesData).map((key) => ({
      key: key.replace(/_/g, ' '),
      value: premisesData[key]
    }));
  };

  const reasonForNonSurveyData = transformReasonForNonSurveyData();
  const transformedPieChartData = transformMeterLocationData();
  const transformedMultipleChartData = transformTypeOfPremisesData();

  return (
    <MainCard sx={{ mb: 2 }}>
      <Typography sx={{ backgroundColor: '#203764', color: '#fff', py: 1, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>
        Site Condition Cum Exception Dashboard
      </Typography>
      {dashBoardData ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" bgcolor="#0070c0" sx={{ p: 1, mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="h5" color="common.white">
                DT Site Condition
              </Typography>
              <Typography variant="h5" color="common.white">
                Total Records: {dashBoardData.dtSurveyStatsData?.[0]?.total_records}
              </Typography>
            </Stack>
          </Grid>
          {Object.keys(dashBoardData.dtSurveyStatsData?.[0]).map(
            (key) =>
              !['total_records'].includes(key) && (
                <Grid item xs={12} md={6} key={key}>
                  <Stack direction="row" sx={{ p: 1, height: '100%' }} alignItems="center">
                    <Typography sx={{ flex: 0.25 }} textTransform="capitalize" variant="h6">
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Stack sx={{ flex: 0.75 }} direction="row" flexWrap="wrap">
                      <Grid container spacing={0}>
                        {Object.keys(dashBoardData.dtSurveyStatsData?.[0][key]).map((statKey) => (
                          <Grid item sx={{ flex: 1 }} key={statKey}>
                            <Typography
                              whiteSpace="nowrap"
                              textTransform="capitalize"
                              textAlign="center"
                              sx={{ backgroundColor: '#00b050', color: 'white' }}
                            >
                              {statKey.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="h6" textAlign="center" sx={{ backgroundColor: '#ffc000' }}>
                              {dashBoardData.dtSurveyStatsData?.[0][key][statKey]}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Stack>
                </Grid>
              )
          )}
          <Grid item xs={12}>
            <Stack direction="row" bgcolor="#0070c0" sx={{ p: 1, mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="h5" color="common.white">
                WC Consumer Site Condition
              </Typography>
              <Typography variant="h5" color="common.white">
                Total Records: {dashBoardData.wcSurveyStatsData?.[0]?.total_records}
              </Typography>
            </Stack>
          </Grid>
          {Object.keys(dashBoardData.wcSurveyStatsData?.[0]).map(
            (key) =>
              !['total_records', 'type of premises', 'reason for non survey', 'meter location'].includes(key.toLowerCase()) && (
                <Grid item xs={12} md={6} key={key}>
                  <Stack direction="row" sx={{ p: 1, height: '100%' }} alignItems="center">
                    <Typography sx={{ flex: 0.25 }} textTransform="capitalize" variant="h6">
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Stack sx={{ flex: 0.75 }} direction="row" flexWrap="wrap">
                      <Grid container spacing={0}>
                        {Object.keys(dashBoardData.wcSurveyStatsData?.[0][key]).map((statKey) => (
                          <Grid item sx={{ flex: 1 }} key={statKey}>
                            <Typography
                              whiteSpace="nowrap"
                              textTransform="capitalize"
                              textAlign="center"
                              sx={{ backgroundColor: '#00b050', color: 'white' }}
                            >
                              {statKey.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="h6" textAlign="center" sx={{ backgroundColor: '#ffc000' }}>
                              {dashBoardData.wcSurveyStatsData?.[0][key][statKey]}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Stack>
                </Grid>
              )
          )}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box width="100%">
                  <DashboardHorizontalBarChart chartData={reasonForNonSurveyData} yAxis="key" title="Reason for Non Survey" height={267} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  width="100%"
                  sx={{ height: transformedPieChartData?.length === 0 ? 300 : null, mb: transformedPieChartData?.length === 0 ? 5 : null }}
                >
                  <DashboardPieChart data={transformedPieChartData} nameKey="name" title="Meter Location" />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DashboardMultipleBarChart chartData={transformedMultipleChartData} xAxis="key" title="Type of Premises" height={480} />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularLoader />
        </Box>
      )}
    </MainCard>
  );
};

export default ExceptionDashboard;
