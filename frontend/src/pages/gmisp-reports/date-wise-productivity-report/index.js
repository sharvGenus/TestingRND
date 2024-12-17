import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useReports } from '../delivery-challan-report/useReport';
// import { approvalLevels, generateAreaLevelsValidation, hierarchyData } from '../validation-status-report';
import { generateAreaLevelsValidation, hierarchyData } from '../validation-status-report';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDateWiseProductivityReport, getDropdownProjects, getProjectAreaLevels, getWebformData } from 'store/actions';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import { useToastOnError } from 'hooks/useToastOnError';
import { useGaa } from 'pages/extra-pages/gaa/useGaa';
import { createFormsList, generateGaaApiParameter } from 'utils';

const formTypeMenus = [
  { id: '1d75feca-2e64-4b95-900d-fcd53446ddeb', name: 'Survey' },
  { id: '30ea8a65-ff5b-4bff-b1a1-892204e23669', name: 'Installation' },
  { id: '30ea8a65-ff5b-4bff-b1a1-892204e23669 - O&M', name: 'O&M' }
];

function DateWiseProductivityReport() {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [showTable, setShowTable] = useState(false);
  const [hierarchyType, setHierachyType] = useState(hierarchyData[0]?.id);
  // const [selectedApprovalLevels, setSelectedApprovalLevels] = useState(approvalLevels[0].value);

  const reportsResponseData = useReports();
  const [reportsData, reportsCount, reportsError, reportsLoading] = [
    reportsResponseData?.dateWiseProductivityReports?.dateWiseProductivityReportsObject?.rows,
    reportsResponseData?.dateWiseProductivityReports?.dateWiseProductivityReportsObject?.count,
    reportsResponseData?.dateWiseProductivityReports?.error,
    reportsResponseData?.dateWiseProductivityReports?.loading
  ];
  const gaaData = useGaa();
  const [areaLevelsData, areaLevelsAccessRank, areaLevelsLoading, areaLevelsError] = [
    gaaData?.projectAreaLevels?.projectAreaLevelsObject?.[0]?.gaaLevels,
    gaaData?.projectAreaLevels?.accessRank,
    gaaData?.projectAreaLevels?.loading,
    gaaData?.projectAreaLevels?.error
  ];

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        formTypeId: Validations.taskType,
        ...generateAreaLevelsValidation(areaLevelsData, areaLevelsAccessRank)
      })
    )
  });

  const { handleSubmit, watch, setValue } = methods;

  const dispatch = useDispatch();

  const [projectId, formTypeId, formId, dateFrom, dateTo] = watch(['projectId', 'formTypeId', 'formId', 'dateFrom', 'dateTo']);

  const projectsData = useProjects()?.projectsDropdown?.projectsDropdownObject;

  const { webforms } = useDefaultFormAttributes();
  const formsList = createFormsList(webforms);

  useToastOnError(reportsError);
  useToastOnError(areaLevelsError);

  const formType = formTypeMenus.find((menu) => menu.id === formTypeId)?.name || '';

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const generateApiPayload = useCallback(
    (formValues) => {
      const { errorFlag, newLevelFilter: gaaLevelDetails } = generateGaaApiParameter({
        areaLevelsData,
        values: formValues,
        methods,
        accessRank: areaLevelsAccessRank
      });

      if (errorFlag) return;

      return {
        projectId,
        formId,
        formType,
        pageSize,
        pageIndex,
        // approver: selectedApprovalLevels.toUpperCase(),
        gaaLevelDetails,
        dateFrom,
        dateTo
      };
    },
    [
      areaLevelsAccessRank,
      areaLevelsData,
      dateFrom,
      dateTo,
      formId,
      formType,
      methods,
      pageIndex,
      pageSize,
      projectId
      // selectedApprovalLevels
    ]
  );

  const onSubmit = useCallback(() => {
    dispatch(getDateWiseProductivityReport(generateApiPayload(watch())));
    setShowTable(true);
  }, [dispatch, generateApiPayload, watch]);

  useEffect(() => {
    if (!showTable) return;
    onSubmit();
    // dispatch(getDateWiseProductivityReport(generateApiPayload(watch())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTable, dispatch, generateApiPayload, watch, pageIndex, pageSize]);

  const columns = useMemo(
    () => [
      {
        Header: 'S. No.',
        accessor: (row, index) => (pageIndex - 1) * pageSize + index + 1
      },
      {
        Header: 'Project Name',
        accessor: 'Projects__name'
      },
      {
        Header: 'Project Code',
        accessor: 'Projects__code'
      },
      {
        Header: 'Task Type',
        accessor: 'Task Type'
      },
      {
        Header: `${formType} Date`,
        accessor: 'Installation Date'
      },
      {
        Header: 'Task Completed',
        accessor: 'Task Completed'
      },
      {
        Header: 'Manpower',
        accessor: 'Manpower'
      },
      {
        Header: 'Productivity',
        accessor: 'Productivity',
        Cell: ({ value }) => parseFloat(value).toFixed(2)
      }
    ],
    [formType, pageIndex, pageSize]
  );

  useEffect(() => {
    formId && hierarchyType && dispatch(getProjectAreaLevels({ formId }));
  }, [formId, dispatch, hierarchyType]);

  useEffect(() => {
    if (!projectId || !formTypeId) {
      return;
    }

    dispatch(getWebformData({ projectId, typeId: formTypeId.replace(' - O&M', ''), accessSource: 'Form Responses' }));
  }, [dispatch, formTypeId, projectId]);

  const filteredMenus = useCallback(
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

  return (
    <MainCard title="Date Wise Productivity Report" sx={{ mb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item md={3} xl={3}>
            <RHFSelectbox name="projectId" label="Project" menus={projectsData} required />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox name="formTypeId" label="Form Type" menus={formTypeMenus} required />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox name="formId" label="Type" menus={formsList || []} required />
          </Grid>
          {/* <Grid item md={3} xl={3}>
            <RHFRadio
              name="approvalLevels"
              title="Select Approval Levels"
              singleLineRadio={'true'}
              labels={approvalLevels}
              onChange={(e) => {
                setSelectedApprovalLevels(e?.target?.value);
              }}
              style={{
                '& label': { marginTop: '0', width: '33%' },
                marginTop: '10px !important',
                padding: '3px 0'
              }}
              required
              defaultValue={approvalLevels[0].value}
            />
          </Grid> */}
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="hierarchyType"
              label="Hierarchy Type"
              menus={hierarchyData}
              required={false}
              onChange={(e) => setHierachyType(e?.target?.value)}
              defaultValue={hierarchyData[0].id}
            />
          </Grid>
          {hierarchyType === 'gaa' &&
            formId &&
            areaLevelsData?.length > 0 &&
            areaLevelsData?.map((item, index) => {
              return (
                <Grid item md={3} xl={3} key={item.id}>
                  <RHFSelectTags
                    name={`gaaLevelEntryId${index}`}
                    label={item.name}
                    onChange={handleChangeDropDown.bind(null, index, areaLevelsData, watch(), true)}
                    menus={filteredMenus(item, index)}
                    disable={index !== 0 && !watch()?.[`gaaLevelEntryId${index - 1}`]?.length}
                    required={index !== 0 ? false : true}
                  />
                </Grid>
              );
            })}
          <Grid item md={3} xl={3}>
            <RHFTextField name="dateFrom" type="date" label="Date From" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFTextField name="dateTo" type="date" label="Date To" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button disabled={areaLevelsLoading} type="submit" size="small" variant="contained" color="primary">
              Proceed
            </Button>
          </Grid>
        </Grid>
      </FormProvider>

      {showTable && (
        <Box sx={{ mt: 2 }}>
          <TableForm
            hideColumnsSelect
            hideSearch
            hideAddButton
            loadingCondition={reportsLoading}
            title="Date Wise Productivity Report"
            data={reportsData || []}
            count={reportsCount || 0}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            columns={columns}
            hideActions
            exportConfig={{
              tableName: 'date_wise_productivity_report',
              apiQuery: generateApiPayload(watch())
            }}
          />
        </Box>
      )}
    </MainCard>
  );
}

export default DateWiseProductivityReport;
