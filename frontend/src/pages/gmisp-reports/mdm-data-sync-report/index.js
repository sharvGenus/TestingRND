import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { useReports } from '../delivery-challan-report/useReport';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { getDropdownProjects, getLovsForMasterName, getMdmDataSyncReport, getMdmPayLoadStatus, getWebformData } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { startLoading, stopLoading } from 'store/reducers/loadingSlice';

const info = 'form-responses';

const ignoredColumnTypesForFilter = ['ocr', 'blob', 'network', 'location', 'date', 'file', 'image'];
const ignoredColumnTypesForSort = ['ocr', 'blob', 'file', 'image'];

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

function MdmDataSyncReport() {
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
  const [isLoading, setIsLoading] = useState();
  const [reportsData, setReportsData] = useState([]);

  const validationSchema = Yup.object().shape({
    projectId: Validations.other,
    formTypeId: Validations.formType,
    formId: Validations.form,
    mdmPayloadStatusId: Validations.other,
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
  const [projectId, formTypeId, formId, mdmPayloadStatusId, dateFrom, dateTo] = watch([
    'projectId',
    'formTypeId',
    'formId',
    'mdmPayloadStatusId',
    'dateFrom',
    'dateTo'
  ]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const reports = useReports();
  const reportsColumns = reports?.mdmDataSyncReport?.mdmDataSyncReportObject?.columns || [];
  const reportsLoading = reports?.mdmDataSyncReport?.loading;
  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const mdmPayloadStatusMenu = reports?.mdmPayloadStatus.mdmPayloadStatusObject || [];
  const { webforms } = useDefaultFormAttributes();

  const formType = formTypeData.find((menu) => menu.id === formTypeId)?.name || '';
  const mdmPayloadStatus = mdmPayloadStatusMenu?.find((menu) => menu.id === mdmPayloadStatusId)?.name || '';

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

  const formsList =
    webforms?.webformDataObject?.rows
      ?.filter((values) => values.isPublished && values.form_attributes instanceof Array)
      .map((element) => ({
        id: element.id,
        name: element.name,
        tableName: element.tableName
      })) || [];

  const dispatch = useDispatch();

  useEffect(() => {
    if (formId) {
      dispatch(getMdmPayLoadStatus({ formId }));
    }
  }, [formId, dispatch]);

  const onSubmit = useCallback(
    (values) => {
      setIsLoading(true);
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
      if (errorFlag) {
        setIsLoading(false);
        return;
      }
      setGaaLevelFilter(newLevelFilter);
      const payLoad = {
        projectId,
        formId,
        formType,
        pageSize,
        pageIndex,
        mdmPayloadStatus,
        gaaLevelDetails: newLevelFilter,
        dateFrom: dateFrom,
        dateTo: dateTo,
        setIsLoading,
        setReportsData
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) {
        setIsLoading(false);
        return;
      }
      setLastArgs(payLoad);

      dispatch(getMdmDataSyncReport(payLoad));
    },
    [
      areaLevelsData,
      projectId,
      formId,
      formType,
      pageSize,
      pageIndex,
      mdmPayloadStatus,
      dateFrom,
      dateTo,
      lastArgs,
      dispatch,
      methods,
      accessRank
    ]
  );

  useEffect(() => {
    if (!projectId || !formTypeId || !formId || !mdmPayloadStatusId || !showTable) return;
    const values = getValues();
    onSubmit(values);
  }, [formId, formTypeId, getValues, mdmPayloadStatusId, onSubmit, projectId, showTable]);

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

  const filteredMenus = useCallback(
    (gaa, index) => {
      const prev = index - 1;
      return watch()?.[`gaaLevelEntryId${prev}`]
        ? gaa.gaa_level_entries.filter((x) => watch()?.[`gaaLevelEntryId${prev}`]?.includes(x?.parentId))
        : gaa.gaa_level_entries;
    },
    [watch]
  );

  useEffect(() => {
    if (!info) return;
    if (isLoading) dispatch(startLoading());
    else dispatch(stopLoading());
  }, [dispatch, isLoading, reportsData, reportsLoading]);

  const updateColumnUtil = (columnArr = []) =>
    columnArr
      .filter(({ type }) => !['image', 'file', 'blob'].includes(type))
      .map((item) => {
        let column = structuredClone(item);

        const isSupportedDateColumnForFilter =
          column.type === 'date' && (column?.properties?.pickerType === 'dateOnly' || column?.properties?.pickerType === 'dateTimeBoth');

        if (!info) {
          if (!ignoredColumnTypesForFilter.includes(column.type) || isSupportedDateColumnForFilter) {
            column = {
              ...column,
              filterProps: {
                formId: formId,
                apiRouteForFetchOptions: '/form-get-distinct-column',
                tableName: item.Header,
                customAccessor: item.column,
                isDateTypeColumn: isSupportedDateColumnForFilter
              }
            };
          }

          if (ignoredColumnTypesForSort.includes(column.type)) {
            column = { ...column, disableSortBy: true };
          }
        } else {
          column = { ...column, disableSortBy: true };
        }
        if (column.type === 'checkbox') {
          return {
            ...column,
            accessor: (list) => list?.[column.accessor]
          };
        } else if (column.type === 'network') {
          return {
            ...column,
            minWidth: 550,
            Cell: (list) => {
              const cellContent = list?.row?.original?.[column.accessor];
              if (cellContent) {
                const formattedContent = cellContent.replace(/;/g, '<br />').replaceAll(',', ', ').replaceAll(':', ': ');
                return <Typography dangerouslySetInnerHTML={{ __html: formattedContent }} />;
              }
              return <></>;
            }
          };
        } else if (column.type === 'location') {
          return {
            ...column,
            accessor: (list) => list?.[column.accessor]?.replaceAll(',', ', '),
            Cell: (list) => {
              const cellContent = list?.row?.original?.[column.accessor];
              if (cellContent) {
                const parts = cellContent.split(',');
                const lat = parts[0]?.trim();
                const lon = parts[1]?.trim();
                const accuracy = parts[2]?.trim();
                return (
                  <>
                    <div style={{ minWidth: 200 }}>{`${lat}, ${lon}`}</div>
                    <div>{accuracy}</div>
                    <Button
                      onClick={() => {
                        window.open(`https://maps.google.com?q=${lat},${lon}`);
                      }}
                      size="small"
                      variant="outlined"
                      color="primary"
                    >
                      View
                    </Button>
                  </>
                );
              }
              return <></>;
            }
          };
        }
        return column;
      });

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
    <MainCard title="MDM Data Sync Report">
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
              menus={formTypeData}
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
                setReportsData([]);
                setShowTable(false);
              }}
            />
          </Grid>
          <Grid item xs={3} md={3}>
            <RHFSelectbox
              name="mdmPayloadStatusId"
              label="MDM Payload Status"
              menus={mdmPayloadStatusMenu || []}
              required
              onChange={() => {
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
        <>
          <TableForm
            hideColumnsSelect
            hideSearch
            hideAddButton
            loadingCondition={reportsLoading}
            title="MDM Data Sync Report"
            data={reportsData || []}
            count={reportsData?.length || 0}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            normalDate
            columns={updateColumnUtil(reportsColumns)}
            hideActions
            exportConfig={{
              tableName: 'form-responses',
              apiBody: {
                gaaLevelFilter,
                projectId,
                formId,
                formType,
                pageSize,
                pageIndex,
                mdmPayloadStatus,
                dateFrom: dateFrom,
                dateTo: dateTo,
                isExport: true
              },
              apiRoute: '/form-export-form-responses'
            }}
          />
        </>
      )}
    </MainCard>
  );
}

export default MdmDataSyncReport;
