import React, { useEffect, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useAsyncDebounce } from 'react-table';
import { CenteredMainCardTitle, CustomMainCard } from '../executive-dashboard';
import { chartHeadingBgColor } from '../executive-dashboard/elements';
import { dashboardSummaryPalette, transformDurationWiseSummary } from '../project-summary-dashboard';
import CircularLoader from 'components/CircularLoader';
import DashboardMultipleBarChart from 'components/charts/DashboardMultipleBarChart';
import { getDropdownProjects, getSupervisorCumulativeSummary, getSupervisorDashboard } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useReports } from 'pages/gmisp-reports/useReports';
import { useToastOnError } from 'hooks/useToastOnError';
import { RHFSelectbox, FormProvider } from 'hook-form';
import DashboardTable from 'components/charts/DashboardTable';
import DashboardPivotTable from 'components/charts/DashboardPivotTable';
import DashboardSummary from 'components/charts/DashboardSummary';
import { formatTimeStamp } from 'utils';

const todaysStatusColumns = [
  { Header: 'Installer Name', accessor: 'Installer Name' },
  { Header: 'Task Completed', accessor: 'Task Completed' },
  { Header: 'L1 Approval Pending', accessor: 'L1 Approval Pending' },
  { Header: 'L1 Approved', accessor: 'L1 Approved' },
  { Header: 'L1 Rejected', accessor: 'L1 Rejected' },
  { Header: 'L1 On-Hold', accessor: 'L1 On-Hold' },
  { Header: 'L2 Approval Pending', accessor: 'L2 Approval Pending' },
  { Header: 'L2 Approved', accessor: 'L2 Approved' },
  { Header: 'L2 Rejected', accessor: 'L2 Rejected' },
  { Header: 'L2 On-Hold', accessor: 'L2 On-Hold' },
  { Header: 'Total Working Hours', accessor: 'Total Working Hours' },
  { Header: 'Execution Started At', accessor: 'Execution Started At' },
  { Header: 'Execution Ended At', accessor: 'Execution Ended At' }
];

const SupervisorDashboard = () => {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        projectId: yup.string().required()
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { setValue, watch } = methods;
  const [projectId, dateTimeFrom, dateTimeTo, taskType] = watch(['projectId', 'dateTimeFrom', 'dateTimeTo', 'taskType']);

  const [projectOptions, projectsLoading] = [
    useProjects()?.projectsDropdown?.projectsDropdownObject,
    useProjects()?.projectsDropdown?.loading
  ];

  const [dashboardData, dashboardLoading, dashboardLoadingError] = [
    useReports()?.supervisorDashboard?.supervisorDashboardObject,
    useReports()?.supervisorDashboard?.loading,
    useReports()?.supervisorDashboard?.error
  ];
  const [cumulativeStatusData, cumulativeStatusLoading, cumulativeStatusError] = [
    useReports()?.supervisorCumulativeSummary?.supervisorCumulativeSummaryObject?.cumulativeStatus,
    useReports()?.supervisorCumulativeSummary?.loading,
    useReports()?.supervisorCumulativeSummary?.error
  ];

  const durationWiseSummary = transformDurationWiseSummary({ data: dashboardData?.taskTypeWiseStatus, sumByColumn: 'Response Type' });
  const hasNoAccess = !projectsLoading && projectOptions.length === 0;

  useToastOnError(dashboardLoadingError);
  useToastOnError(cumulativeStatusError);

  useEffect(() => {
    if (projectOptions.length > 0) {
      setValue('projectId', projectOptions[0].id);
    }
  }, [projectOptions, setValue]);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const loadDashboard = useCallback(async () => {
    if (!projectId) {
      return;
    }
    dispatch(getSupervisorDashboard({ projectId, taskType }));
  }, [dispatch, projectId, taskType]);

  const loadCumulativeDashboardData = useAsyncDebounce(async () => {
    if (!projectId || !(dateTimeFrom || dateTimeTo)) {
      return;
    }
    dispatch(getSupervisorCumulativeSummary({ projectId, dateTimeFrom, dateTimeTo, taskType }));
  }, 1200);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadCumulativeDashboardData();
  }, [loadCumulativeDashboardData, projectId, dateTimeFrom, dateTimeTo, taskType]);

  return (
    <>
      {((projectOptions && projectOptions.length > 1) || hasNoAccess) && (
        <CustomMainCard title={CenteredMainCardTitle({ title: 'Supervisor Dashboard' })} sx={{ mb: 2, pb: 1 }}>
          <FormProvider methods={methods}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <RHFSelectbox name="projectId" label="Project" menus={projectOptions} required />
              </Grid>
            </Grid>
          </FormProvider>
        </CustomMainCard>
      )}
      {!projectId && dashboardLoading && (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularLoader />
        </Box>
      )}
      {projectId && (
        <CustomMainCard
          title={CenteredMainCardTitle({
            title: 'Supervisor Dashboard'
          })}
          sx={{ mb: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormProvider methods={methods}>
                <RHFSelectbox
                  name="taskType"
                  label="Task Type"
                  menus={[
                    { id: 'Installation', name: 'Installation' },
                    { id: 'O&M', name: 'O&M' },
                    { id: 'Survey', name: 'Survey' }
                  ]}
                  allowClear
                />
              </FormProvider>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <DashboardSummary
                  palette={dashboardSummaryPalette}
                  valueColor="#000"
                  data={durationWiseSummary}
                  loadingCondition={dashboardLoading}
                  expectedLength={6}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <DashboardTable
                data={dashboardData?.todaysStatus?.map((item) => ({
                  ...item,
                  'Execution Started At': formatTimeStamp(item['Execution Started At']),
                  'Execution Ended At': formatTimeStamp(item['Execution Ended At'])
                }))}
                columns={todaysStatusColumns}
                loadingCondition={dashboardLoading}
                title={`Today's Status`}
                backgroundColor={chartHeadingBgColor}
              />
            </Grid>

            <Grid item xs={12}>
              <DashboardMultipleBarChart
                chartData={dashboardData?.dayWiseProductivityStatus}
                xAxis="date"
                title={'Day Wise Productivity Status'}
                height={480}
              />
            </Grid>

            <Grid item xs={12}>
              <DashboardMultipleBarChart
                chartData={dashboardData?.monthWiseProductivityStatus}
                xAxis="date"
                title={'Month Wise Productivity Status'}
                height={520}
              />
            </Grid>

            <Grid item xs={12}>
              <Box>
                <FormProvider methods={methods}>
                  <DashboardPivotTable
                    data={dateTimeFrom || dateTimeTo ? cumulativeStatusData : dashboardData?.cumulativeStatus}
                    loadingCondition={cumulativeStatusLoading || dashboardLoading}
                    categoryName="Response Type"
                    subCategoryName={[
                      'Form Name',
                      'Task Completed',
                      'L1 Approval Pending',
                      'L1 Approved',
                      'L1 Rejected',
                      'L1 On-Hold',
                      'L2 Approval Pending',
                      'L2 Approved',
                      'L2 Rejected',
                      'L2 On-Hold'
                    ]}
                    title={'Cumulative Summary Status'}
                    backgroundColor={chartHeadingBgColor}
                    dateTimeFrom={dateTimeFrom}
                    dateTimeTo={dateTimeTo}
                    setValue={setValue}
                  />
                </FormProvider>
              </Box>
            </Grid>
          </Grid>
        </CustomMainCard>
      )}
    </>
  );
};

export default SupervisorDashboard;
