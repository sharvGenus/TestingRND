import React, { useEffect, useCallback, useMemo } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  chartHeadingBgColor,
  contractorSummaryMainTableColumns,
  contractorWiseMaterialAgingColumns,
  mainHeadingBgColor,
  transformContractorSummaryMainTable,
  transformContractorWiseMaterialAgingData
} from '../executive-dashboard/elements';
import DashboardComboChart from '../../../components/charts/DashboardComboChart';
import { createFormsList, generateGaaApiParameter } from 'utils';
import MainCard from 'components/MainCard';
import DashboardVerticalBarChart from 'components/charts/DashboardVerticalBarChart';
import DashboardHorizontalStackedBarChart from 'components/charts/DashboardHorizontalStackedBarChart';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { getAreaWiseProgressDashboard, getDropdownProjects, getProjectAreaLevels, getWebformData } from 'store/actions';
import Validations from 'constants/yupValidations';
import DashboardTable from 'components/charts/DashboardTable';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import { useReports } from 'pages/gmisp-reports/useReports';
import { useToastOnError } from 'hooks/useToastOnError';
import { useGaa } from 'pages/extra-pages/gaa/useGaa';
import { generateAreaLevelsValidation } from 'pages/gmisp-reports/validation-status-report';

const surveyFormTypeId = '1d75feca-2e64-4b95-900d-fcd53446ddeb';
const installationFormTypeId = '30ea8a65-ff5b-4bff-b1a1-892204e23669';

const cumulativeStatusColumns = [
  { Header: 'Activity Type', accessor: 'Activity Type' },
  { Header: 'Name', accessor: 'Form Name' },
  { Header: 'Scope', accessor: 'Scope' },
  { Header: 'Actual', accessor: 'Actual' },
  { Header: 'L1 Approval Pending', accessor: 'L1 Approval Pending' },
  { Header: 'L1 Approved', accessor: 'L1 Approved' },
  { Header: 'L1 Rejected', accessor: 'L1 Rejected' },
  { Header: 'L1 On-Hold', accessor: 'L1 On-Hold' },
  { Header: 'L2 Approval Pending', accessor: 'L2 Approval Pending' },
  { Header: 'L2 Approved', accessor: 'L2 Approved' },
  { Header: 'L2 Rejected', accessor: 'L2 Rejected' },
  { Header: 'L2 On-Hold', accessor: 'L2 On-Hold' }
];

const hierarchyOptions = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

function sortByMonthYear(data) {
  return [...data].sort((a, b) => {
    const [monthA, yearA] = a.name.split('-');
    const [monthB, yearB] = b.name.split('-');

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndexA = monthOrder.indexOf(monthA);
    const monthIndexB = monthOrder.indexOf(monthB);

    if (yearA !== yearB) {
      return yearA - yearB;
    } else {
      return monthIndexA - monthIndexB;
    }
  });
}

