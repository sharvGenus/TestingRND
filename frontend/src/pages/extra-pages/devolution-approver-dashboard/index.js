import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useDevolution } from '../devolution/useDevolution';
import { useOrganizations } from '../organization/useOrganizations';
import { useOrganizationStore } from '../organization-store/useOrganizationStore';
import DevolutionApprove from './devolution';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { FormProvider, RHFSelectbox } from 'hook-form';
import {
  getDevolutionList,
  getDropdownOrganization,
  getDropdownProjects,
  getFormData,
  getLovsForMasterName,
  getOrganizationStores
} from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';
import request from 'utils/request';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import usePrevious from 'hooks/usePrevious';
import useSearch from 'hooks/useSearch';
import FilesDisplayModal from 'components/modal/FilesDisplayModal';
import { hasChanged } from 'utils';

const hierarchyData = [
  {
    id: 'gaa',
    name: 'GAA'
  }
];

const Actions = ({ value, onView }) => {
  return (
    <div>
      <Tooltip title="View" placement="bottom">
        <IconButton color="secondary" onClick={() => onView(value)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  value: PropTypes.any,
  onView: PropTypes.func
};

const DevolutionApproverDashboard = () => {
  const [sort, setSort] = useState(null);
  const prevSort = usePrevious(sort);
  const [customerStoreData, setCustomerStoreData] = useState([]);

  const { fileFields } = useMemo(
    () => ({
      fileFields: [
        {
          name: 'attachments',
          label: 'Attachments',
          accept: '*',
          required: true,
          multiple: true
        }
      ]
    }),
    []
  );

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    refreshPagination,
    setPageSize
  } = usePagination();
  const { searchString, setSearchString, accessorsRef, setAccessors, searchStringTrimmed } = useSearch();

  const { devolutionList } = useDevolution();

  const onOpenViewSection = useCallback((val) => {
    setViewVal(val);
    setOpenViewSection(true);
  }, []);

  const getStatus = (approvalStatus) => {
    switch (approvalStatus) {
      case '2':
        return 'Pending';
      case '1':
        return 'Approved';
      case '0':
        return 'Rejected';
      default:
        return null;
    }
  };

  const { respData, count } = useMemo(
    () => ({
      respData: devolutionList?.stocksObject?.rows || [],
      count: devolutionList?.stocksObject?.count || 0
    }),
    [devolutionList]
  );

  const [showTable, setShowTable] = useState(false);
  const [lastArgs, setLastArgs] = useState(null);
  const [areaLevelsData, setAreaLevelsData] = useState(null);
  const [hierarchyType, setHierachyType] = useState(hierarchyData[0]?.id);
  const [loading, setLoading] = useState(false);
  const [accessRank, setAccessRank] = useState(-1);
  const [openViewSection, setOpenViewSection] = useState(false);
  const [viewVal, setViewVal] = useState(null);
  const [customerAddress, setCustomerAddress] = useState('');

  const validationSchema = Yup.object().shape({
    projectId: Validations.other,
    formTypeId: Validations.formType,
    formId: Validations.form,
    ...(areaLevelsData && {
      hierarchyType: Validations.required
    })
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      gaaLevelEntryId0: []
    },
    mode: 'all'
  });

  const { handleSubmit, watch, setValue } = methods;
  const [projectId, formTypeId, formId, customerId, customerStoreId] = watch([
    'projectId',
    'formTypeId',
    'formId',
    'customerId',
    'customerStoreId'
  ]);

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject;

  const { organizationsDropdown } = useOrganizations();
  const { organizationStores } = useOrganizationStore();
  const customerData = organizationsDropdown?.organizationDropdownObject || [];
  const customerStores = organizationStores?.organizationStoreObject?.rows || [];

  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const { forms } = useDefaultFormAttributes();
  const formsList = forms?.formDataObject?.rows || [];

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values) => {
      let newLevelFilter = {};
      let errorFlag = false;
      if (areaLevelsData) {
        for (let i = areaLevelsData?.length - 1; i >= 0; i--) {
          if (values[`gaaLevelEntryId${i}`]?.length > 0) {
            newLevelFilter[`${areaLevelsData[i].columnName}`] = values[`gaaLevelEntryId${i}`];
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
      const payLoad = {
        customerId,
        customerStoreId,
        projectId,
        formId,
        approvalStatus: '2',
        gaaHierarchy: newLevelFilter,
        pageSize,
        pageIndex
      };

      if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
      setLastArgs(payLoad);
      if ([[prevSort, sort]].some(hasChanged)) {
        refreshPagination();
        return;
      }
      dispatch(
        getDevolutionList({
          ...payLoad,
          ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
        })
      );
    },
    [
      areaLevelsData,
      projectId,
      customerId,
      customerStoreId,
      accessorsRef,
      dispatch,
      sort,
      searchStringTrimmed,
      prevSort,
      refreshPagination,
      formId,
      pageSize,
      pageIndex,
      lastArgs,
      methods,
      accessRank
    ]
  );

  const devolutionReload = () => {
    dispatch(
      getDevolutionList({
        ...lastArgs,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
      })
    );
  };

  useEffect(() => {
    if (lastArgs?.pageSize !== pageSize || lastArgs?.pageIndex !== pageIndex)
      setLastArgs({
        ...lastArgs,
        pageSize,
        pageIndex
      });
  }, [lastArgs, pageSize, pageIndex]);

  useEffect(() => {
    dispatch(
      getDevolutionList({
        ...lastArgs,
        ...(searchStringTrimmed && { searchString: searchStringTrimmed, accessors: JSON.stringify(accessorsRef.current) })
      })
    );
  }, [searchStringTrimmed, accessorsRef, dispatch, lastArgs]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(getDropdownOrganization('e9206924-c5cb-454e-af1e-124d8179299a')); //customer
    dispatch(getOrganizationStores({ organizationType: 'e9206924-c5cb-454e-af1e-124d8179299a' }));
  }, [dispatch]);

  useEffect(() => {
    if (!projectId || !formTypeId) {
      return;
    }
    dispatch(getFormData({ projectId, typeId: formTypeId }));
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
    },
    [setValue]
  );

  const Headers = [
    {
      Header: 'Actions',
      accessor: 'action',
      disableSortBy: true
    },
    {
      Header: 'Devolution Number',
      accessor: 'devolutionDocNo',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'devolutions',
      //   getColumn: 'devolution_doc_no',
      //   customAccessor: 'devolutionDocNo'
      // }
    },
    {
      Header: 'Project',
      accessor: 'project.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'projects',
      //   getColumn: 'name',
      //   customAccessor: 'projectId'
      // }
    },
    {
      Header: 'Form',
      accessor: 'form.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'forms',
      //   getColumn: 'name',
      //   customAccessor: 'formId'
      // }
    },
    {
      Header: 'Customer',
      accessor: 'organization.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'organizations',
      //   getColumn: 'name',
      //   customAccessor: 'customerId'
      // }
    },
    {
      Header: 'Customer Store',
      accessor: 'organization_store.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'organization_stores',
      //   getColumn: 'name',
      //   customAccessor: 'customerStoreId'
      // }
    },
    {
      Header: 'Status',
      accessor: 'status',
      exportAccessor: 'approvalStatus',
      disableSortBy: true
    },
    {
      Header: 'Files',
      accessor: 'files',
      disableSortBy: true
    },
    {
      Header: 'Created By',
      accessor: 'created.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'devolutions',
      //   getColumn: 'created_by',
      //   customAccessor: 'createdBy'
      // }
    },
    {
      Header: 'Created On',
      accessor: 'createdAt',
      disableSortBy: true
    },
    {
      Header: 'Updated By',
      accessor: 'updated.name',
      disableSortBy: true
      // filterProps: {
      //   tableName: 'devolutions',
      //   getColumn: 'updated_by',
      //   customAccessor: 'updatedBy'
      // }
    },
    {
      Header: 'Updated On',
      accessor: 'updatedAt',
      disableSortBy: true
    }
  ];

  const addAction = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((item) => {
        newArr.push({
          ...item,
          status: getStatus(item?.approvalStatus),
          files: item?.attachments?.length ? (
            <FilesDisplayModal view fileFields={fileFields} tasks={[]} data={{ attachments: item.attachments }} />
          ) : null,
          action: <Actions value={item} onView={onOpenViewSection} />
        });
      });
    return newArr;
  };

  const onStoreSelected = (e) => {
    const respSData = e?.target?.row;
    const cityDetails = respSData?.cities ? respSData?.cities : respSData?.city;
    const addressdata = respSData?.registeredOfficeAddress ? respSData?.registeredOfficeAddress : respSData?.address;
    const pincode = respSData?.registeredOfficePincode ? respSData?.registeredOfficePincode : respSData?.pinCode;
    setCustomerAddress(
      `${addressdata}, ${cityDetails?.name}, ${cityDetails?.state?.name}, ${cityDetails?.state?.country?.name} ${
        pincode ? ',' + pincode : ''
      }`
    );
  };

  return (
    <MainCard title="Devolution Approver Dashboard">
      {openViewSection ? (
        <DevolutionApprove
          data={viewVal}
          onGoBack={(v) => {
            setOpenViewSection(v);
            devolutionReload();
          }}
        />
      ) : (
        <>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                  }}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox name="formTypeId" label="Form Type" menus={formTypeData} required onChange={() => setValue('formId', '')} />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox name="formId" label="Form Name" menus={formsList || []} required />
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
                      <RHFSelectbox
                        required={index === 0 || item.rank <= accessRank}
                        showHelperText={false}
                        name={`gaaLevelEntryId${index}`}
                        label={item.name}
                        onChange={handleChangeDropDown.bind(null, index, areaLevelsData, watch(), true)}
                        menus={filteredMenus(item, index)}
                        disable={index !== 0 && item.rank > accessRank && !watch()?.[`gaaLevelEntryId${index - 1}`]?.length}
                        allowClear
                      />
                    </Grid>
                  );
                })}
              <Grid item md={3} xl={3}>
                <RHFSelectbox
                  name="customerId"
                  label="Customer"
                  menus={customerData}
                  onChange={(e) => {
                    let selectedStores = customerStores.filter((v) => v.organizationId === e?.target?.value);
                    setCustomerStoreData(selectedStores);
                  }}
                />
              </Grid>
              <Grid item md={3} xl={3}>
                <RHFSelectbox name="customerStoreId" label="Customer Store" menus={customerStoreData} onChange={onStoreSelected} />
              </Grid>
              {customerAddress !== '' && (
                <Grid item md={6} xl={6}>
                  <Typography>Customer Store Address: </Typography>
                  <Typography mt={2}>{customerAddress}</Typography>
                </Grid>
              )}
              {!openViewSection && (
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button disabled={loading} type="submit" size="small" variant="contained" color="primary">
                    Proceed
                  </Button>
                </Grid>
              )}
            </Grid>
          </FormProvider>
          {showTable && respData && respData.length >= 0 && (
            <TableForm
              title=""
              hideSearch
              hideColumnsSelect
              hideExportButton
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              columns={Headers}
              data={addAction(respData)}
              count={count}
              hideAddButton
              hideActions
              searchConfig={{ searchString, searchStringTrimmed, setSearchString, setAccessors }}
              sortConfig={{ sort, setSort }}
              exportConfig={{
                tableName: 'devolutions',
                fileName: 'devolutions',
                apiQuery: { listType: 1 }
              }}
            />
          )}
        </>
      )}
    </MainCard>
  );
};

export default DevolutionApproverDashboard;
