import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { getDropdownProjects, getLovsForMasterName, getProductivitySummaryReport } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import request from 'utils/request';

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

function ProductivitySummaryReport() {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [showTable, setShowTable] = useState(false);
  const [lastArgs, setLastArgs] = useState(null);
  const [areaLevelsData, setAreaLevelsData] = useState(null);
  const [hierarchyType, setHierachyType] = useState(hierarchyData[0]?.id);
  const [loading, setLoading] = useState(false);
  const [gaaLevelFilter, setGaaLevelFilter] = useState(null);
  const [accessRank, setAccessRank] = useState(-1);
  const [reportsData, setReportsData] = useState([]);
  const [count, setCount] = useState(0);

  const validationSchema = Yup.object().shape({
    projectId: Validations.other,
    ...Array.from({ length: 10 }).reduce((schema, _, i) => {
      schema[`gaaLevelEntryId${i}`] = Yup.array().test('required-test', 'This field is required', (value, context) => {
        const isRequired = context.path.includes(`gaaLevelEntryId${0}`) || areaLevelsData?.[i]?.rank <= accessRank;
        return !isRequired || (value && value.length > 0);
      });
      return schema;
    }, {})
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });

  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = methods;
  const [projectId, dateFrom, dateTo] = watch(['projectId', 'dateFrom', 'dateTo']);

  const dispatch = useDispatch();

  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch, projectId]);

  const getProjectAreaLevels = useCallback(async () => {
    setLoading(true);
    const response = await request('/area-project-level', {
      method: 'GET',
      params: projectId,
      query: { projectId, isAccessForAllResponses: 1, sort: ['rank', 'ASC'] }
    });
    if (response.success) {
      const { data, accessRank: accessRankData } = response.data;
      setAccessRank(accessRankData);
      if (data) {
        setAreaLevelsData(data[0]?.gaaLevels);
      } else {
        setAreaLevelsData(null);
      }
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    projectId && getProjectAreaLevels();
  }, [projectId, getProjectAreaLevels]);

  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'created_date', exportAccessor: 'created_date' },
      { Header: 'Survey Tasks', accessor: 'survey_total', exportAccessor: 'survey_total' },
      { Header: 'No. of Surveyors', accessor: 'survey_user_count', exportAccessor: 'survey_user_count' },
      { Header: 'MI Tasks', accessor: 'installation_total', exportAccessor: 'installation_total' },
      { Header: 'No. of Installers', accessor: 'installation_user_count', exportAccessor: 'installation_user_count' },
      { Header: 'O&M Tasks', accessor: 'oanddump_total', exportAccessor: 'oanddump_total' },
      { Header: 'No. of O&M Engineers', accessor: 'oanddump_user_count', exportAccessor: 'oanddump_user_count' }
    ],
    []
  );

  const txtBox = (name, label, type, defaultValue, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        disabled={false}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const onSubmit = useCallback(
    (values) => {
      values = structuredClone(values);
      let newLevelFilter = {};
      let errorFlag = false;
      if (areaLevelsData) {
        for (let i = areaLevelsData?.length - 1; i >= 0; i--) {
          if (values[`gaaLevelEntryId${i}`]?.length) {
            newLevelFilter[`${areaLevelsData[i].columnName}`] = values[`gaaLevelEntryId${i}`];
            break;
          }
        }
        if (!values['gaaLevelEntryId0']?.length) {
          methods.setError('gaaLevelEntryId0', { message: 'This field is required' }, { shouldFocus: true });
          errorFlag = true;
        }
        for (let i = 1; i < areaLevelsData.length; i++) {
          const { rank } = areaLevelsData[i];
          if (rank <= accessRank && !values[`gaaLevelEntryId${i}`]?.length) {
            methods.setError(`gaaLevelEntryId${i}`, { message: 'This field is required' }, { shouldFocus: true });
            errorFlag = true;
          }
        }
      }
      if (errorFlag) return;
      const [gaaColumnName] = Object.keys(newLevelFilter);
      const gaaColumnValue = newLevelFilter[gaaColumnName];

      const gaaHierarchy = {
        gaaColumnName,
        gaaColumnValue
      };

      setGaaLevelFilter(gaaHierarchy);

      const payLoad = {
        projectId,
        gaaHierarchyDetails: gaaHierarchy,
        dateFrom: dateFrom,
        dateTo: dateTo,
        pageSize,
        pageIndex,
        setReportsData,
        setCount
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
      setLastArgs(payLoad);

      dispatch(getProductivitySummaryReport(payLoad));
    },
    [areaLevelsData, projectId, pageSize, pageIndex, dateFrom, dateTo, lastArgs, dispatch, methods, accessRank]
  );

  useEffect(() => {
    if (!projectId || !showTable) return;
    const values = getValues();
    onSubmit(values);
  }, [getValues, onSubmit, projectId, showTable]);

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
            ? nextGaa?.gaa_level_entries?.filter((x) => currentValues?.[curKey] === x?.parentId)
            : nextGaa?.gaa_level_entries || [];
        const nextValue =
          (Array.isArray(currentValues[nextKey]) && currentValues[nextKey]?.filter((x) => nextMenus.some((y) => y.id === x))) || [];
        setValue(nextKey, nextValue);
        currentValues[nextKey] = nextValue;
        i += 1;
      }
      setReportsData([]);
      setShowTable(false);
    },
    [setValue]
  );

  return (
    <MainCard title="Productivity Summary Report">
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(() => {
          setShowTable(true);
        })}
      >
        <Grid container spacing={4} mb={3}>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="projectId"
              label="Project"
              menus={projectOptions || []}
              required
              onChange={() => {
                setValue('gaaLevelEntryId0', []);
                setValue('gaaLevelEntryId1', []);
                setValue('gaaLevelEntryId2', []);
                setValue('gaaLevelEntryId3', []);
                setValue('gaaLevelEntryId4', []);
                setReportsData([]);
                setShowTable(false);
              }}
            />
          </Grid>
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
            projectId &&
            areaLevelsData?.length > 0 &&
            areaLevelsData?.map((item, index) => {
              return (
                <Grid item md={3} xl={3} key={item.id}>
                  <RHFSelectTags
                    required={index === 0 || item.rank <= accessRank}
                    name={`gaaLevelEntryId${index}`}
                    label={item.name}
                    onChange={handleChangeDropDown.bind(null, index, areaLevelsData, watch(), true)}
                    menus={filteredMenus(item, index)}
                    disable={index !== 0 && item.rank > accessRank && !watch()?.[`gaaLevelEntryId${index - 1}`]?.length}
                    errorMessage={errors[`gaaLevelEntryId${index}`]?.message}
                  />
                </Grid>
              );
            })}
          <Grid item md={3} xl={3}>
            {txtBox('dateFrom', 'Date From', 'date')}
          </Grid>
          <Grid item md={3} xl={3}>
            {txtBox('dateTo', 'Date To', 'date')}
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button disabled={loading} type="submit" size="small" variant="contained" color="primary">
              Proceed
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
      {showTable && (
        <TableForm
          hideColumnsSelect
          hideSearch
          hideAddButton
          loadingCondition={reportsData?.length === 0}
          title="Productivity Summary Report"
          data={reportsData}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          columns={columns}
          hideActions
          sortConfig={{ sort: ['createdAt', 'DESC'] }}
          exportConfig={{
            tableName: 'productivity_summary_report',
            apiBody: {
              tableName: 'productivity_summary_report',
              projectId: projectId,
              gaaHierarchyDetails: gaaLevelFilter,
              dateFrom,
              dateTo,
              requiredObject: Object.fromEntries(
                columns.map((column) => {
                  return [column.exportAccessor ? column.exportAccessor : column.accessor, column.exportAccessor];
                })
              )
            },
            apiQuery: {
              pagination: false,
              pageSize,
              pageIndex
            }
          }}
        />
      )}
    </MainCard>
  );
}

export default ProductivitySummaryReport;
