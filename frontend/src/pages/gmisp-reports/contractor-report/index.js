import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useReports } from '../delivery-challan-report/useReport';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getContractorReports,
  getDropdownOrganization,
  getDropdownProjects,
  getMasterMakerLov,
  getMaterial,
  getOrganizationStores
} from 'store/actions';
import { concateNameAndCode, fetchTransactionType } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import { useMaterial } from 'pages/extra-pages/material/useMaterial';

const ContractorReports = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [showTable, setShowTable] = useState(false);
  const [newData, setNewData] = useState([]);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        storeId: Validations.store
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();
  const { organizationStores } = useOrganizationStore();
  const { organizationsDropdown } = useOrganizations();
  const { material } = useMaterial();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const storeData = organizationStores?.organizationStoreObject?.rows;
  const organizationsData = organizationsDropdown?.organizationDropdownObject;
  const materialData = material?.materialObject?.rows;
  const { contractorReports } = useReports();
  const { data, count } = useMemo(
    () => ({
      data: contractorReports.contractorReportsObject?.rows || [],
      count: contractorReports.contractorReportsObject?.count || 0,
      isLoading: contractorReports.loading || false
    }),
    [contractorReports]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'MIV No',
        accessor: 'referenceDocumentNumber'
      },
      {
        Header: 'MaterialName',
        accessor: 'material.name'
      },
      {
        Header: 'ContracterName',
        accessor: 'organization_store.name'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Rate',
        accessor: 'rate'
      },
      {
        Header: 'Value',
        accessor: 'value'
      },
      {
        Header: 'Action',
        accessor: 'transaction_type.name'
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getMaterial());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization(fetchTransactionType(orgTypeData, 'CONTRACTOR')));
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'CONTRACTOR') }));
  }, [dispatch, orgTypeData]);
  useEffect(() => {
    if (data) {
      const newArray = data.flatMap((x) => x?.stock_ledgers);
      setNewData(newArray);
    }
  }, [data]);
  const onFormSubmit = async (formValues) => {
    formValues['pageSize'] = pageSize;
    formValues['pageIndex'] = pageIndex;
    dispatch(getContractorReports(formValues));
    setShowTable(!showTable);
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Contractor Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="organizationId"
                label="Contractor Name"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(organizationsData || [])}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="storeId" label="Select Store" InputLabelProps={{ shrink: true }} menus={storeData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="materialId" label="Material Name" InputLabelProps={{ shrink: true }} menus={materialData} required />
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
            <TableForm
              title="Contractor Report"
              data={newData}
              count={count}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              columns={columns}
              hideActions
            />
          ) : null}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default ContractorReports;
