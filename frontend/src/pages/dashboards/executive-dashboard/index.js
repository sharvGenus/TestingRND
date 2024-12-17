import { Box, Grid, Typography, styled } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardSummary from '../../../components/charts/DashboardSummary/index';
import DashboardTable from '../../../components/charts/DashboardTable';
import DashboardStackedBarChart from '../../../components/charts/DashboardStackedBarChart';
import DashboardMultipleBarChart from '../../../components/charts/DashboardMultipleBarChart';
import DashboardHorizontalBarChart from '../../../components/charts/DashboardHorizontalBarChart';
import DashboardPieChart from '../../../components/charts/DashboardPieChart';
import {
  chartHeadingBgColor,
  contractorMaterialDetailColumns,
  contractorSummaryMainTableColumns,
  contractorWiseMaterialAgingColumns,
  mainExecutiveTableColumns,
  transformContractorMaterialDetail,
  transformContractorStats,
  transformContractorSummaryMainTable,
  transformContractorWiseMaterialAgingData,
  transformMainExecutiveTableData,
  transformMainExecutiveTableDataSummary,
  transformMeterTypeWiseData,
  transformPlannedVsActualMeterInstallationStatus,
  transformGaaLevelWisePercentage
} from './elements';
import MainCard from 'components/MainCard';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { FormProvider, RHFSelectbox } from 'hook-form';
import Validations from 'constants/yupValidations';
import { getDropdownProjects, getExecutiveDashboard, getProjectDetails } from 'store/actions';
import CircularLoader from 'components/CircularLoader';
import DashboardNoResults from 'components/charts/DashboardNoResults';
import { useReports } from 'pages/gmisp-reports/useReports';
import { useToastOnError } from 'hooks/useToastOnError';

export const CenteredMainCardTitle = ({ title }) => {
  return (
    <Typography variant="h5" align="center">
      {title}
    </Typography>
  );
};

// const hasOnlyUnknownData = (data) => data?.length === 1 && data?.some((item) => item.label.match(/unknown/i));

export const CustomMainCard = styled(MainCard)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    paddingTop: theme.spacing(0.9),
    paddingBottom: theme.spacing(0.9)
  },
  '& .MuiCardContent-root': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

CenteredMainCardTitle.propTypes = {
  title: PropTypes.string.isRequired
};

const initialState = {
  contractorSummary: {},
  contractorSummaryMainTable: [],
  plannedVsActualInstallationStatus: [],
  regionWisePercentage: [],
  circleWiseData: [],
  mainExecutiveData: [],
  mainExecutiveDataSummary: []
};

