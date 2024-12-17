import React, { useEffect, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useAsyncDebounce } from 'react-table';
import { CenteredMainCardTitle, CustomMainCard } from '../executive-dashboard';
import { chartHeadingBgColor } from '../executive-dashboard/elements';
import CircularLoader from 'components/CircularLoader';
import DashboardMultipleBarChart from 'components/charts/DashboardMultipleBarChart';
import { getDropdownProjects, getProjectSummaryCumulativeStatus, getProjectSummaryDashboard } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import Validations from 'constants/yupValidations';
import { RHFSelectbox, FormProvider } from 'hook-form';
import { useReports } from 'pages/gmisp-reports/useReports';
import DashboardPivotTable from 'components/charts/DashboardPivotTable';
import DashboardSummary from 'components/charts/DashboardSummary/index';
import { useToastOnError } from 'hooks/useToastOnError';

export const dashboardSummaryPalette = ['#D9D9D9', '#EBF1DE', '#FDE9D9', '#DAEEF3', '#F2F2F2', '#F2DCDB'];

export const transformDurationWiseSummary = ({ data, sumByColumn }) => {
  if (!data?.length) return [];

  const transformedObject = data.reduce((acc, obj) => {
    for (let key in obj) {
      if (key !== sumByColumn) {
        acc[key] = (acc[key] || 0) + parseInt(obj[key]);
      }
    }
    return acc;
  }, {});

  const dataForSummary = Object.entries(transformedObject).map(([key, value]) => ({
    id: key,
    title: key.replace(/Tasks Completed|Tasks Completed At/gi, ''),
    value
  }));
  const firstColumnName = 'Total Tasks Completed';

  return [{ id: firstColumnName, title: firstColumnName }].concat(dataForSummary);
};

const dashboardSummaryBorder = '1px solid lightgray';

const ProjectSummaryDashboard = () => {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { setValue, watch } = methods;
  const [projectId, dateTimeFrom, dateTimeTo] = watch(['projectId', 'dateTimeFrom', 'dateTimeTo']);

  const [projectOptions, projectsLoading] = [
    useProjects()?.projectsDropdown?.projectsDropdownObject,
    useProjects()?.projectsDropdown?.loading
  ];

  const [dashboardData, dashboardLoading, dashboardLoadingError] = [
    useReports()?.projectSummaryDashboard?.projectSummaryDashboardObject,
    useReports()?.projectSummaryDashboard?.loading,
    useReports()?.projectSummaryDashboard?.error
  ];

  const [cumulativeStatusData, cumulativeStatusLoading, cumulativeStatusError] = [
    useReports()?.projectSummaryCumulativeStatus?.projectSummaryCumulativeStatusObject?.cumulativeStatus,
    useReports()?.projectSummaryCumulativeStatus?.loading,
    useReports()?.projectSummaryCumulativeStatus?.error
  ];

  useToastOnError(dashboardLoadingError);
  useToastOnError(cumulativeStatusError);

  const {
    taskTypeWiseStatus,
    cumulativeStatus,
    dayWiseSurveyStatus,
    dayWiseInstallationStatus,
    dayWiseOMStatus,
    monthWiseSurveyStatus,
    monthWiseInstallationStatus,
    monthWiseOMStatus
  } = dashboardData;

  const durationWiseSummary = transformDurationWiseSummary({ data: taskTypeWiseStatus, sumByColumn: 'Response Type' });

  const hasNoAccess = !projectsLoading && projectOptions.length === 0;

  const loadDashboard = useCallback(async () => {
    if (!projectId) {
      return;
    }
    dispatch(getProjectSummaryDashboard({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectOptions.length > 0) {
      setValue('projectId', projectOptions[0].id);
    }
  }, [projectOptions, setValue]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const loadCumulativeDashboardData = useAsyncDebounce(() => {
    if (!projectId || !(dateTimeFrom || dateTimeTo)) {
      return;
    }
    dispatch(getProjectSummaryCumulativeStatus({ projectId, dateTimeFrom, dateTimeTo }));
  }, 1200);

  useEffect(() => {
    loadCumulativeDashboardData({ projectId, dateTimeFrom, dateTimeTo });
  }, [dateTimeFrom, dateTimeTo, dispatch, loadCumulativeDashboardData, projectId]);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  return (
    <>
      {((projectOptions && projectOptions.length > 1) || hasNoAccess) && (
        <CustomMainCard title={CenteredMainCardTitle({ title: 'Project Summary Dashboard' })} sx={{ mb: 2, pb: 1 }}>
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
            title: 'Project Summary Dashboard'
          })}
          sx={{ mb: 2 }}
        >
          <Box sx={{ mb: 2 }}>
            <Box sx={{ borderTop: dashboardSummaryBorder, borderLeft: dashboardSummaryBorder, borderRight: dashboardSummaryBorder }}>
              <DashboardSummary
                palette={dashboardSummaryPalette}
                valueColor="#000"
                data={durationWiseSummary}
                loadingCondition={dashboardLoading}
                expectedLength={6}
              />
            </Box>

            {taskTypeWiseStatus &&
              taskTypeWiseStatus.length > 0 &&
              taskTypeWiseStatus.map((item, index) => (
                <Box
                  key={item['Response Type']}
                  sx={{
                    borderTop: dashboardSummaryBorder,
                    borderLeft: dashboardSummaryBorder,
                    borderRight: dashboardSummaryBorder,
                    ...(index === taskTypeWiseStatus.length - 1 && { borderBottom: dashboardSummaryBorder })
                  }}
                >
                  <DashboardSummary
                    key={item['Response Type']}
                    reducedHeight
                    palette={dashboardSummaryPalette}
                    valueColor="#000"
                    data={Object.entries(item).map(([key, value], i) => ({ id: key, ...(i === 0 ? { title: value } : { value }) }))}
                    loadingCondition={dashboardLoading}
                    expectedLength={6}
                  />
                </Box>
              ))}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <FormProvider methods={methods}>
                  <DashboardPivotTable
                    data={dateTimeFrom || dateTimeTo ? cumulativeStatusData : cumulativeStatus}
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
            <Grid item xs={12}>
              <DashboardMultipleBarChart chartData={dayWiseSurveyStatus} xAxis="date" title={'Day Wise Survey Status'} height={480} />
            </Grid>
            <Grid item xs={12}>
              <DashboardMultipleBarChart
                chartData={dayWiseInstallationStatus}
                xAxis="date"
                title={'Day Wise Installation Status'}
                height={480}
              />
            </Grid>
            <Grid item xs={12}>
              <DashboardMultipleBarChart chartData={dayWiseOMStatus} xAxis="date" title={'Day Wise O&M Status'} height={520} />
            </Grid>
            <Grid item xs={12}>
              <DashboardMultipleBarChart chartData={monthWiseSurveyStatus} xAxis="date" title={'Month Wise Survey Status'} height={520} />
            </Grid>
            <Grid item xs={12}>
              <DashboardMultipleBarChart
                chartData={monthWiseInstallationStatus}
                xAxis="date"
                title={'Month Wise Installation Status'}
                height={520}
              />
            </Grid>
            <Grid item xs={12}>
              <DashboardMultipleBarChart chartData={monthWiseOMStatus} xAxis="date" title={'Month Wise O&M Status'} height={520} />
            </Grid>
          </Grid>
        </CustomMainCard>
      )}
    </>
  );
};

export default ProjectSummaryDashboard;
