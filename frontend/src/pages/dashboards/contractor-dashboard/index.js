import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DashboardTable from '../../../components/charts/DashboardTable';
import DashboardSummary from '../../../components/charts/DashboardSummary/index';
import { CenteredMainCardTitle, CustomMainCard } from '../executive-dashboard';
import { chartHeadingBgColor } from '../executive-dashboard/elements';
import { RHFSelectbox, FormProvider, RHFSelectTags } from 'hook-form';
import { getContractorDashboard, getDropdownProjects, getLovsForMasterName } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useReports } from 'pages/gmisp-reports/useReports';
import { useToastOnError } from 'hooks/useToastOnError';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import CircularLoader from 'components/CircularLoader';
import DashboardMultipleBarChart from 'components/charts/DashboardMultipleBarChart';
import MainCard from 'components/MainCard';

const contractorTableColumns = [
  { Header: 'Organization Name', accessor: 'Organization Name' },
  { Header: 'Meter Issued To Contractor', accessor: 'Meter Issued To Contractor' },
  { Header: 'Meter Available At Contractor', accessor: 'Meter Available At Contractor' },
  { Header: 'Meter Issued To Installer', accessor: 'Meter Issued To Installer' },
  { Header: 'Total Installation', accessor: 'Total Installation' },
  { Header: 'L1 Level - Pending', accessor: 'L1 Level - Pending' },
  { Header: 'L1 Level - Approved', accessor: 'L1 Level - Approved' },
  { Header: 'L1 Level - Rejected', accessor: 'L1 Level - Rejected' },
  { Header: 'L1 Level - On-Hold', accessor: 'L1 Level - On-Hold' },
  { Header: 'L2 Level - Pending', accessor: 'L2 Level - Pending' },
  { Header: 'L2 Level - Approved', accessor: 'L2 Level - Approved' },
  { Header: 'L2 Level - Rejected', accessor: 'L2 Level - Rejected' },
  { Header: 'L2 Level - On-Hold', accessor: 'L2 Level - On-Hold' }
].map((column) => ({ ...column, align: 'center' }));

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const meterTypeOptions = useMasterMakerLov()?.masterMakerOrgType?.masterObject;

  const [dashboardData, dashboardLoading, dashboardError] = [
    useReports()?.contractorDashboard?.contractorDashboardObject,
    useReports()?.contractorDashboard?.loading,
    useReports()?.contractorDashboard?.error
  ];

  const isDashboardDataPresent = Object.keys(dashboardData).length > 0;

  const {
    baseTable,
    contractorCount,
    teamAvailaibilityToday,
    teamAvailaibilityCurrentWeek,
    teamAvailabilityLastWeek,
    teamAvailabilityCurrentMonth,
    teamAvailabilityLastMonth,
    todaysStatus,
    currentMonthStatus
  } = dashboardData;

  useToastOnError(dashboardError);

  const methods = useForm({
    resolver: yupResolver(yup.object().shape({})),
    defaultValues: {
      projectId: '',
      meterTypeId: ''
    },
    mode: 'all'
  });

  const { watch, setValue } = methods;

  const [projectId, meterTypeId] = watch(['projectId', 'meterTypeId']);

  useEffect(() => {
    if (projectOptions && projectOptions.length > 0) {
      setValue('projectId', projectOptions[0].id);
    }
  }, [projectOptions, setValue]);

  useEffect(() => {
    if (!projectId) return;
    dispatch(getContractorDashboard({ projectId, ...(meterTypeId && { meterTypeId }) }));
  }, [projectId, meterTypeId, dispatch]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('MATERIAL TYPE'));
  }, [dispatch]);

  return (
    <>
      {projectOptions && projectOptions.length > 1 && (
        <CustomMainCard sx={{ mb: 2 }} title={<CenteredMainCardTitle title="Contractor Dashboard" />}>
          <FormProvider methods={methods}>
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} md={3}>
                <RHFSelectbox name="projectId" label="Project" menus={projectOptions} />
              </Grid>
            </Grid>
          </FormProvider>
        </CustomMainCard>
      )}

      {dashboardLoading && !isDashboardDataPresent && (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularLoader />
        </Box>
      )}

      {isDashboardDataPresent && (
        <MainCard>
          <Box sx={{ mb: 1 }}>
            <DashboardSummary
              data={[
                { title: 'Contractor Count', value: contractorCount },
                { title: 'Team Availability (Today)', value: teamAvailaibilityToday },
                { title: 'Team Availability (Current Week)', value: teamAvailaibilityCurrentWeek },
                { title: 'Team Availability (Last Week)', value: teamAvailabilityLastWeek },
                { title: 'Team Availability (Current Month)', value: teamAvailabilityCurrentMonth },
                { title: 'Team Availability (Last Month)', value: teamAvailabilityLastMonth }
              ]}
              expectedLength={6}
              loadingCondition={dashboardLoading}
            />
          </Box>

          <FormProvider methods={methods}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={3}>
                <RHFSelectTags name="meterTypeId" label="" placeholder="Material Type" menus={meterTypeOptions} />
              </Grid>
            </Grid>
          </FormProvider>

          <Box sx={{ mt: 2 }}>
            <DashboardTable
              title="none"
              backgroundColor={chartHeadingBgColor}
              data={baseTable}
              columns={contractorTableColumns}
              loadingCondition={dashboardLoading}
            />
          </Box>
          <Grid item xs={12}>
            <Box sx={{ mb: 8 }}>
              <DashboardMultipleBarChart chartData={todaysStatus} xAxis="Organization Name" title={`Today's Status`} height={500} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <DashboardMultipleBarChart
              chartData={currentMonthStatus}
              xAxis="Organization Name"
              title={'Current Month Status'}
              from={'contractor'}
              height={500}
            />
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default ContractorDashboard;
