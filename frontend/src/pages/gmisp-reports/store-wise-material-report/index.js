import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProjects } from '../../extra-pages/project/useProjects';
import { useOrganizationStore } from '../../extra-pages/organization-store/useOrganizationStore';
import { useReports } from '../useReports';
import { FormProvider, RHFMultipleSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDropdownProjects, getMaterialTypesForReport, getDropdownOrganizationStores, getStoreWiseMaterialReport } from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import SavePdf from 'components/SavePdf';

const StoreWiseMaterialReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [storeIds, setStoreIds] = useState(null);
  const [allStoreIds, setAllStoreIds] = useState(null);

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.projectArr
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const { projectsDropdown } = useProjects();
  const { organizationStoresDropdown } = useOrganizationStore();

  const projectData = projectsDropdown?.projectsDropdownObject;
  // const storeData = organizationStoresDropdown?.organizationStoreDropdownObject?.rows || [];
  const { storeData } = useMemo(
    () => ({
      storeData: organizationStoresDropdown?.organizationStoreDropdownObject?.rows || []
    }),
    [organizationStoresDropdown]
  );

  const { storeWiseMaterialReport, materialTypeForReport } = useReports();
  const { data } = useMemo(
    () => ({
      data: storeWiseMaterialReport.storeWiseMaterial || [],
      isLoading: storeWiseMaterialReport.loading || false
    }),
    [storeWiseMaterialReport]
  );

  const [materialTypeData, setMaterialTypeData] = useState([]);
  const { materialTypeAllData } = useMemo(
    () => ({
      materialTypeAllData: materialTypeForReport.materialTypeArr || [],
      isLoading: materialTypeForReport.loading || false
    }),
    [materialTypeForReport]
  );

  const getIds = (arr) => {
    const ids = [];
    arr && arr.length && arr.map((vl) => ids.push(vl.id));
    return ids;
  };

  useEffect(() => {
    const ids = [];
    storeData.map((vl) => ids.push(vl.id));
    setStoreIds(ids);
    setAllStoreIds(ids);
  }, [storeData]);

  useEffect(() => {
    if (materialTypeAllData) setMaterialTypeData(materialTypeAllData);
  }, [materialTypeAllData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Project',
        accessor: 'project'
      },
      {
        Header: 'Store Name',
        accessor: 'store'
      },
      {
        Header: 'Material Type',
        accessor: 'materialType'
      },
      {
        Header: 'Received At Store',
        accessor: 'receivedAtStore'
      },
      {
        Header: 'At Contractor',
        accessor: 'receivedAtContractor'
      },
      {
        Header: 'At Installer',
        accessor: 'receivedAtInstaller'
      },
      {
        Header: 'Installed',
        accessor: 'installed'
      },
      {
        Header: 'Available At Store',
        accessor: 'availableAtStore'
      },
      {
        Header: 'Available At Contractor',
        accessor: 'availableAtContractor'
      },
      {
        Header: 'Available At Installer',
        accessor: 'availableAtInstaller'
      }
    ],
    []
  );
  const onFormSubmit = async (formValues) => {
    dispatch(
      getStoreWiseMaterialReport({
        projectId: getIds(formValues.projectId),
        storeId: storeIds && storeIds.length > 0 ? storeIds : allStoreIds,
        ...(formValues.materialTypeId && { materialTypeId: getIds(formValues.materialTypeId) })
      })
    );
    setShowTable(true);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganizationStores('420e7b13-25fd-4d23-9959-af1c07c7e94b'));
  }, [dispatch]);

  const onStoreSelected = (e) => {
    if (e) {
      setShowTable(false);
      setStoreIds(getIds(e));
      if (projectId && projectId.length > 0)
        dispatch(
          getMaterialTypesForReport({
            projectId: projectId,
            storeId: e && e.length > 0 ? getIds(e) : allStoreIds
          })
        );
    } else {
      setValue('materialTypeId', null);
      setMaterialTypeData([]);
    }
  };

  const afterTotal = (arr) => {
    let totalRow = {
      project: ' ',
      store: 'Total',
      materialType: ' ',
      receivedAtStore: 0,
      receivedAtContractor: 0,
      receivedAtInstaller: 0,
      installed: 0,
      availableAtStore: 0,
      availableAtContractor: 0,
      availableAtInstaller: 0
    };
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        totalRow.receivedAtStore += vl.receivedAtStore;
        totalRow.receivedAtContractor += vl.receivedAtContractor;
        totalRow.receivedAtInstaller += vl.receivedAtInstaller;
        totalRow.installed += vl.installed;
        totalRow.availableAtStore += vl.availableAtStore;
        totalRow.availableAtContractor += vl.availableAtContractor;
        totalRow.availableAtInstaller += vl.availableAtInstaller;
      });
    arr.push(totalRow);
    return arr;
  };

  const exportPdf = () => {
    const head = [];
    const body = [];
    columns.map((val) => {
      head.push(val.Header);
    });
    data &&
      afterTotal([...data]).map((nval) => {
        body.push([
          nval?.project,
          nval?.store,
          nval?.materialType,
          nval?.receivedAtStore,
          nval?.receivedAtContractor,
          nval?.receivedAtInstaller,
          nval?.installed,
          nval?.availableAtStore,
          nval?.availableAtContractor,
          nval?.availableAtInstaller
        ]);
      });
    SavePdf('Store-Wise-Material-Summary-Report', [head], body);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Store Wise Material Summary Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={3}>
              <RHFMultipleSelectbox
                name="projectId"
                label="Project"
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                onChange={(e) => {
                  setShowTable(false);
                  setValue('storeId', null);
                  setProjectId(getIds(e));
                  dispatch(
                    getMaterialTypesForReport({
                      projectId: getIds(e),
                      storeId: storeIds && storeIds.length > 0 ? storeIds : allStoreIds
                    })
                  );
                }}
                required
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFMultipleSelectbox
                name="storeId"
                label="Store"
                InputLabelProps={{ shrink: true }}
                menus={storeData}
                onChange={onStoreSelected}
                allowClear
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFMultipleSelectbox
                name="materialTypeId"
                label="Material Type"
                InputLabelProps={{ shrink: true }}
                menus={materialTypeData}
                allowClear
              />
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mb: '15px' }}>
                <Button type="submit" size="small" variant="contained" color="primary">
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {showTable ? (
            <>
              <TableForm
                title=" "
                data={afterTotal([...data])}
                hideActions
                hideAddButton
                accessTableOnly
                hidePagination
                exportPDFOnly={true}
                exportToPdf={exportPdf}
                count={data.length}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
                columns={columns}
              />
            </>
          ) : null}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default StoreWiseMaterialReport;
