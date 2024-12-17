import { Grid, Button, Box } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProjects } from '../../extra-pages/project/useProjects';
import { useReports } from '../useReports';
import usePagination from 'hooks/usePagination';
import { FormProvider, RHFMultipleSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import {
  getContractorWiseMaterialSummaryReport,
  getDropdownOrganization,
  getDropdownProjects,
  getMaterialTypesForReport,
  getDropdownOrganizationStores,
  getOrganizationsLocationByParent
} from 'store/actions';
import Validations from 'constants/yupValidations';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';
import TableForm from 'tables/table';
import SavePdf from 'components/SavePdf';

// HARDCODED
const contractorOrganizationTypeId = 'decb6c57-6d85-4f83-9cc2-50e0630003df';

const columns = [
  {
    Header: 'Project',
    accessor: 'project'
  },
  {
    Header: 'Contractor Name',
    accessor: 'contractorName'
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
    Header: 'Available At Contractor',
    accessor: 'availableAtContractor'
  },
  {
    Header: 'Available At Installer',
    accessor: 'availableAtInstaller'
  }
];

const ContractorWiseMaterialSummaryReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [contractorIds, setContractorIds] = useState(null);
  const [allContractorIds, setAllContractorIds] = useState(null);
  const [storeIds, setStoreIds] = useState(null);
  const [allStoreIds, setAllStoreIds] = useState(null);
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

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const { handleSubmit, setValue } = methods;

  const { projectsDropdown } = useProjects();
  const { organizationStoresDropdown } = useOrganizationStore();
  const { organizationsDropdown } = useOrganizations();
  const { contractorWiseMaterialSummaryReport, materialTypeForReport } = useReports();
  const [materialTypeData, setMaterialTypeData] = useState([]);
  const { materialTypeAllData } = useMemo(
    () => ({
      materialTypeAllData: materialTypeForReport.materialTypeArr || [],
      isLoading: materialTypeForReport.loading || false
    }),
    [materialTypeForReport]
  );

  useEffect(() => {
    if (materialTypeAllData) setMaterialTypeData(materialTypeAllData);
  }, [materialTypeAllData]);

  const data = contractorWiseMaterialSummaryReport?.storeWiseMaterial || [];
  const count = data?.length || 0;

  const projectData = projectsDropdown?.projectsDropdownObject;
  const { storeData } = useMemo(
    () => ({
      storeData: organizationStoresDropdown?.organizationStoreDropdownObject?.rows || []
    }),
    [organizationStoresDropdown]
  );
  const { organizationsData } = useMemo(
    () => ({
      organizationsData: organizationsDropdown?.organizationDropdownObject || []
    }),
    [organizationsDropdown]
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
    const ids = [];
    organizationsData.map((vl) => ids.push(vl.id));
    setContractorIds(ids);
    setAllContractorIds(ids);
  }, [organizationsData]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getDropdownOrganization(contractorOrganizationTypeId));
  }, [dispatch]);

  useEffect(() => {
    if (!contractorIds) return;

    dispatch(getOrganizationsLocationByParent({ params: contractorOrganizationTypeId + '/' + contractorIds }));
    dispatch(getDropdownOrganizationStores(contractorOrganizationTypeId));
  }, [contractorIds, dispatch, organizationsData]);

  const onFormSubmit = async (formValues) => {
    dispatch(
      getContractorWiseMaterialSummaryReport({
        projectId: projectId,
        contractorId: contractorIds && contractorIds.length > 0 ? contractorIds : allContractorIds,
        storeId: storeIds && storeIds.length > 0 ? storeIds : allStoreIds,
        ...(formValues.materialTypeId && { materialTypeId: getIds(formValues.materialTypeId) })
      })
    );

    setShowTable(true);
  };

  const afterTotal = (paramData) => {
    let totalRow = {
      project: ' ',
      contractorName: ' ',
      store: 'Total',
      materialType: ' ',
      receivedAtContractor: 0,
      receivedAtInstaller: 0,
      installed: 0,
      availableAtContractor: 0,
      availableAtInstaller: 0
    };

    const arr = [...paramData];

    arr &&
      arr.length > 0 &&
      arr.forEach((vl) => {
        totalRow.receivedAtContractor += vl.receivedAtContractor || 0;
        totalRow.receivedAtInstaller += vl.receivedAtInstaller || 0;
        totalRow.installed += vl.installed || 0;
        totalRow.availableAtContractor += vl.availableAtContractor || 0;
        totalRow.availableAtInstaller += vl.availableAtInstaller || 0;
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
      afterTotal(data).map((nval) => {
        body.push([
          nval?.project,
          nval?.contractorName,
          nval?.store,
          nval?.materialType,
          nval?.receivedAtContractor,
          nval?.receivedAtInstaller,
          nval?.installed,
          nval?.availableAtContractor,
          nval?.availableAtInstaller
        ]);
      });

    SavePdf('Contractor-Wise-Material-Summary-Report', [head], body);
  };

  const onStoreSelected = (e) => {
    if (e) {
      setShowTable(false);
      setStoreIds(getIds(e));
      if (projectId && projectId.length > 0)
        dispatch(
          getMaterialTypesForReport({
            projectId: projectId,
            contractorId: contractorIds && contractorIds.length > 0 ? contractorIds : allContractorIds,
            storeId: e && e.length > 0 ? getIds(e) : allStoreIds
          })
        );
    } else {
      setValue('materialTypeId', null);
      setMaterialTypeData([]);
    }
  };

  return (
    <MainCard title={'Contractor Wise Material Summary Report'} sx={{ mb: 2 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={4}>
          <Grid item md={3} xl={2}>
            <RHFMultipleSelectbox
              name="projectId"
              label="Project"
              InputLabelProps={{ shrink: true }}
              menus={projectData}
              onChange={(e) => {
                setShowTable(false);
                setValue('contractorId', null);
                setProjectId(getIds(e));
                dispatch(
                  getMaterialTypesForReport({
                    projectId: getIds(e),
                    contractorId: contractorIds && contractorIds.length > 0 ? contractorIds : allContractorIds,
                    storeId: storeIds && storeIds.length > 0 ? storeIds : allStoreIds
                  })
                );
              }}
              required
            />
          </Grid>
          <Grid item md={3} xl={2}>
            <RHFMultipleSelectbox
              name="contractorId"
              label="Contractor"
              InputLabelProps={{ shrink: true }}
              menus={organizationsData}
              onChange={(e) => {
                setShowTable(false);
                setValue('storeId', null);
                setContractorIds(getIds(e));
                dispatch(
                  getMaterialTypesForReport({
                    projectId: projectId,
                    contractorId: e && e.length > 0 ? getIds(e) : allContractorIds,
                    storeId: storeIds && storeIds.length > 0 ? storeIds : allStoreIds
                  })
                );
              }}
              allowClear
            />
          </Grid>
          <Grid item md={3} xl={2}>
            <RHFMultipleSelectbox
              name="storeId"
              label="Store"
              InputLabelProps={{ shrink: true }}
              menus={storeData}
              onChange={onStoreSelected}
              allowClear
            />
          </Grid>
          <Grid item md={3} xl={2}>
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
      </FormProvider>

      {showTable && (
        <Box mt="3">
          <TableForm
            title=" "
            data={afterTotal(data)}
            hideActions
            hideAddButton
            accessTableOnly
            hidePagination
            exportPDFOnly={true}
            exportToPdf={exportPdf}
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            columns={columns}
          />
        </Box>
      )}
    </MainCard>
  );
};

export default ContractorWiseMaterialSummaryReport;