const ExecutiveDashboard = () => {
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
  const [projectId] = watch(['projectId']);

  const dispatch = useDispatch();

  const [projectOptions, projectsLoading] = [
    useProjects()?.projectsDropdown?.projectsDropdownObject,
    useProjects()?.projectsDropdown?.loading
  ];
  const [dashboardData, dashboardLoading, dashboardError] = [
    { ...initialState, ...useReports()?.executiveDashboard?.executiveDashboardObject },
    useReports()?.executiveDashboard?.loading,
    useReports()?.executiveDashboard?.error
  ];
  const projectDetails = useProjects()?.projectDetails?.projectDetailsObject;
  const selectedProjectDetails = useMemo(() => (projectDetails?.id === projectId ? projectDetails : null), [projectDetails, projectId]);

  useToastOnError(dashboardError);

  const hasNoAccess = !projectsLoading && projectOptions.length === 0;

  const {
    contractorSummary: rawContractorSummary,
    contractorSummaryMainTable: rawContractorSummaryMainTable,
    plannedVsActualInstallationStatus: rawPlannedVsActualInstallationStatus,
    regionWisePercentage: rawRegionWisePercentage,
    zoneWisePercentage: rawZoneWisePercentage,
    circleWiseData,
    mainExecutiveData: rawMainExecutiveData
  } = dashboardData;

  const contractorSummary = useMemo(() => transformContractorStats(rawContractorSummary), [rawContractorSummary]);
  const contractorWiseMaterialDetailsTable = useMemo(
    () => transformContractorMaterialDetail(rawContractorSummaryMainTable || []),
    [rawContractorSummaryMainTable]
  );
  const plannedVsActualInstallationStatus = useMemo(
    () => transformPlannedVsActualMeterInstallationStatus(rawPlannedVsActualInstallationStatus || []),
    [rawPlannedVsActualInstallationStatus]
  );

  const regionWisePercentage = useMemo(() => transformGaaLevelWisePercentage(rawRegionWisePercentage || []), [rawRegionWisePercentage]);
  const zoneWisePercentage = useMemo(() => transformGaaLevelWisePercentage(rawZoneWisePercentage || []), [rawZoneWisePercentage]);
  const meterTypeWiseData = useMemo(() => transformMeterTypeWiseData(circleWiseData || []), [circleWiseData]);
  const mainExecutiveData = useMemo(() => transformMainExecutiveTableData(rawMainExecutiveData || []), [rawMainExecutiveData]);

  const mainExecutiveDataSummary = useMemo(
    () => transformMainExecutiveTableDataSummary(rawMainExecutiveData || [], selectedProjectDetails || {}),
    [rawMainExecutiveData, selectedProjectDetails]
  );
  const contractorSummaryMainTable = useMemo(
    () => transformContractorSummaryMainTable(rawContractorSummaryMainTable || []),
    [rawContractorSummaryMainTable]
  );
  const contractorWiseMaterialAgingData = useMemo(
    () => transformContractorWiseMaterialAgingData(rawContractorSummaryMainTable || []),
    [rawContractorSummaryMainTable]
  );

  const loadDashboard = useCallback(async () => {
    if (!projectId) {
      return;
    }
    dispatch(getExecutiveDashboard({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectOptions.length > 0) {
      setValue('projectId', projectOptions[0].id);
    }
  }, [projectOptions, setValue]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectDetails(projectId));
    }
  }, [projectId, dispatch]);

  return (
    <>
      {((projectOptions && projectOptions.length > 1) || hasNoAccess) && (
        <CustomMainCard title={CenteredMainCardTitle({ title: 'Executive Dashboard' })} sx={{ mb: 2, pb: 1 }}>
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
        <>
          <CustomMainCard
            title={CenteredMainCardTitle({
              title: 'Executive Dashboard'
            })}
            sx={{ mb: 2 }}
          >
            <Box sx={{ mb: 1 }}>
              <DashboardSummary data={mainExecutiveDataSummary} />
            </Box>
            <Box>
              <DashboardTable
                backgroundColor={chartHeadingBgColor}
                data={mainExecutiveData}
                columns={mainExecutiveTableColumns}
                highlightedColumnsCount={2}
                loadingCondition={dashboardLoading}
                title={'none'}
              />
            </Box>
          </CustomMainCard>

          <CustomMainCard title={CenteredMainCardTitle({ title: 'Total Meter Installed' })} sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <DashboardPieChart data={regionWisePercentage} nameKey="label" title="Total Meter Installed (Region Wise)" />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <DashboardPieChart data={zoneWisePercentage} nameKey="label" title="Total Meter Installed (Zone Wise)" />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <DashboardStackedBarChart data={circleWiseData} title={'Total Meter Installed (Circle Wise)'} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box width="100%">
                  <DashboardHorizontalBarChart
                    chartData={meterTypeWiseData}
                    yAxis="Meter Type"
                    title="Total Meter Installed (Meter Type Wise)"
                    height={300}
                  />
                </Box>
              </Grid>
            </Grid>
          </CustomMainCard>

          <CustomMainCard title={CenteredMainCardTitle({ title: 'Plan Vs Actual Meter Installation Status' })} sx={{ mb: 2, height: 460 }}>
            <Grid container spacing={1}>
              {Array.isArray(plannedVsActualInstallationStatus) && plannedVsActualInstallationStatus.length > 0 ? (
                plannedVsActualInstallationStatus.map((data) => (
                  <Grid item xs={12} key={data.id}>
                    <DashboardMultipleBarChart xAxis={data.xAxis} chartData={data.chartData} title={data?.title} height={520} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ height: 300 }}>
                    <DashboardNoResults />
                  </Box>
                </Grid>
              )}
            </Grid>
          </CustomMainCard>

          <CustomMainCard title={CenteredMainCardTitle({ title: 'Contractor Summary' })} sx={{ mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <DashboardSummary data={contractorSummary} expectedLength={5} />
            </Box>
            <Box sx={{ mb: 0.7 }}>
              <DashboardTable
                backgroundColor={chartHeadingBgColor}
                data={contractorSummaryMainTable.data}
                columns={contractorSummaryMainTableColumns}
                loadingCondition={dashboardLoading}
                title={'Contractor Summary'}
              />
            </Box>
            <Box sx={{ mb: 0.7 }}>
              <DashboardTable
                backgroundColor={chartHeadingBgColor}
                data={contractorWiseMaterialDetailsTable.data}
                columns={contractorMaterialDetailColumns}
                loadingCondition={dashboardLoading}
                title={'Contractor Wise Material Details'}
              />
            </Box>
            <Box sx={{ mb: 0.7 }}>
              <DashboardTable
                backgroundColor={chartHeadingBgColor}
                data={contractorWiseMaterialAgingData.data}
                columns={contractorWiseMaterialAgingColumns}
                title={'Contractor Wise Material Aging Details'}
              />
            </Box>
          </CustomMainCard>
        </>
      )}
    </>
  );
};

export default ExecutiveDashboard;