const AreaWiseProgressDashboard = () => {
  const dispatch = useDispatch();

  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const reportsResponseData = useReports();
  const [dashboardData, dashboardLoading, dashboardError] = [
    reportsResponseData?.areaWiseProgressDashboard?.areaWiseProgressDashboardObject,
    reportsResponseData?.areaWiseProgressDashboard?.loading,
    reportsResponseData?.areaWiseProgressDashboard?.error
  ];
  const gaaData = useGaa();
  const [areaLevelsData, areaLevelsAccessRank, areaLevelsLoading, areaLevelsError] = [
    gaaData?.projectAreaLevels?.projectAreaLevelsObject?.[0]?.gaaLevels,
    gaaData?.projectAreaLevels?.accessRank,
    gaaData?.projectAreaLevels?.loading,
    gaaData?.projectAreaLevels?.error
  ];
  const shouldShowDashboard = !!Object.keys(dashboardData).length;

  useToastOnError(areaLevelsError);
  useToastOnError(dashboardError);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        projectId: Validations.other,
        toDate: Validations.toDate,
        ...generateAreaLevelsValidation(areaLevelsData, areaLevelsAccessRank)
      })
    ),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });
  const { handleSubmit, watch, setValue } = methods;
  const [projectId, hierarchyType, fromDate, toDate] = watch(['projectId', 'hierarchyType', 'fromDate', 'toDate']);

  const onSubmit = useCallback(
    async (formValues) => {
      const { activityType } = formValues;
      const { errorFlag, newLevelFilter: gaaLevelDetails } = generateGaaApiParameter({
        areaLevelsData,
        values: formValues,
        methods,
        accessRank: areaLevelsAccessRank
      });
      if (errorFlag) return;

      dispatch(
        getAreaWiseProgressDashboard({
          gaaLevelDetails,
          projectId,
          fromDate,
          toDate,
          activityType: activityType !== 'all' ? activityType : null
        })
      );
    },
    [areaLevelsAccessRank, areaLevelsData, dispatch, fromDate, methods, projectId, toDate]
  );

  const filterGaaMenu = useCallback(
    (gaa, index) => {
      const prev = index - 1;
      return watch()?.[`gaaLevelEntryId${prev}`]
        ? gaa.gaa_level_entries.filter((x) => watch()?.[`gaaLevelEntryId${prev}`]?.includes(x?.parentId))
        : gaa.gaa_level_entries;
    },
    [watch]
  );

  const handleChangeDropDown = useCallback(
    (index, hLevelData, currentValues, isFixedLength, values) => {
      currentValues = structuredClone(currentValues);
      currentValues[`gaaLevelEntryId${index}`] = values;
      let i = index;
      while (i < (isFixedLength ? hLevelData.length - 1 : hLevelData.length)) {
        const nextKey = `gaaLevelEntryId${i + 1}`;
        const curKey = `gaaLevelEntryId${i}`;
        const nextGaa = hLevelData[i + 1];
        const nextMenus =
          currentValues?.[curKey] && nextGaa?.gaa_level_entries
            ? nextGaa?.gaa_level_entries?.filter((x) => currentValues?.[curKey]?.includes(x?.parentId))
            : nextGaa?.gaa_level_entries || [];
        const nextValue =
          (Array.isArray(currentValues[nextKey]) && currentValues[nextKey]?.filter((x) => nextMenus.some((y) => y.id === x))) || [];
        setValue(nextKey, nextValue);
        currentValues[nextKey] = nextValue;
        i += 1;
      }
    },
    [setValue]
  );

  const handleActivityTypeChange = useCallback(
    (e) => {
      handleSubmit(onSubmit)({ activityType: e.target.value });
    },
    [handleSubmit, onSubmit]
  );

  const contractorSummaryMainTable = transformContractorSummaryMainTable(dashboardData?.contractorSummaryMainTable || []);
  const contractorWiseMaterialAgingData = transformContractorWiseMaterialAgingData(dashboardData?.contractorSummaryMainTable || []);

  const { webforms } = useDefaultFormAttributes();
  const formsList = [{ id: 'all', name: 'All' }, ...createFormsList(webforms || [])];

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!hierarchyOptions?.[0]?.id) return;
    setValue('hierarchyType', hierarchyOptions[0].id);
  }, [setValue]);

  useEffect(() => {
    projectId && dispatch(getProjectAreaLevels({ projectId, isAccessForAllResponses: '1' }));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (!projectId) return;
    dispatch(
      getWebformData({
        typeId: [installationFormTypeId, surveyFormTypeId],
        sortBy: 'updatedAt',
        sortOrder: 'DESC',
        projectId,
        accessSource: 'Form Responses'
      })
    );
  }, [dispatch, projectId]);

  const contractorSummaryMainTableMemo = useMemo(() => contractorSummaryMainTable, [contractorSummaryMainTable]);
  const contractorWiseMaterialAgingDataMemo = useMemo(() => contractorWiseMaterialAgingData, [contractorWiseMaterialAgingData]);

  return (
    <>
      <MainCard title="Area Wise Progress Dashboard">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <RHFSelectbox name="projectId" label="Project" menus={projectOptions} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFSelectbox name="hierarchyType" label="Hierarchy Type" menus={hierarchyOptions} />
            </Grid>
            {hierarchyType === 'gaa' &&
              areaLevelsData?.length > 0 &&
              areaLevelsData?.map((item, index) => {
                return (
                  <Grid item md={3} xl={3} key={item.id}>
                    <RHFSelectTags
                      name={`gaaLevelEntryId${index}`}
                      label={item.name}
                      onChange={handleChangeDropDown.bind(null, index, areaLevelsData, watch(), true)}
                      menus={filterGaaMenu(item, index)}
                      disable={index !== 0 && !watch()?.[`gaaLevelEntryId${index - 1}`]?.length}
                      required={index !== 0 ? false : true}
                    />
                  </Grid>
                );
              })}
            <Grid item xs={12} md={3}>
              <RHFTextField name="fromDate" label="From Date" type="date" />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField name="toDate" label="To Date" type="date" />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled={areaLevelsLoading || dashboardLoading}
                type="submit"
                variant="contained"
                color="primary"
                startIcon={dashboardLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                Proceed
              </Button>
            </Grid>
          </Grid>
        </FormProvider>

        {shouldShowDashboard && (
          <>
            <Typography
              sx={{ backgroundColor: mainHeadingBgColor, py: 0.5, mt: 2, fontSize: '1rem', fontWeight: 'bold' }}
              color="common.white"
              textAlign="center"
            >
              Today&apos;s Status
            </Typography>
            <Grid container spacing={1} sx={{ mb: 1, mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <Box width="100%" sx={{ height: 400 }}>
                  <DashboardVerticalBarChart chartData={dashboardData?.todaysProgressCi} xAxis="Form Name" title="Consumer Indexing" />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width="100%" sx={{ height: 400 }}>
                  <DashboardVerticalBarChart chartData={dashboardData?.todaysProgressMi} xAxis="Form Name" title="Meter Installation" />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box width="100%" sx={{ height: 400 }}>
                  <DashboardVerticalBarChart
                    chartData={dashboardData?.todaysProgressOAndM}
                    xAxis="Form Name"
                    title="Operation & Maintenance"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ height: 500 }}>
                  <DashboardHorizontalStackedBarChart
                    data={dashboardData?.todaysStatusContractorWise}
                    yAxisKey="Organization Name"
                    title={'Active Workforce'}
                  />
                </Box>
              </Grid>
            </Grid>

            <Typography
              sx={{ backgroundColor: mainHeadingBgColor, py: 0.5, mt: 2, fontSize: '1rem', fontWeight: 'bold' }}
              color="common.white"
              textAlign="center"
            >
              All Time Status
            </Typography>
            <Grid container spacing={1} sx={{ mb: 1, mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <Box width="100%" sx={{ height: 400, mb: 2 }}>
                  <DashboardVerticalBarChart chartData={dashboardData?.allTimeProgressCi} xAxis="Form Name" title="Consumer Indexing" />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width="100%" sx={{ height: 400, mb: 2 }}>
                  <DashboardVerticalBarChart chartData={dashboardData?.allTimeProgressMi} xAxis="Form Name" title="Meter Installation" />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box width="100%" sx={{ height: 400, mb: 2 }}>
                  <DashboardVerticalBarChart
                    chartData={dashboardData?.allTimeProgressOAndM}
                    xAxis="Form Name"
                    title="Operation & Maintenance"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ height: 400, mb: 2 }}>
                  <DashboardHorizontalStackedBarChart
                    data={dashboardData?.allTimeStatusContractorWise}
                    yAxisKey="Organization Name"
                    title={'Active Workforce'}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mb: 1, mt: 0.5 }}>
              <DashboardTable
                backgroundColor={chartHeadingBgColor}
                highlightedColumnsCount={2}
                data={dashboardData?.cumulativeStatus || []}
                columns={cumulativeStatusColumns}
                title={'Cumulative Status'}
              />
            </Box>

            <Typography
              sx={{ backgroundColor: mainHeadingBgColor, py: 0.5, mt: 2, fontSize: '1rem', fontWeight: 'bold' }}
              color="common.white"
              textAlign="center"
            >
              All Time Progress
            </Typography>

            <MainCard>
              <FormProvider methods={methods}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="h5" noWrap>
                      Activity Type
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <RHFSelectbox
                      name="activityType"
                      onChange={handleActivityTypeChange}
                      label=""
                      menus={formsList}
                      fullWidth
                      defaultValue={formsList[0]?.id}
                    />
                  </Grid>
                </Grid>
              </FormProvider>
            </MainCard>

            <Grid container sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #97E7E1' }} height={460}>
                  <DashboardComboChart
                    data={dashboardData?.allDateWiseData}
                    chartConfig={{
                      'Consumer Indexing': { type: 'bar', color: '#FFC000' },
                      'Meter Installation': { type: 'bar', color: '#00B050' },
                      'CI Workforce': { type: 'line', color: '#FFC000' },
                      'MI Workforce': { type: 'line', color: '#00B050' }
                    }}
                    title={'Date Wise'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #97E7E1' }} height={460}>
                  <DashboardComboChart
                    data={sortByMonthYear(dashboardData?.allMonthWiseData)}
                    chartConfig={{
                      'Consumer Indexing': { type: 'bar', color: '#FFC000' },
                      'Meter Installation': { type: 'bar', color: '#00B050' },
                      'CI Workforce': { type: 'line', color: '#FFC000' },
                      'MI Workforce': { type: 'line', color: '#00B050' }
                    }}
                    title={'Month Wise'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #97E7E1' }} height={460}>
                  <DashboardComboChart
                    data={dashboardData?.allCircleWiseData}
                    chartConfig={{
                      'Consumer Indexing': { type: 'bar', color: '#ED7D31' },
                      'Meter Installation': { type: 'bar', color: '#5B9BD5' },
                      'CI Workforce': { type: 'line', color: '#A5A5A5' },
                      'MI Workforce': { type: 'line', color: '#FFC000' }
                    }}
                    title={'Circle Wise'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #97E7E1' }} height={460}>
                  <DashboardComboChart
                    data={dashboardData?.allDivisionWiseData}
                    chartConfig={{
                      'Consumer Indexing': { type: 'bar', color: '#4472C4' },
                      'Meter Installation': { type: 'bar', color: '#70AD47' },
                      'CI Workforce': { type: 'line', color: '#FFC000' },
                      'MI Workforce': { type: 'line', color: '#43682B' }
                    }}
                    title={'Division Wise'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #97E7E1' }} height={460}>
                  <DashboardComboChart
                    data={dashboardData?.allSubDivisionWiseData}
                    chartConfig={{
                      'Consumer Indexing': { type: 'bar', color: '#FFC000' },
                      'Meter Installation': { type: 'bar', color: '#ED7D31' },
                      'CI Workforce': { type: 'line', color: '#70AD47' },
                      'MI Workforce': { type: 'line', color: '#9E480E' }
                    }}
                    title={'Sub Division Wise'}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mb: 1, mt: 0.5 }}>
              <DashboardTable
                title={'All Time Progress'}
                backgroundColor={chartHeadingBgColor}
                data={contractorSummaryMainTableMemo?.data}
                columns={contractorSummaryMainTableColumns}
              />
            </Box>
            <Box sx={{ mb: 1, mt: 0.5 }}>
              <DashboardTable
                title={'Contractor Wise Material Aging Details'}
                backgroundColor={chartHeadingBgColor}
                data={contractorWiseMaterialAgingDataMemo?.data}
                columns={contractorWiseMaterialAgingColumns}
              />
            </Box>
          </>
        )}
      </MainCard>
    </>
  );
};

export default AreaWiseProgressDashboard;
