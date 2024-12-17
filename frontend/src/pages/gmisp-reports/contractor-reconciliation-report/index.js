import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProjects } from '../../extra-pages/project/useProjects';
import { useMasterMakerLov } from '../../extra-pages/master-maker-lov/useMasterMakerLov';
import { useOrganizationStore } from '../../extra-pages/organization-store/useOrganizationStore';
import { useReports } from '../delivery-challan-report/useReport';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDeliveryReports, getDropdownOrganization, getDropdownProjects, getMasterMakerLov, getOrganizationStores } from 'store/actions';
import { concateNameAndCode, fetchTransactionType } from 'utils';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

const ContractorReconciliationReport = () => {
  const [showTable, setShowTable] = useState(false);
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        storeId: Validations.store,
        firmId: Validations.firm
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

  const projectData = projectsDropdown?.projectsDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const storeData = organizationStores?.organizationStoreObject?.rows;
  const organizationsData = organizationsDropdown?.organizationDropdownObject;
  const { deliveryReports } = useReports();
  const { data, count } = useMemo(
    () => ({
      data: deliveryReports.deliveryReportsObject?.rows || [],
      count: deliveryReports.deliveryReportsObject?.count || 0,
      isLoading: deliveryReports.loading || false
    }),
    [deliveryReports]
  );
  const columns = useMemo(
    () => [
      {
        Header: 'MIV No',
        accessor: 'referenceDocumentNumber'
      },
      {
        Header: 'Date',
        accessor: 'createdAt'
      },
      {
        Header: 'Name of Contractors',
        accessor: 'stock_ledgers[2].organization_store.name'
      },
      {
        Header: 'E-Way Bill No',
        accessor: 'eWayBillNumber'
      },
      {
        Header: 'E-Way Bill Qty',
        accessor: 'eWayBillQty'
      },
      {
        Header: 'Total Value of Challan ',
        accessor: 'totalChallanValue'
      },
      {
        Header: 'MatMovementType',
        accessor: 'stock_ledgers[1].transaction_type.name'
      },
      {
        Header: 'ReferenceDocNo',
        accessor: 'ReferenceDocNo'
      }
    ],
    []
  );
  const onFormSubmit = async (formValues) => {
    formValues['pageSize'] = pageSize;
    formValues['pageIndex'] = pageIndex;
    delete formValues['trxnType'];
    dispatch(getDeliveryReports(formValues));
    setShowTable(!showTable);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization(fetchTransactionType(orgTypeData, 'CONTRACTOR')));
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
  }, [dispatch, orgTypeData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Contractor Reconciliation Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="storeId" label="Store" InputLabelProps={{ shrink: true }} menus={storeData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="firmId"
                label="Contractor"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(organizationsData)}
                required
              />
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button type="submit" size="small" variant="contained" color="primary">
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {showTable ? (
            <TableForm
              title="Contractor Reconciliation Report"
              data={data}
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

export default ContractorReconciliationReport;
