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
import { FormProvider, RHFRadio, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import { getDropdownProjects, getLovsForMasterName, getValidationStatusReport, getWebformData } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import { createFormsList } from 'utils';
import request from 'utils/request';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';

export const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

export const approvalLevels = [
  { name: 'L1', value: 'l1' },
  { name: 'L2', value: 'l2' }
];

export const generateAreaLevelsValidation = (areaLevelsData, accessRank) => {
  return Array.from({ length: 10 }).reduce((schema, _, i) => {
    schema[`gaaLevelEntryId${i}`] = Yup.array().test('required-test', 'This field is required', (value, context) => {
      const isRequired = context.path.includes(`gaaLevelEntryId${0}`) || areaLevelsData?.[i]?.rank <= accessRank;
      return !isRequired || (value && value.length > 0);
    });
    return schema;
  }, {});
};

export const createClearFieldSubscription = ({ watch, allFields, setShowTable, resetField }) => {
  return watch((value, { name, type }) => {
    if (type !== 'change') return;

    let wasTableClosed = false;
    allFields.slice(1 + allFields.indexOf(name)).forEach((field) => {
      if (typeof setShowTable === 'function' && !wasTableClosed) {
        setShowTable(false);
        wasTableClosed = true;
      }
      resetField(field);
    });
  });
};

function ValidationStatusReport() {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [selectedApprovalLevels, setSelectedApprovalLevels] = useState(approvalLevels[0]?.value);
  const [hierarchyType, setHierachyType] = useState(hierarchyData[0]?.id);
  const [gaaLevelDetails, setGaaLevelDetails] = useState();
  const [reportsData, setReportData] = useState([]);
  const [lastArgs, setLastArgs] = useState(null);
  const [count, setCount] = useState(0);
  const [accessRank, setAccessRank] = useState(-1);
  const [areaLevelsData, setAreaLevelsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        formTypeId: Validations.formType,
        formId: Validations.form,
        ...generateAreaLevelsValidation(areaLevelsData, accessRank)
      })
    )
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
  const formTypeData = masterMakerOrgType?.masterObject;

  const formType = formTypeData.find((menu) => menu.id === formTypeId)?.name || '';
  const { webforms } = useDefaultFormAttributes();

  const columns = useMemo(
    () => [
      { Header: 'Customer', accessor: 'Customer' },
      { Header: 'Project', accessor: 'Project' },
      { Header: 'Date', accessor: 'Date' },
      { Header: `Type Of ${formType}`, accessor: 'Type of Survey' },
      { Header: `${formType} Completed`, accessor: 'Survey Completed' },
      {
        Header: `${selectedApprovalLevels.toUpperCase()} Level - Approved`,
        accessor: `${selectedApprovalLevels.toUpperCase()} Level - Approved`
      },
      {
        Header: `${selectedApprovalLevels.toUpperCase()} Level - Rejected`,
        accessor: `${selectedApprovalLevels.toUpperCase()} Level - Rejected`
      },
      {
        Header: `${selectedApprovalLevels.toUpperCase()} Level - On-Hold`,
        accessor: `${selectedApprovalLevels.toUpperCase()} Level - On-Hold`
      }
    ],
    [formType, selectedApprovalLevels]
  );

  const formsList = createFormsList(webforms);
  const onSubmit = useCallback(
    (values) => {
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
      setShowTable(true);
      setGaaLevelDetails(newLevelFilter);
      const payLoad = {
        projectId,
        formId,
        formType,
        pageSize,
        pageIndex,
        approver: selectedApprovalLevels?.toUpperCase(),
        gaaLevelDetails: newLevelFilter,
        dateFrom: dateFrom,
        dateTo: dateTo,
        setReportData,
        setCount
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
      setLastArgs(payLoad);

      dispatch(getValidationStatusReport(payLoad));
    },
    [
      areaLevelsData,
      projectId,
      formId,
      formType,
      pageSize,
      pageIndex,
      selectedApprovalLevels,
      dateFrom,
      dateTo,
      lastArgs,
      dispatch,
      methods,
      accessRank
    ]
  );

  useEffect(() => {
    if (!projectId || !formTypeId || !formId || !showTable) return;
    const values = getValues();
    onSubmit(values);
  }, [formId, formTypeId, getValues, onSubmit, projectId, showTable]);

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
      setReportData([]);
      setShowTable(false);
    },
    [setValue]
  );

  return (
    <MainCard title="Validation Status Report">
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
                setReportData([]);
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
                setReportData([]);
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
                setReportData([]);
                setShowTable(false);
              }}
            />
          </Grid>
          <Grid item xs={3} md={3}>
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
            <RHFTextField
              name="dateFrom"
              disabled={false}
              type="date"
              label="Date From"
              InputLabelProps={{ shrink: true }}
              required={true}
            />
          </Grid>
          <Grid item md={3} xl={3}>
            <RHFTextField name="dateTo" disabled={false} type="date" label="Date To" InputLabelProps={{ shrink: true }} required={true} />
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
          title="Validation Status Report"
          data={reportsData}
          count={count}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          columns={columns}
          hideActions
          exportConfig={{
            tableName: 'validation_status_report',
            apiQuery: {
              projectId,
              formId,
              formType,
              pageSize,
              pageIndex,
              approver: selectedApprovalLevels.toUpperCase(),
              gaaLevelDetails,
              dateFrom,
              dateTo
            }
          }}
        />
      )}
    </MainCard>
  );
}

export default ValidationStatusReport;
