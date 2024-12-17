import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import { useReports } from '../delivery-challan-report/useReport';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { getAreaWiseProductivityReport, getDropdownProjects, getLovsForMasterName, getWebformData } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { createFormsList } from 'utils';

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

function AreaWiseProductivityReport() {
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
    formTypeId: Validations.formType,
    formId: Validations.form,
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
  const [projectId, formTypeId, formId, dateFrom, dateTo] = watch(['projectId', 'formTypeId', 'formId', 'dateFrom', 'dateTo']);

  const { masterMakerOrgType } = useMasterMakerLov();
  const dispatch = useDispatch();
  const { webforms } = useDefaultFormAttributes();

  const formTypeData = masterMakerOrgType?.masterObject;

  const formsList = createFormsList(webforms);

  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const reportsLoading = useReports()?.areaWiseProductivityReports?.loading;

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!projectId || !formTypeId) {
      return;
    }

    dispatch(getWebformData({ projectId, typeId: formTypeId.replace(' - O&M', ''), accessSource: 'Form Responses' }));
  }, [dispatch, formTypeId, projectId]);

  const getProjectAreaLevels = useCallback(async () => {
    setLoading(true);
    const response = await request('/area-project-level', { method: 'GET', params: formId, query: { formId, sort: ['rank', 'ASC'] } });
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
  }, [formId]);

  useEffect(() => {
    formId && getProjectAreaLevels();
  }, [formId, getProjectAreaLevels]);

  const columns = useMemo(
    () => [
      { Header: 'Project', accessor: 'project', exportAccessor: 'project' },
      { Header: 'Form Type', accessor: 'formType', exportAccessor: 'formType' },
      { Header: 'Form Name', accessor: 'form', exportAccessor: 'form' },
      ...(areaLevelsData?.map((data) => ({ Header: data.name, accessor: data.columnName, exportAccessor: data.columnName })) || []),
      { Header: 'Survey Total', accessor: 'total', exportAccessor: 'total' },
      { Header: 'Survey Manpower', accessor: 'man_power', exportAccessor: 'man_power' },
      { Header: 'Survey Average Productivity', accessor: 'avg_productivity', exportAccessor: 'avg_productivity' },
      { Header: 'Survey Max Productivity', accessor: 'max_productivity', exportAccessor: 'max_productivity' },
      { Header: 'Survey Min Productivity', accessor: 'min_productivity', exportAccessor: 'min_productivity' }
    ],
    [areaLevelsData]
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
      const [columnName] = Object.keys(newLevelFilter);
      const columnValue = newLevelFilter[columnName];
      const lastLevelColumn = areaLevelsData?.[areaLevelsData.length - 1]?.columnName;
      const allLevelNames = areaLevelsData?.map((level) => level.columnName)?.filter((name) => name !== columnName);

      const gaaHierarchy = {
        columnName,
        columnValue,
        lastLevelColumn,
        allLevelNames
      };

      setGaaLevelFilter(gaaHierarchy);

      const payLoad = {
        projectId,
        formId,
        formType: formTypeId,
        gaaHierarchy: gaaHierarchy,
        pageSize,
        pageIndex,
        dateFrom: dateFrom,
        dateTo: dateTo,
        setReportsData,
        setCount
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
      setLastArgs(payLoad);

      dispatch(getAreaWiseProductivityReport(payLoad));
    },
    [areaLevelsData, projectId, formId, formTypeId, pageSize, pageIndex, dateFrom, dateTo, lastArgs, dispatch, methods, accessRank]
  );

  useEffect(() => {
    if (!projectId || !formTypeId || !formId || !showTable) return;
    const values = getValues();
    onSubmit(values);
  }, [formId, formTypeId, getValues, onSubmit, projectId, showTable]);

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
    },
    [setValue]
  );

  return (
    <MainCard title="Area Wise Productivity Report">
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
                setValue('formTypeId', '');
                setValue('formId', '');
                setReportsData([]);
                setShowTable(false);
              }}
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="formTypeId"
              label="Form Type"
              menus={formTypeData?.filter((item) => item.name === 'Survey')}
              required
              onChange={() => {
                setValue('formId', '');
                setReportsData([]);
                setShowTable(false);
              }}
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFSelectbox
              name="formId"
              label="Type"
              menus={formsList || []}
              required
              onChange={() => {
                setValue('gaaHierarchyId', '');
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
            formId &&
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
          loadingCondition={reportsLoading}
          title="Area Wise Productivity Report"
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
            tableName: 'area_wise_productivity_report',
            apiQuery: {
              formId,
              gaaHierarchy: gaaLevelFilter,
              dateFrom,
              dateTo,
              formType: formTypeId
            }
          }}
        />
      )}
    </MainCard>
  );
}

export default AreaWiseProductivityReport;
